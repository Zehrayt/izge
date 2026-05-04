import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';

export default function OkumaAsistani() {
  const [text, setText] = useState("");
  const [isBionic, setIsBionic] = useState(false);
  const [isLineFocus, setIsLineFocus] = useState(false);
  const [mouseY, setMouseY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("Hazır");

  const readingAreaRef = useRef(null);
  const fileInputRef = useRef(null);

  // 1. Biyonik Formatlayıcı
  const formatBionic = (rawText) => {
    if (!rawText || !isBionic) return rawText;
    return rawText.split(/\s+/).map((word, index) => {
      if (!word) return null;
      const half = Math.ceil(word.length / 2);
      return (
        <span key={index} style={{ display: 'inline-block', marginRight: '8px' }}>
          <strong>{word.substring(0, half)}</strong>{word.substring(half)}
        </span>
      );
    });
  };

  // 2. GÖRÜNTÜ ÖN İŞLEME (Dökümandaki 1. Madde Uygulaması)
  const preprocessImage = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Grayscale: Renkleri kaldır
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      
      // Threshold & Contrast: Siyah-beyaz dengesini kur (Gürültü temizleme)
      const threshold = 130; 
      const color = avg > threshold ? 255 : 0;
      
      data[i] = data[i+1] = data[i+2] = color;
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png', 1.0);
  };

  // 3. OCR MİMARİSİ (Dökümandaki 2. ve 3. Madde Uygulaması)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setStatus("Görüntü iyileştiriliyor...");

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        // Ön işlemi uygula
        const processedData = preprocessImage(canvas);

        setStatus("Türkçe dil desteğiyle taranıyor...");
        Tesseract.recognize(processedData, 'tur', {
          logger: m => {
            if (m.status === 'recognizing text') {
              setStatus(`Tarama: %${Math.floor(m.progress * 100)}`);
            }
          },
          // Dökümandaki "Doğru Ayarlar" kısmı:
          tessedit_pageseg_mode: '1', // Sayfayı bloklar halinde otomatik analiz et
          preserve_interword_spaces: '1'
        }).then(({ data: { text } }) => {
          // Post-processing: Metni temizle
          const cleanedText = text.replace(/[^\w\sğüşıöçĞÜŞİÖÇ.,!?;:()\-]/g, ' ').trim();
          setText(cleanedText);
          setStatus("Tamamlandı ✅");
          setIsLoading(false);
        });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#fdfbf7', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', fontWeight: '900', color: '#2c3e50', marginBottom: '30px' }}>Okuma Asistanı</h2>

      {/* Döküman 5. Madde: Kullanıcıya İpuçları */}
      <div style={infoBoxStyle}>
        💡 <strong>En iyi sonuç için:</strong> Net çekin, sayfayı düz tutun ve ışığın iyi olduğundan emin olun.
      </div>

      <div style={{ display: 'flex', gap: '20px', maxWidth: '1200px', margin: '0 auto 30px', flexWrap: 'wrap' }}>
        <div style={panelStyle}>
          <h4 style={{ color: '#e67e22', marginBottom: '10px' }}>Ayarlar</h4>
          <label style={labelStyle}><input type="checkbox" checked={isBionic} onChange={() => setIsBionic(!isBionic)} /> Biyonik Okuma</label>
          <label style={labelStyle}><input type="checkbox" checked={isLineFocus} onChange={() => setIsLineFocus(!isLineFocus)} /> Satır Odaklama</label>
        </div>

        <div style={{ ...panelStyle, flex: 2 }}>
          <h4 style={{ marginBottom: '10px' }}>Metin Girişi veya Dosya Yükle</h4>
          <div style={{ display: 'flex', gap: '15px' }}>
            <textarea 
              style={textInputStyle} 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="Buraya metin yazın veya fotoğraf yükleyin..."
            />
            <button onClick={() => fileInputRef.current.click()} style={uploadBtnStyle}>
              {isLoading ? "⌛" : "📸"}
              <span style={{fontSize: '10px'}}>{isLoading ? "İşleniyor" : "Yükle"}</span>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />
            </button>
          </div>
          <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>Sistem Durumu: {status}</p>
        </div>
      </div>

      <div 
        ref={readingAreaRef} 
        onMouseMove={(e) => {
          if (!isLineFocus) return;
          const rect = readingAreaRef.current.getBoundingClientRect();
          setMouseY(e.clientY - rect.top);
        }}
        style={readerBoxStyle}>
        
        <div style={{ position: 'relative', zIndex: 5, whiteSpace: 'pre-wrap', color: '#1a1a1a' }}>
          {text ? formatBionic(text) : <p style={{ color: '#aaa', textAlign: 'center' }}>İçerik bekleniyor...</p>}
        </div>

        {isLineFocus && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, pointerEvents: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitMaskImage: `linear-gradient(to bottom, black 0%, black ${mouseY - 60}px, transparent ${mouseY - 55}px, transparent ${mouseY + 55}px, black ${mouseY + 60}px, black 100%)`,
            maskImage: `linear-gradient(to bottom, black 0%, black ${mouseY - 60}px, transparent ${mouseY - 55}px, transparent ${mouseY + 55}px, black ${mouseY + 60}px, black 100%)`
          }} />
        )}
      </div>
    </div>
  );
}

// Tasarım Nesneleri
const panelStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #eee', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' };
const labelStyle = { display: 'flex', alignItems: 'center', gap: '8px', margin: '10px 0', cursor: 'pointer', fontWeight: '600' };
const textInputStyle = { width: '100%', height: '100px', borderRadius: '15px', border: '1px solid #eee', padding: '15px', resize: 'none' };
const uploadBtnStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '80px', height: '100px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '15px', cursor: 'pointer' };
const readerBoxStyle = { maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff', padding: '60px', borderRadius: '40px', fontSize: '2rem', lineHeight: '2.6', position: 'relative', minHeight: '500px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' };
const infoBoxStyle = { maxWidth: '1200px', margin: '0 auto 20px auto', padding: '10px 20px', backgroundColor: '#e1f5fe', borderRadius: '10px', fontSize: '14px', color: '#0277bd', textAlign: 'center' };