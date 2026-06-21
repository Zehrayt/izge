from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import base64
import tensorflow as tf
from tensorflow.keras.models import load_model
import torch
import torch.nn as nn
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
CORS(app)

# ════════════════════════════════════════════════════════════
#  PYTORCH MODEL MİMARİLERİ
# ════════════════════════════════════════════════════════════

# ── 1. PyTorch Metin (CharCNN) Modeli ──
alphabet = " abcdefghijklmnopqrstuvwxyz0123456789-,;.!?:'\"/\\|_@#$%^&*~`+-=<>()[]{}ğüşıöç"
char2int = {char: i + 1 for i, char in enumerate(alphabet)}
vocab_size = len(alphabet) + 1
MAX_LENGTH = 250

def encode_text(text):
    text = str(text).lower()
    encoded = [char2int.get(char, 0) for char in text]
    if len(encoded) > MAX_LENGTH:
        encoded = encoded[:MAX_LENGTH]
    else:
        encoded = encoded + [0] * (MAX_LENGTH - len(encoded))
    return encoded

class CharCNNDeep(nn.Module):
    def __init__(self, vocab_size, embed_dim=64, num_filters=256):
        super(CharCNNDeep, self).__init__()
        self.embedding = nn.Embedding(num_embeddings=vocab_size, embedding_dim=embed_dim, padding_idx=0)
        self.conv1 = nn.Conv1d(in_channels=embed_dim, out_channels=num_filters, kernel_size=3, padding=1)
        self.conv2 = nn.Conv1d(in_channels=num_filters, out_channels=num_filters, kernel_size=5, padding=2)
        self.conv3 = nn.Conv1d(in_channels=num_filters, out_channels=num_filters, kernel_size=7, padding=3)
        self.relu = nn.ReLU()
        self.pool = nn.AdaptiveMaxPool1d(1)
        self.dropout = nn.Dropout(0.5)
        self.fc1 = nn.Linear(num_filters, 64)
        self.fc2 = nn.Linear(64, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = self.embedding(x).transpose(1, 2)
        x = self.relu(self.conv1(x))
        x = self.relu(self.conv2(x))
        x = self.relu(self.conv3(x))
        x = self.pool(x).squeeze(-1)
        x = self.dropout(x)
        x = self.relu(self.fc1(x))
        x = self.fc2(x)
        return self.sigmoid(x).squeeze(-1)

# ── 2. PyTorch Kelime (IzgeHafifCNN) Modeli ──
#    Notebook'taki mimariyle birebir aynı olmalı
KELIME_SINIFLAR = {0: 'baba', 1: 'dede', 2: 'gemi', 3: 'kalem', 4: 'para'}

class IzgeHafifCNN(nn.Module):
    """
    Orijinal mimari + BatchNorm2d.
    Filtre sayıları, FC boyutu, Dropout aynı.
    """
    def __init__(self, sinif_sayisi=5):
        super().__init__()
        # --- 2 blok, 16 ve 32 filtre ---
        self.conv1 = nn.Conv2d(1, 16, kernel_size=3, padding=1)
        self.bn1   = nn.BatchNorm2d(16)
        self.relu1 = nn.ReLU()
        self.pool1 = nn.MaxPool2d(2, 2)

        self.conv2 = nn.Conv2d(16, 32, kernel_size=3, padding=1)
        self.bn2   = nn.BatchNorm2d(32)
        self.relu2 = nn.ReLU()
        self.pool2 = nn.MaxPool2d(2, 2)

        # --- FC: 32*8*32 → 128 ---
        self.fc1 = nn.Linear(32 * 8 * 32, 128)
        self.relu3 = nn.ReLU()
        self.dropout = nn.Dropout(0.5)
        self.fc2 = nn.Linear(128, sinif_sayisi)

    def forward(self, x):
        x = self.pool1(self.relu1(self.bn1(self.conv1(x))))
        x = self.pool2(self.relu2(self.bn2(self.conv2(x))))
        x = x.view(x.size(0), -1)
        x = self.relu3(self.fc1(x))
        x = self.dropout(x)
        return self.fc2(x)

# ════════════════════════════════════════════════════════════
#  MODEL YÜKLEME
# ════════════════════════════════════════════════════════════

# Keras harf modeli (b, d, p, q, g, k)
harf_modeli = load_model(os.path.join(BASE_DIR, 'izge_bdpqgk_model.keras'))
print("✅ Harf modeli yüklendi:", harf_modeli.output_shape)

# PyTorch kelime modeli (baba, dede, gemi, kalem, para)
try:
    KELIME_MODEL_YOLU = os.path.join(BASE_DIR, 'izge_kelime_model.pth')
    kelime_modeli = IzgeHafifCNN(sinif_sayisi=5)
    kelime_modeli.load_state_dict(torch.load(KELIME_MODEL_YOLU, map_location=torch.device('cpu')))
    kelime_modeli.eval()
    print("✅ PyTorch Kelime Modeli yüklendi!")
except Exception as e:
    print("❌ Kelime modeli YÜKLENEMEDİ:", e)
    kelime_modeli = None

# PyTorch metin (CharCNN) modeli
try:
    PYTORCH_MODEL_YOLU = os.path.join(BASE_DIR, 'disleksi_twitter_wikipedia_2.pth')
    metin_modeli = CharCNNDeep(vocab_size=vocab_size)
    metin_modeli.load_state_dict(torch.load(PYTORCH_MODEL_YOLU, map_location=torch.device('cpu')))
    metin_modeli.eval()
    print("✅ PyTorch Metin Modeli yüklendi!")
except Exception as e:
    print("❌ PyTorch Metin Modeli YÜKLENEMEDİ:", e)
    metin_modeli = None

HARF_SINIFLAR = {0: 'b', 1: 'd', 2: 'g', 3: 'k', 4: 'p', 5: 'q'}


# ════════════════════════════════════════════════════════════
#  YARDIMCI: KOORDİNATLARDAN GÖRÜNTÜ ÜRETİMİ
# ════════════════════════════════════════════════════════════

def koordinatlardan_goruntu(koordinatlar, boyut_w=28, boyut_h=28):
    if not koordinatlar or len(koordinatlar) < 2:
        return None

    noktalar = np.array([[k['x'], k['y']] for k in koordinatlar], dtype=np.float32)

    x_min, y_min = noktalar.min(axis=0)
    x_max, y_max = noktalar.max(axis=0)

    x_aralik = x_max - x_min if x_max != x_min else 1
    y_aralik = y_max - y_min if y_max != y_min else 1

    pad_x = boyut_w * 0.1
    pad_y = boyut_h * 0.1

    noktalar[:, 0] = (noktalar[:, 0] - x_min) / x_aralik * (boyut_w - 2 * pad_x) + pad_x
    noktalar[:, 1] = (noktalar[:, 1] - y_min) / y_aralik * (boyut_h - 2 * pad_y) + pad_y

    goruntu = np.zeros((boyut_h, boyut_w), dtype=np.uint8)
    kalinlik = 3

    for i in range(len(noktalar) - 1):
        x1 = int(np.clip(round(float(noktalar[i][0])), 0, boyut_w - 1))
        y1 = int(np.clip(round(float(noktalar[i][1])), 0, boyut_h - 1))
        x2 = int(np.clip(round(float(noktalar[i + 1][0])), 0, boyut_w - 1))
        y2 = int(np.clip(round(float(noktalar[i + 1][1])), 0, boyut_h - 1))
        cv2.line(goruntu, (x1, y1), (x2, y2), 255, thickness=kalinlik)

    return goruntu


# ════════════════════════════════════════════════════════════
#  ENDPOINT: /tahmin  (harf ve kelime çizim tahmini)
# ════════════════════════════════════════════════════════════

@app.route('/tahmin', methods=['POST'])
def tahmin():
    try:
        veri = request.get_json()
        koordinatlar = veri.get('koordinatlar', [])
        hedef = veri.get('hedefKarakter', '')
        tip = veri.get('tip', 'harf')

        if tip == 'kelime':
            if kelime_modeli is None:
                return jsonify({'hata': 'Kelime modeli mevcut değil'}), 500

            # Görüntüyü modelin beklediği formata hazırlıyoruz: (1, 1, 32, 128)
            goruntu = koordinatlardan_goruntu(koordinatlar, boyut_w=128, boyut_h=32)
            if goruntu is None:
                return jsonify({'hata': 'Yetersiz koordinat'}), 400

            # PyTorch için: (batch, kanal, yükseklik, genişlik)
            giris = torch.tensor(
                goruntu.reshape(1, 1, 32, 128).astype('float32') / 255.0,
                dtype=torch.float32
            )

            with torch.no_grad():
                cikti = kelime_modeli(giris)            # (1, 5)
                olasiliklar = torch.softmax(cikti, dim=1)[0].numpy()

            tahmin_index = int(np.argmax(olasiliklar))
            tahmin_sonuc = KELIME_SINIFLAR[tahmin_index]
            guven = float(olasiliklar[tahmin_index])

        else:  # harf (Keras)
            goruntu = koordinatlardan_goruntu(koordinatlar, boyut_w=28, boyut_h=28)
            if goruntu is None:
                return jsonify({'hata': 'Yetersiz koordinat'}), 400

            giris = goruntu.reshape(1, 28, 28, 1).astype('float32') / 255.0
            olasiliklar = harf_modeli.predict(giris, verbose=0)[0]
            tahmin_index = int(np.argmax(olasiliklar))
            tahmin_sonuc = HARF_SINIFLAR[tahmin_index]
            guven = float(olasiliklar[tahmin_index])

        return jsonify({
            'tahmin':  tahmin_sonuc,
            'hedef':   hedef,
            'guven':   round(guven * 100, 1),
            'karisti': (tahmin_sonuc != hedef) if hedef else False
        })

    except Exception as e:
        return jsonify({'hata': str(e)}), 500


# ════════════════════════════════════════════════════════════
#  ENDPOINT: /tahmin-metin  (CharCNN disleksi metin analizi)
# ════════════════════════════════════════════════════════════

@app.route('/tahmin-metin', methods=['POST'])
def tahmin_metin():
    if metin_modeli is None:
        return jsonify({'hata': 'PyTorch metin modeli henüz yüklenmedi veya dosya eksik.'}), 500
    try:
        veri = request.get_json()
        gelen_metin = veri.get('metin', '')
        if not gelen_metin.strip():
            return jsonify({'hata': 'Lütfen bir metin giriniz.'}), 400

        encoded_metin = encode_text(gelen_metin)
        tensor_giris = torch.tensor([encoded_metin], dtype=torch.long)

        with torch.no_grad():
            olasilik = metin_modeli(tensor_giris).item()

        disleksi_yuzdesi = round(olasilik * 100, 2)
        karar = "🔴 DİSLEKSİ RİSKİ YÜKSEK" if disleksi_yuzdesi > 50.0 else "🟢 NORMAL"

        return jsonify({
            'orijinal_metin':    gelen_metin,
            'disleksi_yuzdesi': f"%{disleksi_yuzdesi}",
            'karar':             karar,
            'is_disleksi':       disleksi_yuzdesi > 50.0
        })
    except Exception as e:
        return jsonify({'hata': str(e)}), 500


# ════════════════════════════════════════════════════════════
#  ENDPOINT: /debug-son  (Canvas görüntüsünü base64 döner)
# ════════════════════════════════════════════════════════════

@app.route('/debug-son', methods=['POST'])
def debug_son():
    try:
        veri = request.get_json()
        koordinatlar = veri.get('koordinatlar', [])
        tip = veri.get('tip', 'harf')

        if tip == 'kelime':
            g = koordinatlardan_goruntu(koordinatlar, boyut_w=128, boyut_h=32)
        else:
            g = koordinatlardan_goruntu(koordinatlar, boyut_w=28, boyut_h=28)

        if g is None:
            return jsonify({'hata': 'Görüntü üretilemedi — koordinat yok'}), 400

        buyuk = cv2.resize(g, (g.shape[1] * 8, g.shape[0] * 8),
                           interpolation=cv2.INTER_NEAREST)
        _, buf = cv2.imencode('.png', buyuk)
        b64 = base64.b64encode(buf).decode()

        return jsonify({
            'goruntu':           b64,
            'shape':             list(g.shape),
            'beyaz_piksel':      int(np.sum(g > 0)),
            'koordinat_sayisi':  len(koordinatlar),
            'x_aralik': [
                float(min(k['x'] for k in koordinatlar)),
                float(max(k['x'] for k in koordinatlar))
            ] if koordinatlar else [],
            'y_aralik': [
                float(min(k['y'] for k in koordinatlar)),
                float(max(k['y'] for k in koordinatlar))
            ] if koordinatlar else []
        })
    except Exception as e:
        return jsonify({'hata': str(e)}), 500


# ════════════════════════════════════════════════════════════
#  ENDPOINT: /saglik
# ════════════════════════════════════════════════════════════

@app.route('/saglik', methods=['GET'])
def saglik():
    return jsonify({'durum': 'aktif', 'modeller': {
        'harf':    'yüklü',
        'kelime':  'yüklü' if kelime_modeli else 'eksik',
        'metin':   'yüklü' if metin_modeli  else 'eksik',
    }})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)
