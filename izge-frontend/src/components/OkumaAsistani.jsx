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

/* ─── YARDIMCI: Görüntü ön işleme ──────────────────────────────────────────── */
function preprocessImage(canvas) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const color = avg > 130 ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = color;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png', 1.0);
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
          tessedit_pageseg_mode: '1',
          preserve_interword_spaces: '1',
        }).then(({ data: { text: t } }) => {
          const clean = t.replace(/[^\w\sğüşıöçĞÜŞİÖÇ.,!?;:()\-\n]/g, ' ').replace(/\s{3,}/g, '\n\n').trim();
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