import React, { useState, useRef, useEffect } from 'react';

export default function Analiz() {
  const [inputText, setInputText] = useState("");
  const referansMetin = "Bugün gökyüzü çok bulutlu.";
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // YENİ: Çizim koordinatlarını ve zamanı tutacağımız dizi
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
  }, []);

  // DEĞİŞTİRİLDİ!!!: Sahte alert yerine Backend'e gerçek veri gönderimi
  const verileriKaydet = async () => {
    if (coordinates.length === 0) {
      alert("Lütfen önce çizim yapınız!");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/analysis/canvas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLetter: 'b', // Kullanıcıdan 'b' çizmesini istedik
          coordinatesJson: JSON.stringify(coordinates) // Toplanan koordinatları JSON string yapıp CanvasDTO'ya uygun yolluyoruz
        })
      });

      if (response.ok) {
        alert("Harika! Koordinat verileri servise başarıyla ulaştı ve MySQL'e kaydedildi.");
        temizleCanvas();
      } else {
        alert("Sunucu hatası.");
      }
    } catch (error) {
      console.error("Backend bağlantı hatası:", error);
      alert("Bağlantı kurulamadı!");
    }
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    
    // YENİ: İlk tıklama anındaki X, Y ve Zamanı kaydet
    setCoordinates(prev => [...prev, [offsetX, offsetY, Date.now()]]);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    
    // YENİ: Fare hareket ettikçe X, Y ve Zamanı listeye eklemeye devam et
    setCoordinates(prev => [...prev, [offsetX, offsetY, Date.now()]]);
  };

  const stopDrawing = () => setIsDrawing(false);
  
  const temizleCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCoordinates([]); // Temizleyince toplanan veriyi de sıfırla
  };

  return (
    <div style={{ padding: '40px', color: '#2c3e50' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', fontWeight: '800' }}>Tanı ve Analiz Ekranı</h1>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        <div style={panelStyle}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Klavye Analiz Alanı (Keystroke)</h2>
          <div style={referansKutusu}>
            <strong>Referans Metin:</strong> <br />
            {referansMetin}
          </div>
          <textarea 
            placeholder="Yukarıdaki cümleyi buraya yazınız..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={textAreaStyle}
          />
          <p style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '10px' }}>
            * Yazım hızı ve ritmi yapay zeka tarafından ölçülmektedir.
          </p>
        </div>

        <div style={panelStyle}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Çizim Analiz Alanı (Coordinate)</h2>
          <p style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Lütfen kutuya <strong>'b'</strong> harfini çiziniz:</p>
          <canvas 
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            width={350}
            height={250}
            style={canvasStyle}
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button onClick={temizleCanvas} style={secondaryBtn}>Temizle</button>
            <button onClick={verileriKaydet} style={primaryBtn}>Verileri Kaydet</button>
          </div>
        </div>

      </div>
    </div>
  );
}

const panelStyle = { backgroundColor: '#f6f4f0', padding: '30px', borderRadius: '30px', flex: '1', minWidth: '350px', maxWidth: '500px' };
const referansKutusu = { backgroundColor: 'white', padding: '15px', borderRadius: '15px', marginBottom: '20px', borderLeft: '5px solid #e67e22' };
const textAreaStyle = { width: '100%', height: '150px', padding: '15px', borderRadius: '15px', border: '1px solid #ddd', fontSize: '1rem' };
const canvasStyle = { backgroundColor: '#ffffff', border: '2px dashed #3498db', borderRadius: '20px', cursor: 'crosshair' };
const primaryBtn = { flex: 1, padding: '15px', borderRadius: '50px', border: 'none', backgroundColor: '#3498db', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
const secondaryBtn = { padding: '15px 25px', borderRadius: '50px', border: '1px solid #ddd', backgroundColor: 'white', cursor: 'pointer' };