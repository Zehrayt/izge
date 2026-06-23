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

### 3. [PyTorch Kelime Çizim Modeli (IzgeHafifCNN)](https://colab.research.google.com/drive/1U5o8Hg4XdpdG0IueHr_z2kWoE_6RAOYh?usp=sharing)
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

### 4. [PyTorch Yazım (Klavye) Analiz Modeli (CharCNN)](https://colab.research.google.com/drive/1qFj0ZhLEbyeThpuzhiFhR-uvhvMNzdl_?usp=sharing)
Kullanıcının serbest metin girişlerindeki yazım hatalarını ve klavye ritmini **CharCNN** altyapısıyla analiz ederek disleksi risk skoru üreten NLP modelidir. `disleksi_twitter_wikipedia_2.pth` dosyasına kaydedilir.

* Harf dizilişlerindeki anomalileri yakalamak için kullanılan modeli eğitmek ve veri üretmek için [Hugging Face](https://huggingface.co/) üzerindeki şu veri setlerinden faydalanılmıştır:

- **[Türkçe Twitter Veri Seti](https://huggingface.co/datasets/winvoker/turkish-sentiment-analysis-dataset):** Projede sosyal medya dilini ve klavye hatalarını (typo) modelleyebilmek için Twitter verileri çekildi.
- **[Alternatif Twitter (Offensive) Seti](https://huggingface.co/datasets/Toygar/turkish-offensive-language-detection):** Ana veri setinde kesinti olması durumunda yedek Twitter kaynağı olarak kullanıldı.
- **[Wikipedia TR Seti](https://huggingface.co/datasets/wikimedia/wikipedia):** Kurallı ve temiz Türkçe (Normal-0) cümle yapılarını modele öğretmek için kullanıldı.
Sadece Wikipedia kullanılmaması yanında Twitter verisinin kullanılma sebebi modelin sadece akademik  cümleleri normal kabul etmesini engellemek, modele günlük dili öğretmektir.

Model, karakter dizilimlerindeki anomalileri yakalamak amacıyla ardışık 1-Boyutlu Evrişim Katmanlarından (1D CNN) oluşan bir yapıya sahiptir:

* **Embedding:** Girişteki 250 karakter uzunluğundaki seyrek diziler, `nn.Embedding(78, 64)` katmanı ile yoğun vektör uzayına çevrilir.
* **CNN Bloğu (1D CNN):** Ardışık üç adet `nn.Conv1d` katmanı (Filtre Sayısı: 256; Kernel Boyutları: 3, 5, 7) kullanılarak mikro düzeydeki anlık tipografik hatalardan (typo), hece yutulmalarına ve makro düzeydeki bütünsel morfolojik bozulmalara kadar geniş bir spektrumda hata taraması gerçekleştirilir.
* **Pooling ve Dropout:** `AdaptiveMaxPool1d` katmanı ile zamansal boyuttaki en baskın hata sinyalleri süzülür. Fully connected katman öncesinde modelin ezberlemesini önlemek amacıyla **%50 Dropout** regülasyonu uygulanır.
* **Dense Layers:** Öznitelikler iki aşamalı doğrusal katmandan (`Linear: 256 -> 64 -> 1`) geçirilip `Sigmoid` aktivasyon fonksiyonu ile normalize edilerek `[0.0, 1.0]` aralığında olasılıksal bir disleksi risk skoru üretilir.

  
Modelin optimizasyon sürecinde kullanılan hiperparametre konfigürasyonları aşağıda listelenmiştir:

* **Yığın Boyutu (Batch Size):** 64
* **Öğrenme Oranı (Learning Rate):** 0.001
* **Eğitim Döngüsü (Epochs):** 15
* **Kayıp Fonksiyonu (Loss Function):** `BCELoss` (Binary Cross Entropy Loss)
* **Optimizasyon Algoritması:** `Adam` (Adaptive Moment Estimation)
* **Veri Kümesi Bölümlemesi:** %80 Eğitim (Train), %10 Doğrulama (Validation), %10 Test (Katmanlı/Stratified örnekleme ile sınıf dengesi korunmuştur).

Modelin sınıflandırma performansı, eğitim sürecine dahil edilmeyen **4641 örneklemden** oluşan  test seti üzerinde değerlendirilmiştir. Sınıf bazlı metrikler, makro ve ağırlıklı ortalamalar ile modelin genel başarım tablosu aşağıda sunulmuştur:

| Sınıf / Metrik | Kesinlik (Precision) | Duyarlılık (Recall) | F1-Skoru | Destek Örneği (Support) |
| :--- | :---: | :---: | :---: | :---: |
| **Normal (0)** | 0.91 | 0.97 | 0.94 | 2669 |
| **Disleksi (1)** | 0.96 | 0.86 | 0.91 | 1972 |
| **Genel Doğruluk (Accuracy)** | | | **0.92** | **4641** |
| **Makro Ortalama (Macro Avg)** | 0.93 | 0.92 | 0.92 | 4641 |
| **Ağırlıklı Ortalama (Weighted Avg)** | 0.93 | 0.92 | 0.92 | 4641 |

Test sürecinde modelin ürettiği tahminlerin gerçek etiketlerle olan confusion matrisi  şu şekildedir:

| | **Tahmin: Normal (0)** | **Tahmin: Disleksi (1)** |
| :--- | :---: | :---: |
| **Gerçek: Normal (0)** | **2589 (Doğru Negatif)** | 80 (Yalancı Pozitif) |
| **Gerçek: Disleksi (1)** | 270 (Yalancı Negatif) | **1702 (Doğru Pozitif)** |

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
