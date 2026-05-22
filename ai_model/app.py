from flask import Flask, request, jsonify
import numpy as np
import cv2
import base64
import tensorflow as tf
from tensorflow.keras.models import load_model

app = Flask(__name__)

# ── Model yükleme ──────────────────────────────────────────────────────────────
harf_modeli = load_model('izge_bdpqgk_model.keras')
print("✅ Harf modeli yüklendi:", harf_modeli.output_shape)

try:
    kelime_modeli = load_model('izge_kelime_model.keras')
    print("✅ Kelime modeli yüklendi:", kelime_modeli.output_shape)
except Exception as e:
    print("❌ Kelime modeli YÜKLENEMEDİ:", e)
    kelime_modeli = None

HARF_SINIFLAR  = {0: 'b', 1: 'd', 2: 'g', 3: 'k', 4: 'p', 5: 'q'}
KELIME_SINIFLAR = {0: 'baba', 1: 'dede', 2: 'gemi', 3: 'para', 4: 'kalem'}


# ── Yardımcı: koordinatlardan görüntü üret ────────────────────────────────────
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

    # Kalınlık: kelime modeli için 3, harf için 3
    # (model skeleton+dilate k=3 ile eğitildi)
    kalinlik = 3

    for i in range(len(noktalar) - 1):
        x1 = int(round(float(noktalar[i][0])))
        y1 = int(round(float(noktalar[i][1])))
        x2 = int(round(float(noktalar[i + 1][0])))
        y2 = int(round(float(noktalar[i + 1][1])))

        x1 = int(np.clip(x1, 0, boyut_w - 1))
        y1 = int(np.clip(y1, 0, boyut_h - 1))
        x2 = int(np.clip(x2, 0, boyut_w - 1))
        y2 = int(np.clip(y2, 0, boyut_h - 1))

        cv2.line(goruntu, (x1, y1), (x2, y2), 255, thickness=kalinlik)

    return goruntu


# ── /tahmin ────────────────────────────────────────────────────────────────────
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
            goruntu = koordinatlardan_goruntu(koordinatlar, boyut_w=128, boyut_h=32)
            model   = kelime_modeli
            siniflar = KELIME_SINIFLAR
            input_shape = (1, 32, 128, 1)
        else:
            goruntu = koordinatlardan_goruntu(koordinatlar, boyut_w=28, boyut_h=28)
            model   = harf_modeli
            siniflar = HARF_SINIFLAR
            input_shape = (1, 28, 28, 1)

        if goruntu is None:
            return jsonify({'hata': 'Yetersiz koordinat'}), 400

        giris = goruntu.reshape(input_shape).astype('float32') / 255.0

        olasiliklar  = model.predict(giris, verbose=0)[0]
        tahmin_index = int(np.argmax(olasiliklar))
        tahmin_sonuc = siniflar[tahmin_index]
        guven        = float(olasiliklar[tahmin_index])

        return jsonify({
            'tahmin':  tahmin_sonuc,
            'hedef':   hedef,
            'guven':   round(guven * 100, 1),
            'karisti': (tahmin_sonuc != hedef) if hedef else False
        })

    except Exception as e:
        return jsonify({'hata': str(e)}), 500


# ── /debug-son — Flask'ın ürettiği görüntüyü base64 olarak döner ──────────────
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

        # 8x büyüt — tarayıcıda görmek için
        buyuk = cv2.resize(g, (g.shape[1] * 8, g.shape[0] * 8),
                           interpolation=cv2.INTER_NEAREST)
        _, buf = cv2.imencode('.png', buyuk)
        b64 = base64.b64encode(buf).decode()

        return jsonify({
            'goruntu':        b64,
            'shape':          list(g.shape),
            'beyaz_piksel':   int(np.sum(g > 0)),
            'koordinat_sayisi': len(koordinatlar),
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


# ── /saglik ───────────────────────────────────────────────────────────────────
@app.route('/saglik', methods=['GET'])
def saglik():
    return jsonify({'durum': 'aktif', 'modeller': {
        'harf':  'yüklü',
        'kelime': 'yüklü' if kelime_modeli else 'eksik'
    }})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)