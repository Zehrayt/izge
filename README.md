# İzge - Yapay Zeka Destekli Disleksi Tanı ve Analiz Sistemi

İzge, kullanıcıların okuma, yazma (klavye) ve motor becerilerini (çizim) analiz ederek yapay zeka destekli disleksi risk tespiti yapan kapsamlı bir web uygulamasıdır.

---

## Kullanılan Teknolojiler

**Frontend (Kullanıcı Arayüzü)**
* **React:** Kullanıcı arayüzü ve state yönetimi.
* **Recharts:** Gelişim raporundaki dinamik veri görselleştirmeleri ve grafikler.
* **Tailwind CSS / Custom CSS:** Modern ve duyarlı (responsive) tasarım.

**Backend (Sunucu ve Veritabanı)**
* **Spring Boot (Java):** Ana iş mantığı, risk metrik hesaplamaları ve API yönetimi.
* **MySQL:** Kullanıcı oturumlarının, risk skorlarının ve geçmiş analizlerin tutulduğu ilişkisel veritabanı.

**Yapay Zeka ve Model Sunucusu**
* **Python & Flask:** AI modellerini dış dünyaya açan mikro web sunucusu.
* **TensorFlow & Keras:** Harf çizim (görüntü işleme) modelinin inşası ve eğitimi.
* **PyTorch:** Kelime çizim modelinin (IzgeHafifCNN) ve klavye/metin analizi yapan NLP (CharCNN) modelinin inşası.
* **OpenCV (cv2):** Görüntülerin modele girmeden önce temizlenmesi, inceltilmesi (erosion) ve kalınlaştırılması (dilation) gibi morfolojik işlemler.
* **NumPy & Pandas:** Veri manipülasyonu ve matris işlemleri.
* **Scikit-learn:** Veri setlerinin eğitim/test olarak ayrılması ve model analizi (confusion matrix).
* **Pillow (PIL):** Sentetik veri üretimi sırasında dijital fontların (Ubuntu-Light) tuvale çizdirilmesi.

---

## Modellerimiz, Veri Setleri ve Eğitim Süreçleri

Projemizde disleksi riskini saptamak amacıyla özel olarak eğitilmiş Derin Öğrenme modelleri kullanılmaktadır.

### 1. [Temel Harf Modeli (Kapsamlı Karakter Analizi)](https://colab.research.google.com/drive/1Sa2jxJLAwkI-t3LFLhGbWEw89Nk_Ri5y?usp=sharing)
Uygulamadaki tüm alfabe harflerinin çizim varyasyonlarını öğrenen ana modeldir. **Keras / TensorFlow** ile eğitilmiş olup `izge_bdpqgk_model.keras` dosyasına kaydedilmiştir. 4 aşamalı bir pipeline ile eğitilmiştir:

