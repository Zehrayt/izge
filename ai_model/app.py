from flask import Flask, request, jsonify
import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Model bir kere yüklensin, her istekte tekrar yüklenmesin
model = load_model('izge_bdpq_model.keras')
SINIFLAR = {0: 'b', 1: 'd', 2: 'p', 3: 'q'}

def koordinatlardan_goruntu(koordinatlar, boyut=28):
    """
    Frontend'den gelen [{x, y, time}] listesini
    28x28 siyah-beyaz görüntüye çevirir.
    """
    if not koordinatlar or len(koordinatlar) < 2:
        return None

    # Koordinatları numpy dizisine al
    noktalar = np.array([[k['x'], k['y']] for k in koordinatlar], dtype=np.float32)

    # Canvas boyutu 800x400, 28x28'e normalize et
    x_min, y_min = noktalar.min(axis=0)
    x_max, y_max = noktalar.max(axis=0)

    # Sıfıra bölme koruması
    x_aralik = x_max - x_min if x_max != x_min else 1
    y_aralik = y_max - y_min if y_max != y_min else 1

    # Normalize et, 4px kenar boşluğu bırak
    noktalar[:, 0] = (noktalar[:, 0] - x_min) / x_aralik * 20 + 4
    noktalar[:, 1] = (noktalar[:, 1] - y_min) / y_aralik * 20 + 4

    # Siyah zemin üzerine beyaz çizgi
    goruntu = np.zeros((boyut, boyut), dtype=np.uint8)
    for i in range(len(noktalar) - 1):
        x1, y1 = int(noktalar[i][0]),   int(noktalar[i][1])
        x2, y2 = int(noktalar[i+1][0]), int(noktalar[i+1][1])
        cv2.line(goruntu, (x1, y1), (x2, y2), 255, thickness=2)

    return goruntu

@app.route('/tahmin', methods=['POST'])
def tahmin():
    try:
        veri = request.get_json()
        koordinatlar = veri.get('koordinatlar', [])
        hedef        = veri.get('hedefKarakter', '')

        goruntu = koordinatlardan_goruntu(koordinatlar)
        if goruntu is None:
            return jsonify({'hata': 'Yetersiz koordinat'}), 400

        # Modele hazırla: (1, 28, 28, 1), normalize
        giris = goruntu.reshape(1, 28, 28, 1).astype('float32') / 255.0

        tahmin_olasiliklari = model.predict(giris, verbose=0)[0]
        tahmin_index        = int(np.argmax(tahmin_olasiliklari))
        tahmin_harf         = SINIFLAR[tahmin_index]
        guven               = float(tahmin_olasiliklari[tahmin_index])

        # Karıştırma tespiti
        karisti = (tahmin_harf != hedef) if hedef else False

        return jsonify({
            'tahmin':     tahmin_harf,
            'hedef':      hedef,
            'guven':      round(guven * 100, 1),
            'karisti':    karisti,
            'olasiliklar': {
                SINIFLAR[i]: round(float(tahmin_olasiliklari[i]) * 100, 1)
                for i in range(4)
            }
        })

    except Exception as e:
        return jsonify({'hata': str(e)}), 500

@app.route('/saglik', methods=['GET'])
def saglik():
    return jsonify({'durum': 'aktif', 'model': 'bdpq_v1'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)