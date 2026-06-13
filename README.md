# İzge - Yapay Zeka Destekli Disleksi Tanı ve Analiz Sistemi

İzge, kullanıcıların okuma, yazma (klavye) ve motor becerilerini (çizim) analiz ederek yapay zeka destekli disleksi risk tespiti yapan kapsamlı bir web uygulamasıdır. 

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
* **TensorFlow & Keras:** Çizim (görüntü işleme) modellerinin inşası ve eğitimi.
* **PyTorch:** Klavye/Metin analizi yapan NLP (CharCNN) modelinin inşası.
* **OpenCV (cv2):** Görüntülerin modele girmeden önce temizlenmesi, inceltilmesi (erosion) ve kalınlaştırılması (dilation) gibi morfolojik işlemler.
* **NumPy & Pandas:** Veri manipülasyonu ve matris işlemleri.
* **Scikit-learn:** Veri setlerinin eğitim/test olarak ayrılması (train_test_split) ve model analizi (confusion matrix).
* **Pillow (PIL):** Sentetik veri üretimi sırasında dijital fontların (Ubuntu-Light) tuvale çizdirilmesi.

---

## Modellerimiz, Veri Setleri ve Eğitim Süreçleri

Projemizde disleksi riskini saptamak amacıyla özel olarak eğitilmiş Derin Öğrenme (Deep Learning) modelleri kullanılmaktadır. Jürilerimizin ve geliştiricilerin inceleyebilmesi için model eğitim aşamalarını içeren Google Colab çalışma not defterlerimiz aşağıda paylaşılmıştır:

### 1. [Temel Harf Modeli (Kapsamlı Karakter Analizi)](https://colab.research.google.com/drive/1Sa2jxJLAwkI-t3LFLhGbWEw89Nk_Ri5y?usp=sharing)
Uygulamadaki tüm alfabe harflerinin çizim varyasyonlarını ve yapısal özelliklerini öğrenen, sistemin temel altyapısını oluşturan ana modeldir. Karmaşık bir boru hattı (pipeline) ile 4 aşamada eğitilmiştir:

* **Aşama 1 (Temel Vizyon):** [EMNIST Veri Seti](https://www.nist.gov/itl/iad/image-group/emnist-dataset) (Letters) kullanılarak, yatık harfler dikleştirilmiş ve modele temel harf hatları öğretilmiştir.
* **Aşama 2 (Veri Çoğaltma ve Kalınlaştırma):** Harf bütünlüğünü artırmak için [T-H-E Dataset](https://github.com/bartosgaye/thedataset) kullanılmış, OpenCV ile 2x2 matrislerle kalınlaştırılarak (`cv2.dilate`) modele yeni özellikler kazandırılmıştır.
* **Aşama 3 (Sentetik Kusursuz Veri):** Ubuntu-Light fontu kullanılarak Pillow (PIL) kütüphanesiyle kusursuz Türkçe harf görüntüleri üretilmiştir. Bu harfler `ImageDataGenerator` ile döndürülüp kaydırılarak (insan eli titremesi simüle edilerek) 28 sınıflı ara bir modele dönüştürülmüştür.
* **Aşama 4 (Gerçek Hayat Verisi & İnce Ayar):** Projemiz için **yaklaşık 21.000 adetlik gerçek insan el yazısı** (Türkçe harfler dahil) veri seti kullanılmıştır. Veriler OpenCV adaptive threshold ve morfolojik işlemlerle temizlenip merkeze alındıktan sonra model 29 sınıflı (Türkçe alfabe) nihai versiyonuna ulaştırılmıştır. [El yazısı](https://drive.google.com/drive/folders/1x8znRCDLU_i7m5WmKqC_xjEyDXnNW3yR)

### 2. [Spesifik Harf Analiz Modeli (b, d, p, q, g, k)](https://colab.research.google.com/drive/1en81yYCYbnx2Fkk-3BwN5KFTDMp2si5q?usp=sharing)
Disleksi semptomlarında görsel olarak en sık karıştırılan ve yönelim hatası yapılan "b, d, p, q, g, k" harflerine odaklanan, temel modelin üzerine inşa edilmiş özelleştirilmiş hata tespit ve sınıflandırma modelidir.

* **Eğitim Mantığı:** [EMNIST ByClass Veri Seti](https://www.tensorflow.org/datasets/catalog/emnist) içerisinden yalnızca bu 6 kritik harfin etiketleri filtrelenmiş ve kapsamlı harf modeli temel alınarak Transfer Learning (Transfer Öğrenme) uygulanmıştır.
* **Morfolojik İnceltme:** İnsanların ekrana çizerken oluşturduğu ince piksel hatlarını taklit etmek için, kalın EMNIST verileri OpenCV `cv2.erode` fonksiyonu ile inceltilerek modele sunulmuştur. Bu sayede model gerçek test ortamına tam uyum sağlamıştır.

### 3. PyTorch Yazım (Klavye) Analiz Modeli
Kullanıcının serbest metin girişlerindeki yazım hatalarını ve klavye ritmini **CharCNN** altyapısıyla analiz ederek anlamsal disleksi risk skoru üreten Doğal Dil İşleme (NLP) modelimizdir.
* **Veri Seti ve Algoritma:** Modelimiz, kelime köklerinden ziyade harf dizilişlerindeki ardışık anomalileri (örneğin ardışık yanlış sessiz harf kullanımı veya disleksik hece atlamaları) yakalayabilmesi için devasa Türkçe metin havuzları olan **Türkçe Wikipedia Veri Seti Dökümleri** ve **Twitter (X) Veri Setleri** kullanılarak eğitilmiştir.

---

## Proje Mimarisi ve Çalışma Mantığı

1. **Veri Toplama:** Kullanıcıdan klavye üzerinden serbest metin (ve tuşlama aralık süreleri) ile Canvas üzerinden harf/kelime çizimleri (x, y ve zaman koordinatları) alınır.
2. **AI Tahmini:** Alınan koordinat ve metin verileri Python (Flask) sunucusundaki PyTorch ve Keras modellerine anlık olarak iletilerek tahmin ve hata olasılıkları analiz edilir.
3. **Genel Risk Skorlaması:** Spring Boot sunucumuz; Python modellerinden gelen yapay zeka sonuçlarını (%75 AI ağırlığı), çizim titremesini, duraksama sürelerini ve silme (backspace) sayılarını matematiksel bir algoritmada birleştirerek `%0` ile `%100` arasında kapsamlı bir **Oturum Risk Skoru** üretir.
4. **Raporlama:** Analiz sonuçları MySQL veritabanına zaman damgası ile kaydedilir. Kullanıcıya, gelişmiş "Gelişim Raporu" (Dashboard) ekranında zamansal gelişim grafikleri (Timeline ve Recharts) ile görselleştirilerek sunulur.