* **Aşama 1 (Temel Vizyon):** [EMNIST Veri Seti](https://www.nist.gov/itl/iad/image-group/emnist-dataset) (Letters) kullanılarak temel harf hatları öğretilmiştir.
* **Aşama 2 (Veri Çoğaltma):** [T-H-E Dataset](https://github.com/bartosgaye/thedataset) kullanılarak `cv2.dilate` ile veri çeşitliliği artırılmıştır.
* **Aşama 3 (Sentetik Veri):** Ubuntu-Light fontu ile Pillow kütüphanesiyle kusursuz Türkçe harf görüntüleri üretilmiştir.
* **Aşama 4 (İnce Ayar):** Projemiz için **~21.000 adet gerçek insan el yazısı** ile 29 sınıflı (Türkçe alfabe) nihai versiyona ulaşılmıştır. [El yazısı verisi](https://drive.google.com/drive/folders/1x8znRCDLU_i7m5WmKqC_xjEyDXnNW3yR)

### 2. [Spesifik Harf Analiz Modeli (b, d, p, q, g, k)](https://colab.research.google.com/drive/1en81yYCYbnx2Fkk-3BwN5KFTDMp2si5q?usp=sharing)
Dislekside en sık karıştırılan 6 harfe odaklanan özelleştirilmiş modeldir. **Keras** ile eğitilmiş olup `izge_bdpqgk_model.keras` dosyası olarak kaydedilir.

* [EMNIST ByClass](https://www.tensorflow.org/datasets/catalog/emnist) içinden yalnızca bu 6 harfin etiketleri filtrelenmiş ve temel modele Transfer Learning uygulanmıştır.
* Gerçek çizim koşullarını taklit etmek için `cv2.erode` ile morfolojik inceltme yapılmıştır.

### 3. [PyTorch Kelime Çizim Modeli (IzgeHafifCNN)](https://drive.google.com/file/d/13AW2s7y1ak6wRPQmnvoLo_cdzgciBIiz/view?usp=sharing)
Kullanıcının Canvas üzerine çizdiği kelimeleri (baba, dede, gemi, kalem, para) tanıyan görüntü sınıflandırma modelidir. **PyTorch** ile eğitilmiş olup `izge_kelime_model.pth` dosyasına kaydedilir.

* **Veri Seti:** Hazır bir veri seti kullanılmamıştır — ekip üyeleri tarafından bu 5 kelime, ekrana elle çizilerek **1050 adet özgün el yazısı görseli** olarak toplanmış ve etiketlenmiştir.
* **Mimari:** 2 katmanlı `Conv2d` + `BatchNorm2d` + `MaxPool2d` bloğu (16 → 32 filtre), ardından tam bağlantılı katmanlar ve `Dropout(0.5)` ile overfitting önlemi.
* **Giriş Boyutu:** `(batch, 1, 32, 128)` — yükseklik 32, genişlik 128 piksel gri tonlamalı görüntü.
* **Test Sonuçları:** 158 örneklik test setinde **%91 genel doğruluk (accuracy)** elde edilmiştir.

  | Kelime  | Precision | Recall | F1-score |
  |---------|-----------|--------|----------|
  | baba    | 0.84      | 0.87   | 0.85     |
  | dede    | 0.93      | 0.87   | 0.90     |
  | gemi    | 1.00      | 0.92   | 0.96     |
  | kalem   | 0.93      | 0.87   | 0.90     |
  | para    | 0.83      | 1.00   | 0.91     |

### 4. PyTorch Yazım (Klavye) Analiz Modeli (CharCNN)
Kullanıcının serbest metin girişlerindeki yazım hatalarını ve klavye ritmini **CharCNN** altyapısıyla analiz ederek disleksi risk skoru üreten NLP modelidir. `disleksi_twitter_wikipedia_2.pth` dosyasına kaydedilir.

* Harf dizilişlerindeki ardışık anomalileri yakalamak için **Türkçe Wikipedia** ve **Twitter (X)** veri setleriyle eğitilmiştir.

---

## Proje Mimarisi ve Çalışma Mantığı

1. **Veri Toplama:** Kullanıcıdan klavye üzerinden serbest metin (ve tuşlama aralık süreleri) ile Canvas üzerinden harf/kelime çizimleri (x, y, zaman koordinatları) alınır.
2. **AI Tahmini:** Veriler Python (Flask) sunucusundaki PyTorch ve Keras modellerine iletilerek anlık tahmin ve hata olasılıkları analiz edilir.
3. **Genel Risk Skorlaması:** Spring Boot; AI sonuçlarını (%75 ağırlık), çizim titremesini, duraksama sürelerini ve silme (backspace) sayılarını birleştirerek `%0`–`%100` arasında kapsamlı bir **Oturum Risk Skoru** üretir.
4. **Raporlama:** Sonuçlar MySQL veritabanına kaydedilir ve kullanıcıya zamansal gelişim grafikleriyle sunulur.

---

## Kurulum

### Gereksinimler
* Python 3.10+
* Java 17+
* MySQL
* Node.js 18+

### 1. MySQL
```sql
CREATE DATABASE izge_db CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;
```

### 2. Spring Boot Backend
```bash
./mvnw spring-boot:run
```
`application.properties` dosyasında MySQL bağlantı bilgilerini ayarlayın.

### 3. Python (Flask) Sunucusu
```bash
cd ai_model
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### 4. React Frontend
```bash
cd izge-frontend
npm install
npm run dev
```
