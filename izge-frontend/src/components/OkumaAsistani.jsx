import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';

/* ─── GLOBAL STİL ENJEKSİYONU ──────────────────────────────────────────────── */
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

  * { box-sizing: border-box; }

  .oa-page {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0f4ff 0%, #fef9f3 55%, #f5f8ff 100%);
    font-family: 'Outfit', system-ui, sans-serif;
    color: #2c3e50;
  }

  /* Header */
  .oa-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px clamp(20px, 5vw, 80px);
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    position: sticky;
    top: 0;
    z-index: 200;
  }
  .oa-logo { cursor: pointer; display: flex; align-items: center; gap: 10px; }
  .oa-logo-mark {
    width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg,#3498db,#6A74C9);
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 900; font-size: 1.1rem;
  }
  .oa-logo-text { font-weight: 900; font-size: 1.3rem; color: #2c3e50; }
  .oa-nav { display: flex; gap: 28px; }
  .oa-nav-link {
    cursor: pointer; font-size: 1rem; font-weight: 700; color: #2c3e50;
    transition: color .2s; text-decoration: none;
  }
  .oa-nav-link:hover { color: #3498db; }

  /* Hero */
  .oa-hero {
    text-align: center;
    padding: 48px 20px 32px;
    max-width: 720px;
    margin: 0 auto;
  }
  .oa-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 18px; border-radius: 99px;
    background: rgba(52,152,219,0.1); color: #3498db;
    font-size: 0.82rem; font-weight: 700; letter-spacing: .5px;
    text-transform: uppercase; margin-bottom: 20px;
  }
  .oa-hero h1 {
    font-size: clamp(2rem,5vw,3.2rem); font-weight: 900;
    line-height: 1.1; margin-bottom: 14px; color: #2c3e50;
  }
  .oa-hero h1 span { color: #e67e22; }
  .oa-hero p {
    font-size: 1.1rem; color: #6b7c93; font-weight: 500; line-height: 1.65;
  }

  /* Ana konteyner */
  .oa-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 20px 80px;
  }

  /* Üst araç çubuğu */
  .oa-toolbar {
    background: white;
    border-radius: 24px;
    padding: 20px 28px;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
    margin-bottom: 24px;
  }
  .oa-toolbar-section {
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  }
  .oa-toolbar-divider {
    width: 1px; height: 36px; background: #eee;
  }
  .oa-toggle {
    display: flex; align-items: center; gap: 10px;
    cursor: pointer; user-select: none;
  }
  .oa-toggle input { display: none; }
  .oa-switch {
    width: 46px; height: 26px; border-radius: 99px;
    background: #e0e0e0; position: relative;
    transition: background .25s; flex-shrink: 0;
  }
  .oa-switch::after {
    content: ''; position: absolute; top: 3px; left: 3px;
    width: 20px; height: 20px; border-radius: 50%;
    background: white; transition: transform .25s;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }
  .oa-toggle.active .oa-switch { background: linear-gradient(135deg,#3498db,#6A74C9); }
  .oa-toggle.active .oa-switch::after { transform: translateX(20px); }
  .oa-toggle-label { font-size: 0.9rem; font-weight: 700; color: #2c3e50; }
  .oa-toggle-badge {
    font-size: 0.72rem; padding: 2px 8px; border-radius: 99px;
    background: rgba(52,152,219,0.12); color: #3498db; font-weight: 700;
  }

  /* Yükleme butonu */
  .oa-upload-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 22px; border-radius: 99px;
    background: linear-gradient(135deg,#e67e22,#f39c12);
    color: white; border: none; font-weight: 700;
    font-size: 0.9rem; cursor: pointer;
    box-shadow: 0 4px 14px rgba(230,126,34,0.3);
    transition: transform .2s, box-shadow .2s;
    font-family: 'Outfit', sans-serif;
  }
  .oa-upload-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(230,126,34,0.35); }
  .oa-upload-btn:disabled { opacity: .6; cursor: default; transform: none; }

  /* Temizle butonu */
  .oa-clear-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 10px 20px; border-radius: 99px;
    background: white; color: #aaa; border: 2px solid #eee;
    font-weight: 700; font-size: 0.9rem; cursor: pointer;
    transition: all .2s; font-family: 'Outfit', sans-serif;
  }
  .oa-clear-btn:hover { border-color: #e74c3c; color: #e74c3c; }

  /* Durum şeridi */
  .oa-status-bar {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 20px; border-radius: 12px;
    background: rgba(52,152,219,0.08);
    font-size: 0.84rem; font-weight: 600; color: #3498db;
    margin-bottom: 20px;
  }
  .oa-status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #3498db; flex-shrink: 0;
    animation: pulse 1.2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50% { opacity: .4; transform: scale(1.4); }
  }

  /* İpucu kutusu */
  .oa-tip {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 20px; border-radius: 16px;
    background: linear-gradient(135deg,rgba(230,126,34,0.08),rgba(243,156,18,0.06));
    border-left: 4px solid #e67e22;
    font-size: 0.88rem; font-weight: 600; color: #7d5c2b;
    margin-bottom: 20px;
  }

  /* Giriş alanı */
  .oa-input-wrap {
    background: white;
    border-radius: 24px;
    padding: 24px 28px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
    margin-bottom: 24px;
  }
  .oa-input-label {
    font-size: 0.8rem; font-weight: 700; color: #aaa;
    text-transform: uppercase; letter-spacing: .6px;
    margin-bottom: 10px; display: block;
  }
  .oa-textarea {
    width: 100%; min-height: 110px;
    padding: 16px; border-radius: 16px;
    border: 2px solid #eee; font-family: 'Lora', serif;
    font-size: 1rem; line-height: 1.7; color: #2c3e50;
    resize: vertical; outline: none;
    transition: border-color .2s;
    background: #fdfcfb;
  }
  .oa-textarea:focus { border-color: #3498db; }
  .oa-textarea::placeholder { color: #ccc; }

  /* Okuma alanı */
  .oa-reader-wrap {
    background: white;
    border-radius: 28px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.08);
    overflow: hidden;
    position: relative;
  }
  .oa-reader-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 28px;
    border-bottom: 1px solid #f0f0f0;
    background: #fafafa;
  }
  .oa-reader-title {
    font-size: 0.85rem; font-weight: 700; color: #aaa;
    text-transform: uppercase; letter-spacing: .5px;
    display: flex; align-items: center; gap: 8px;
  }
  .oa-reader-pills { display: flex; gap: 8px; }
  .oa-pill {
    padding: 4px 12px; border-radius: 99px;
    font-size: 0.75rem; font-weight: 700;
  }
  .oa-pill-bionic { background: rgba(52,152,219,0.1); color: #3498db; }
  .oa-pill-focus  { background: rgba(106,116,201,0.1); color: #6A74C9; }

  /* Font boyutu kontrolleri */
  .oa-font-ctrl {
    display: flex; align-items: center; gap: 4px;
  }
  .oa-font-btn {
    width: 28px; height: 28px; border-radius: 8px;
    border: 1.5px solid #eee; background: white;
    color: #666; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; transition: all .15s;
  }
  .oa-font-btn:hover { border-color: #3498db; color: #3498db; }
  .oa-font-size-val {
    font-size: 0.8rem; font-weight: 700; color: #999;
    min-width: 36px; text-align: center;
  }

  /* İçerik alanı */
  .oa-reader-body {
    padding: clamp(32px,5vw,64px) clamp(24px,6vw,80px);
    min-height: 420px;
    position: relative;
    cursor: none; /* satır odaklama için */
  }
  .oa-reader-body.no-linefocus { cursor: default; }

  .oa-content {
    font-family: 'Lora', serif;
    line-height: 2.1;
    color: #1a1a2e;
    white-space: pre-wrap;
    word-break: break-word;
    position: relative;
    z-index: 5;
  }
  .oa-content .bionic-word { display: inline; margin-right: 0; }
  .oa-content .bionic-word strong { font-weight: 900; color: #1a1a2e; }

  .oa-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 320px; gap: 16px;
    color: #ccc;
  }
  .oa-empty-icon { font-size: 3.5rem; opacity: .5; }
  .oa-empty-text { font-size: 1.05rem; font-weight: 600; }
  .oa-empty-sub { font-size: 0.88rem; }

  /* Satır odaklama örtüsü */
  .oa-focus-overlay {
    position: absolute; inset: 0; z-index: 10;
    pointer-events: none;
    background: rgba(240,244,255,0.82);
    backdrop-filter: blur(5px);
    transition: -webkit-mask-position .05s, mask-position .05s;
  }

  /* OCR ilerleme çubuğu */
  .oa-ocr-progress {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 4px; background: #f0f0f0; z-index: 20;
  }
  .oa-ocr-bar {
    height: 100%;
    background: linear-gradient(90deg,#3498db,#6A74C9);
    border-radius: 99px;
    transition: width .3s ease;
  }

  /* Drag & drop vurgusu */
  .oa-drop-zone {
    border: 2.5px dashed #e0e8ff !important;
    background: rgba(52,152,219,0.03) !important;
  }
  .oa-drop-zone.drag-over {
    border-color: #3498db !important;
    background: rgba(52,152,219,0.08) !important;
  }

  /* Animasyonlar */
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .oa-fade-in { animation: fadeSlideUp .5s ease forwards; }
  .oa-fade-in-delay { animation: fadeSlideUp .5s .15s ease both; }
  .oa-fade-in-delay2 { animation: fadeSlideUp .5s .3s ease both; }

  /* Responsive */
  @media (max-width: 640px) {
    .oa-toolbar { gap: 12px; }
    .oa-toolbar-divider { display: none; }
    .oa-reader-body { padding: 24px 20px; }
  }
`;

/* ─── YARDIMCI: Biyonik formatlayıcı ───────────────────────────────────────── */
function bionicFormat(rawText) {
  if (!rawText) return null;
  return rawText.split(/(\s+)/).map((token, i) => {
    if (!token.trim()) return token; // boşlukları koru
    const half = Math.ceil(token.length / 2);
    return (
      <span key={i} className="bionic-word">
        <strong>{token.substring(0, half)}</strong>{token.substring(half)}
      </span>
    );
  });
}

/* ─── YARDIMCI: Sayfa dışındaki koyu arka planı (masa, gölge vb.) otomatik kırp ─
 * Fotoğrafta kitap sayfasının etrafında kalan masa/zemin gibi koyu alanlar
 * OCR'a karışıp anlamsız "kelimeler" üretebiliyor (metnin sonunda görülen
 * rastgele harf öbekleri gibi). Satır/sütun bazında parlaklık oranına bakıp
 * sayfanın (parlak, beyaza yakın) sınırlarını buluyoruz.                    */
function sayfayaOtomatikKirp(canvas) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const gray = new Float32Array(width * height);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    gray[p] = Math.max(data[i], data[i + 1], data[i + 2]);
  }

  const PARLAKLIK_ESIGI = 150;
  const ORAN_ESIGI = 0.5;

  const satirParlakOrani = (y) => {
    let sayim = 0;
    for (let x = 0; x < width; x++) if (gray[y * width + x] > PARLAKLIK_ESIGI) sayim++;
    return sayim / width;
  };
  const sutunParlakOrani = (x, y0, y1) => {
    let sayim = 0;
    for (let y = y0; y <= y1; y++) if (gray[y * width + x] > PARLAKLIK_ESIGI) sayim++;
    return sayim / (y1 - y0 + 1);
  };

  let ustY = 0, altY = height - 1;
  for (let y = 0; y < height; y++) { if (satirParlakOrani(y) >= ORAN_ESIGI) { ustY = y; break; } }
  for (let y = height - 1; y >= 0; y--) { if (satirParlakOrani(y) >= ORAN_ESIGI) { altY = y; break; } }

  let solX = 0, sagX = width - 1;
  for (let x = 0; x < width; x++) { if (sutunParlakOrani(x, ustY, altY) >= ORAN_ESIGI) { solX = x; break; } }
  for (let x = width - 1; x >= 0; x--) { if (sutunParlakOrani(x, ustY, altY) >= ORAN_ESIGI) { sagX = x; break; } }

  const genislik = sagX - solX + 1;
  const yukseklik = altY - ustY + 1;

  // Tespit başarısız olduysa (çok küçük bir alan bulunduysa) orijinali kullan
  if (genislik < width * 0.3 || yukseklik < height * 0.3) return canvas;

  const kirpilmis = document.createElement('canvas');
  kirpilmis.width = genislik;
  kirpilmis.height = yukseklik;
  kirpilmis.getContext('2d').drawImage(canvas, solX, ustY, genislik, yukseklik, 0, 0, genislik, yukseklik);
  return kirpilmis;
}

/* ─── YARDIMCI: Görüntü ön işleme ──────────────────────────────────────────── */
function preprocessImage(canvas) {
  // 0) Sayfa dışındaki koyu arka planı (masa, gölge vb.) otomatik kırp
  canvas = sayfayaOtomatikKirp(canvas);

  // 1) Düşük çözünürlüklü fotoğrafları büyüt — OCR doğruluğu çözünürlükle artar
  const MIN_WIDTH = 1600;
  if (canvas.width < MIN_WIDTH) {
    const scale = MIN_WIDTH / canvas.width;
    const buyuk = document.createElement('canvas');
    buyuk.width = Math.round(canvas.width * scale);
    buyuk.height = Math.round(canvas.height * scale);
    const bctx = buyuk.getContext('2d');
    bctx.imageSmoothingEnabled = true;
    bctx.imageSmoothingQuality = 'high';
    bctx.drawImage(canvas, 0, 0, buyuk.width, buyuk.height);
    canvas = buyuk;
  }

  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // 2) Griye çevir — ağırlıklı luminance yerine kanalların maksimumu (value) kullanılıyor.
  //    Bu, sarı/yeşil/pembe fosforlu kalemle vurgulanmış metinlerde önemli:
  //    sarı (255,255,0) luminance ile orta-koyu griye düşüp metin kontrastını
  //    azaltıyordu; max(R,G,B) ile sarı da beyaz kağıt gibi parlak kalıyor,
  //    siyah mürekkep ise her iki yöntemde de koyu kalıyor.
  const gray = new Float32Array(width * height);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    gray[p] = Math.max(data[i], data[i + 1], data[i + 2]);
  }

  // 3) Sayfayı bloklara ayırıp her blok için yerel ortalama aydınlatma hesapla.
  //    Bu, fotoğraflanan kitap sayfalarındaki düzensiz ışık/gölge/kıvrımı
  //    tek bir sabit eşik (global threshold) yerine bölgesel olarak tolere eder.
  const BLOCK = 40;
  const cols = Math.ceil(width / BLOCK);
  const rows = Math.ceil(height / BLOCK);
  const blockMean = new Float32Array(cols * rows);

  for (let by = 0; by < rows; by++) {
    for (let bx = 0; bx < cols; bx++) {
      let sum = 0, count = 0;
      const x0 = bx * BLOCK, y0 = by * BLOCK;
      const x1 = Math.min(x0 + BLOCK, width), y1 = Math.min(y0 + BLOCK, height);
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          sum += gray[y * width + x];
          count++;
        }
      }
      blockMean[by * cols + bx] = sum / count;
    }
  }

  // 4) Her pikseli, içinde bulunduğu bloğun yerel ortalamasına göre eşikle (adaptif binarizasyon)
  const C = 12; // eşik hassasiyeti — ince gölgeleri metinden ayırmak için tampon
  for (let y = 0; y < height; y++) {
    const by = Math.min(rows - 1, Math.floor(y / BLOCK));
    for (let x = 0; x < width; x++) {
      const bx = Math.min(cols - 1, Math.floor(x / BLOCK));
      const localMean = blockMean[by * cols + bx];
      const idx = (y * width + x) * 4;
      const v = gray[y * width + x] > localMean - C ? 255 : 0;
      data[idx] = data[idx + 1] = data[idx + 2] = v;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png', 1.0);
}

/* ─── YARDIMCI: OCR sonucunu satır/paragraf yapısından yeniden kur ─────────── *
 * Tesseract'ın ham `text` çıktısı kitaptaki fiziksel satır sonlarını olduğu
 * gibi korur (her basılı satır = bir \n) ve düşük güvenilirlikli gürültü
 * kelimelerini (örn. tek başına "v.") filtrelemez. Bunun yerine `paragraphs
 * → lines → words` hiyerarşisini kullanarak:
 *   1) Güven skoru düşük kelimeleri at (OCR gürültüsü),
 *   2) Satır sonu tire ile bölünmüş kelimeleri birleştir,
 *   3) Aynı paragraf içindeki satırları boşlukla birleştirip tek bir akan
 *      metin oluştur — böylece ekran genişliğine göre doğal satır kaydırma
 *      (reflow) olur, kitaptaki satır kırılmaları uygulamaya taşınmaz.       */
const MIN_GUVEN = 50; // bu eşiğin altındaki kelimeler OCR gürültüsü kabul edilip atılır

// Bir kelimenin gerçek metin mi yoksa OCR gürültüsü mü olduğunu belirler.
// Fotoğraflanan kitap sayfalarında leke/gölge/kıvrım gibi şeyler genelde
// tek başına ":" "!" ";" "v." "İ" gibi anlamsız tek-karakterli/saf noktalama
// "kelimeler" olarak okunur — bunlar gerçek metinde ayrı bir token olarak
// neredeyse hiç bulunmaz, o yüzden agresifçe eleniyor.
function temizKelimeMi(kelime, guven) {
  const k = (kelime || '').trim();
  if (!k) return false;
  // Saf noktalama/sembol (harf/rakam içermeyen) tokenler her zaman gürültüdür
  if (!/[\wğüşıöçĞÜŞİÖÇ]/.test(k)) return false;
  // Tek harfli tokenler — Türkçede "o" dışında pratikte tek harfli kelime yoktur
  const sadeceHarfRakam = k.replace(/[^\wğüşıöçĞÜŞİÖÇ]/g, '');
  if (sadeceHarfRakam.length === 1 && !/^[oO]$/.test(sadeceHarfRakam)) return false;
  if (guven < MIN_GUVEN) return false;
  return true;
}

function metniYenidenOlustur(data) {
  // Tesseract'ın kendi "paragraph" gruplaması güvenilir değil — adaletli/blok
  // dizilmiş kitap sayfalarında genelde her satırı ayrı bir paragraf gibi
  // algılıyor. Onun yerine tüm satırları okuma sırasıyla düz bir listeye
  // alıp, paragraf başlangıcını kendimiz GİRİNTİ (indent) bilgisinden tespit
  // ediyoruz — Türkçe kitaplarda paragrafın ilk satırı içeri girintili başlar,
  // bu da satır kutusunun (bbox) sol kenarından (x0) anlaşılabilir.
  const satirlarHam = (data && data.lines) || [];
  if (!satirlarHam.length) return (data?.text || '').trim();

  const satirBilgileri = satirlarHam
    .map((line) => ({
      metin: (line.words || [])
        .filter((w) => temizKelimeMi(w.text, w.confidence))
        .map((w) => w.text.trim())
        .join(' '),
      x0: line.bbox ? line.bbox.x0 : 0,
    }))
    .filter((s) => s.metin.length > 0);

  if (!satirBilgileri.length) return '';

  // Sayfanın genel sol kenarını (çoğu satırın hizalandığı x) medyan ile bul
  const x0ler = [...satirBilgileri.map((s) => s.x0)].sort((a, b) => a - b);
  const solKenar = x0ler[Math.floor(x0ler.length / 2)];
  const GIRINTI_ESIGI = 18; // px — bu kadar daha içeride başlayan satır yeni paragraf kabul edilir

  let sonuc = '';
  satirBilgileri.forEach((satir, i) => {
    const yeniParagrafMi = i > 0 && (satir.x0 - solKenar) > GIRINTI_ESIGI;

    if (i === 0) {
      sonuc = satir.metin;
    } else if (yeniParagrafMi) {
      sonuc += '\n\n' + satir.metin;
    } else if (/[a-zA-ZğüşıöçĞÜŞİÖÇ]-$/.test(sonuc)) {
      // Önceki satır tire ile bitiyor (kelime alt satırda devam ediyor) — boşluksuz birleştir
      sonuc = sonuc.slice(0, -1) + satir.metin;
    } else {
      sonuc += ' ' + satir.metin;
    }
  });

  return sonuc.trim();
}

/* ─── ANA BİLEŞEN ──────────────────────────────────────────────────────────── */
export default function OkumaAsistani() {
  const navigate = useNavigate();

  const [text, setText] = useState('');
  const [isBionic, setIsBionic] = useState(false);
  const [isLineFocus, setIsLineFocus] = useState(false);
  const [fontSize, setFontSize] = useState(20);
  const [mouseY, setMouseY] = useState(200);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Hazır');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const readerBodyRef = useRef(null);

  /* Stil enjeksiyonu */
  useEffect(() => {
    const id = 'oa-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = globalStyle;
      document.head.appendChild(el);
    }
    return () => {};
  }, []);

  /* OCR işlemi */
  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setIsLoading(true);
    setProgress(5);
    setStatus('Görüntü hazırlanıyor…');

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        const processed = preprocessImage(canvas);

        setStatus('Türkçe karakter tanıma başladı…');
        setProgress(20);

        Tesseract.recognize(processed, 'tur', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(20 + Math.floor(m.progress * 75));
              setStatus(`Tarama: %${Math.floor(m.progress * 100)}`);
            }
          },
          tessedit_pageseg_mode: '3', // Tam otomatik sayfa segmentasyonu (OSD gerektirmez, kitap sayfaları için daha güvenilir)
          preserve_interword_spaces: '1',
        }).then(({ data }) => {
          const yenidenKurulmus = metniYenidenOlustur(data);
          const clean = yenidenKurulmus
            .replace(/[^\w\sğüşıöçĞÜŞİÖÇ.,!?;:()\-]/g, ' ') // izin verilmeyen karakterleri temizle (satır sonlarına dokunmaz)
            .replace(/ {2,}/g, ' ') // sadece boşlukları sıkıştır, paragraf aralarındaki \n\n'e dokunma
            .replace(/\n{3,}/g, '\n\n')
            .trim();
          setText(clean);
          setStatus('Tamamlandı ✓');
          setProgress(100);
          setTimeout(() => { setIsLoading(false); setProgress(0); }, 800);
        }).catch(() => {
          setStatus('Hata oluştu.');
          setIsLoading(false);
          setProgress(0);
        });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isLineFocus || !readerBodyRef.current) return;
    const rect = readerBodyRef.current.getBoundingClientRect();
    setMouseY(e.clientY - rect.top);
  }, [isLineFocus]);

  const focusMaskStyle = {
    WebkitMaskImage: `linear-gradient(to bottom,
      black 0%,
      black ${mouseY - 52}px,
      transparent ${mouseY - 44}px,
      transparent ${mouseY + 44}px,
      black ${mouseY + 52}px,
      black 100%)`,
    maskImage: `linear-gradient(to bottom,
      black 0%,
      black ${mouseY - 52}px,
      transparent ${mouseY - 44}px,
      transparent ${mouseY + 44}px,
      black ${mouseY + 52}px,
      black 100%)`,
  };

  const hasText = text.trim().length > 0;

  return (
    <div className="oa-page">
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="oa-header">
        <div className="oa-logo" onClick={() => navigate('/')}>
          <div className="oa-logo-mark">İ</div>
          <span className="oa-logo-text">izge</span>
        </div>
        <nav className="oa-nav">
          {[['Analiz', '/analiz'], ['Gelişim Raporu', '/rapor'], ['Hakkımızda', '/']].map(([l, p]) => (
            <span key={l} className="oa-nav-link" onClick={() => navigate(p)}>{l}</span>
          ))}
        </nav>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <div className="oa-hero oa-fade-in">
        <div className="oa-hero-eyebrow">
          <span>📖</span> Okuma Asistanı
        </div>
        <h1>Metinleri <span>Disleksi Dostu</span><br />Formata Dönüştür</h1>
        <p>Fotoğraf yükle veya metin gir — biyonik okuma ve satır odaklama<br />ile anlama hızını artır.</p>
      </div>

      <div className="oa-main">
        {/* ── İPUCU ─────────────────────────────────────────────────────────── */}
        <div className="oa-tip oa-fade-in-delay">
          <span>💡</span>
          <span><strong>En iyi OCR sonucu için:</strong> Sayfayı düz tutun, arka plan düzgün aydınlatılmış olsun ve fotoğraf net çekilsin.</span>
        </div>

        {/* ── ARAÇ ÇUBUĞU ──────────────────────────────────────────────────── */}
        <div className="oa-toolbar oa-fade-in-delay">
          {/* Togglelar */}
          <div className="oa-toolbar-section">
            <label className={`oa-toggle${isBionic ? ' active' : ''}`}>
              <input type="checkbox" checked={isBionic} onChange={() => setIsBionic(v => !v)} />
              <div className="oa-switch" />
              <span className="oa-toggle-label">Biyonik Okuma</span>
              <span className="oa-toggle-badge">B</span>
            </label>
          </div>

          <div className="oa-toolbar-divider" />

          <div className="oa-toolbar-section">
            <label className={`oa-toggle${isLineFocus ? ' active' : ''}`}>
              <input type="checkbox" checked={isLineFocus} onChange={() => setIsLineFocus(v => !v)} />
              <div className="oa-switch" />
              <span className="oa-toggle-label">Satır Odaklama</span>
              <span className="oa-toggle-badge" style={{ background: 'rgba(106,116,201,0.12)', color: '#6A74C9' }}>F</span>
            </label>
          </div>

          <div className="oa-toolbar-divider" />

          {/* Font boyutu */}
          <div className="oa-toolbar-section">
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#aaa' }}>BOYUT</span>
            <div className="oa-font-ctrl">
              <button className="oa-font-btn" onClick={() => setFontSize(v => Math.max(14, v - 2))}>−</button>
              <span className="oa-font-size-val">{fontSize}px</span>
              <button className="oa-font-btn" onClick={() => setFontSize(v => Math.min(32, v + 2))}>+</button>
            </div>
          </div>

          {/* Sağa itilmiş butonlar */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            {hasText && (
              <button className="oa-clear-btn" onClick={() => setText('')}>
                <span>✕</span> Temizle
              </button>
            )}
            <button
              className="oa-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              {isLoading ? '⌛' : '📸'} {isLoading ? 'İşleniyor…' : 'Fotoğraf Yükle'}
            </button>
            <input
              type="file" ref={fileInputRef}
              onChange={handleFileInput}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* ── Yükleme durumu ────────────────────────────────────────────────── */}
        {isLoading && (
          <div className="oa-status-bar">
            <div className="oa-status-dot" />
            {status}
            <span style={{ marginLeft: 'auto', fontWeight: 800 }}>%{progress}</span>
          </div>
        )}

        {/* ── METİN GİRİŞİ ─────────────────────────────────────────────────── */}
        <div className="oa-input-wrap oa-fade-in-delay2">
          <span className="oa-input-label">Metin Gir veya Fotoğraf Yükle</span>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            style={{ position: 'relative' }}
          >
            <textarea
              className={`oa-textarea${isDragOver ? ' oa-drop-zone drag-over' : ''}`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Buraya metin yazın, yapıştırın ya da fotoğraf sürükleyin…"
            />
            {isDragOver && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 16,
                border: '2.5px dashed #3498db',
                background: 'rgba(52,152,219,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none', fontSize: '1rem', fontWeight: 700, color: '#3498db'
              }}>
                📂 Bırakın — Dosyayı yükleyeceğim
              </div>
            )}
          </div>
        </div>

        {/* ── OKUMA ALANI ──────────────────────────────────────────────────── */}
        <div className="oa-reader-wrap">
          {/* Kart başlığı */}
          <div className="oa-reader-header">
            <div className="oa-reader-title">
              <span>📄</span> Okuma Alanı
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="oa-reader-pills">
                {isBionic && <span className="oa-pill oa-pill-bionic">Biyonik Aktif</span>}
                {isLineFocus && <span className="oa-pill oa-pill-focus">Satır Odak Aktif</span>}
              </div>
            </div>
          </div>

          {/* Gövde */}
          <div
            ref={readerBodyRef}
            className={`oa-reader-body${isLineFocus ? '' : ' no-linefocus'}`}
            onMouseMove={handleMouseMove}
          >
            {hasText ? (
              <div
                className="oa-content"
                style={{ fontSize: `${fontSize}px`, lineHeight: fontSize > 22 ? 1.9 : 2.1 }}
              >
                {isBionic ? bionicFormat(text) : text}
              </div>
            ) : (
              <div className="oa-empty">
                <div className="oa-empty-icon">📖</div>
                <div className="oa-empty-text">Henüz içerik yok</div>
                <div className="oa-empty-sub">Yukarıya metin girin ya da fotoğraf yükleyin</div>
              </div>
            )}

            {/* Satır odaklama örtüsü */}
            {isLineFocus && hasText && (
              <div className="oa-focus-overlay" style={focusMaskStyle} />
            )}

            {/* OCR ilerleme çubuğu */}
            {isLoading && progress > 0 && (
              <div className="oa-ocr-progress">
                <div className="oa-ocr-bar" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>
        </div>

        {/* ── Alt bilgi ────────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <p style={{ fontSize: '0.88rem', color: '#bbb', fontWeight: 500 }}>
            Daha kapsamlı bir değerlendirme için{' '}
            <span
              onClick={() => navigate('/analiz')}
              style={{ color: '#3498db', fontWeight: 700, cursor: 'pointer' }}
            >
              Analiz sayfasını
            </span>{' '}
            ziyaret edebilirsin.
          </p>
        </div>
      </div>
    </div>
  );
}