import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/images/Resim1.png';

// ─── İKON BİLEŞENLERİ (SVG İkonlar) ──────────────────────────────────────────
const BookIcon = ({size=20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const HeadphonesIcon = ({size=20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>;
const VolumeIcon = ({size=20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>;
const MuteIcon = ({size=20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>;
const TrashIcon = ({size=20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const SendIcon = ({size=20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const ArrowRightIcon = ({size=20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const CheckCircleIcon = ({size=64, color="#27ae60"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const SparklesIcon = ({size=64, color="#f39c12"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"/></svg>;
const SpinnerIcon = ({size=64, color="#3498db"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation: 'spin 1s linear infinite'}}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </svg>
);
const KeyboardIcon = ({size=24, color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M7 16h10"/></svg>;
const BackspaceIcon = ({size=24, color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>;
const PenIcon = ({size=24, color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const PauseIcon = ({size=24, color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;

// ─── SABITLER ────────────────────────────────────────────────────────────────
const CIZIM_HARFLER = ['b', 'd', 'g', 'k', 'p', 'q'];
const CIZIM_KELIMELER = ['baba', 'dede', 'gemi', 'para', 'kalem'];

// ─── ANA BİLEŞEN ─────────────────────────────────────────────────────────────
export default function Analiz() {
  const navigate = useNavigate();

  // Adım: 'klavye' | 'cizim' | 'sonuc'
  const [adim, setAdim] = useState('klavye');

  // ── Klavye analizi state'leri ──
  const [yazılanMetin, setYazılanMetin] = useState('');
  const [klavyeHamVeriler, setKlavyeHamVeriler] = useState([]); 
  const [klavyeTamamlandi, setKlavyeTamamlandi] = useState(false);

  const tusZamanlari = useRef([]);
  const sonTusZamani = useRef(null);
  const backspaceSayisi = useRef(0);

  // ── Çizim analizi state'leri ──
  const [cizimAdim, setCizimAdim] = useState(0); 
  const [cizimTekrar, setCizimTekrar] = useState(0); 
  const [hedefHarf, setHedefHarf] = useState(0);
  const [hedefKelimeBas, setHedefKelimeBas] = useState(0);
  const [hedefKelime, setHedefKelime] = useState(0);
  const [cizimHamVeriler, setCizimHamVeriler] = useState([]); 
  const [koordinatlar, setKoordinatlar] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [cizimTamamlandi, setCizimTamamlandi] = useState(false);
  const canvasRef = useRef(null);
  
  // ── Ses State'i (Çizim aşaması için gerekli) ──
  const [sesOynuyor, setSesOynuyor] = useState(false);

  // ── Backend Sonuç State'i ──
  const [backendSonuc, setBackendSonuc] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  // Sesli okuma
  const sesliOku = (metin) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(metin);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.85;
    setSesOynuyor(true);
    utterance.onend = () => setSesOynuyor(false);
    window.speechSynthesis.speak(utterance);
  };

  // Canvas
  useEffect(() => {
    if (adim !== 'cizim') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 10;
    
    // Her adım değişiminde alanı temizle ve boyutu oturt
    temizleCanvas();
  }, [adim, cizimAdim]);

  // ── Klavye Handlers ──
  const handleTusBasildi = (e) => {
    const simdi = Date.now();
    if (e.key === 'Backspace') backspaceSayisi.current++;
    if (sonTusZamani.current) {
      tusZamanlari.current.push(simdi - sonTusZamani.current);
    }
    sonTusZamani.current = simdi;
  };

  const klavyeIlerle = () => {
    const hamVeri = {
      tip: 'serbest',
      referansMetin: null,
      yazilanMetin: yazılanMetin,
      tusAraliklari: [...tusZamanlari.current],
      silmeSayisi: backspaceSayisi.current
    };
    
    setKlavyeHamVeriler([hamVeri]);
    setYazılanMetin('');
    tusZamanlari.current = [];
    sonTusZamani.current = null;
    backspaceSayisi.current = 0;
    setKlavyeTamamlandi(true);
  };

  // ── Çizim Handlers ──
  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDrawing = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const { x, y } = getPos(e, canvas);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setKoordinatlar(prev => [...prev, { x, y, time: Date.now() }]);
  }, []);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const { x, y } = getPos(e, canvas);
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    setKoordinatlar(prev => [...prev, { x, y, time: Date.now() }]);
  }, [isDrawing]);

  const stopDrawing = useCallback(() => setIsDrawing(false), []);

  const temizleCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setKoordinatlar([]);
  };

  const cizimIlerle = async () => {
    if (koordinatlar.length === 0) { alert('Lütfen önce çizim yapınız!'); return; }

    try {
      const debugRes = await fetch('http://localhost:5001/debug-son', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          koordinatlar: koordinatlar,
          tip: cizimAdim === 2 ? 'kelime' : 'harf'
        })
      });
      const d = await debugRes.json();
      console.log('Beyaz piksel:', d.beyaz_piksel);
      console.log('X aralığı:', d.x_aralik);
      console.log('Y aralığı:', d.y_aralik);
      // Görüntüyü ekranda göster
      let img = document.getElementById('dbg');
      if (!img) { img = document.createElement('img'); img.id = 'dbg'; img.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9999;border:3px solid red;'; document.body.appendChild(img); }
      img.src = 'data:image/png;base64,' + d.goruntu;
    } catch(e) { console.log('Debug hata:', e); }
      
    let hedef = '', tip = '';
    if (cizimAdim === 0) { 
      hedef = CIZIM_HARFLER[hedefHarf]; 
      tip = 'harf'; 
    } else if (cizimAdim === 1) { 
      hedef = CIZIM_KELIMELER[hedefKelimeBas][0]; // baş harf
      tip = 'harf'; // ← harf modeli çalışsın
    } else { 
      hedef = CIZIM_KELIMELER[hedefKelime]; 
      tip = 'kelime'; // ← kelime modeli çalışsın
    }

    const yeniHamCizim = { tip, hedefKarakter: hedef, koordinatlar: [...koordinatlar] };
    setCizimHamVeriler(prev => [...prev, yeniHamCizim]);
    temizleCanvas();

    if (cizimAdim === 0) {
      if (cizimTekrar < 2) setCizimTekrar(prev => prev + 1);
      else { setCizimTekrar(0); if (hedefHarf < CIZIM_HARFLER.length - 1) setHedefHarf(prev => prev + 1); else { setCizimAdim(1); setHedefHarf(0); } }
    } else if (cizimAdim === 1) {
      if (cizimTekrar < 2) setCizimTekrar(prev => prev + 1);
      else { setCizimTekrar(0); if (hedefKelimeBas < CIZIM_KELIMELER.length - 1) setHedefKelimeBas(prev => prev + 1); else { setCizimAdim(2); setHedefKelimeBas(0); } }
    } else {
      if (cizimTekrar < 2) setCizimTekrar(prev => prev + 1);
      else { setCizimTekrar(0); if (hedefKelime < CIZIM_KELIMELER.length - 1) setHedefKelime(prev => prev + 1); else setCizimTamamlandi(true); }
    }
  };

  // ─── VERİLERİ BACKEND'E GÖNDERME ───
  const sonuclariGonderVeGoster = async () => {
    setYukleniyor(true);
    setAdim('sonuc');
    const payload = { klavyeAnalizleri: klavyeHamVeriler, cizimAnalizleri: cizimHamVeriler };
    try {
      const response = await fetch('http://localhost:8080/api/analiz/kaydet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Sunucu hatası: " + response.status);
      const data = await response.json();
      setBackendSonuc(data); 
      setYukleniyor(false);
    } catch (error) {
      console.error("Backend'e bağlanırken hata:", error);
      alert("Sonuçlar hesaplanırken sunucuya bağlanılamadı.");
      setYukleniyor(false);
    }
  };

  // ── Render Yardımcıları ──
  const cizimGostergesi = () => {
    if (cizimAdim === 0) return (
      <>
        <span style={s.badge}>Harf Çizimi</span>
        <p style={s.talimat}>Lütfen <strong style={{ color: '#e67e22', fontSize: '1.8rem' }}>"{CIZIM_HARFLER[hedefHarf]}"</strong> harfini çiziniz</p>
        <p style={s.altBilgi}>Tekrar {cizimTekrar + 1} / 3 — Harf {hedefHarf + 1} / {CIZIM_HARFLER.length}</p>
      </>
    );
    if (cizimAdim === 1) {
      const kelime = CIZIM_KELIMELER[hedefKelimeBas];
      return (
        <>
          <span style={{ ...s.badge, background: 'linear-gradient(135deg,#6A74C9,#A8B8DD)' }}>Kelime Baş Harfi</span>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
            <button onClick={() => sesliOku(kelime)} style={s.sesBtn}>{sesOynuyor ? <VolumeIcon/> : <MuteIcon/>} Dinle</button>
          </div>
          <p style={{ ...s.altBilgi, marginTop: 4 }}>Duyduğunuz kelimenin <strong>baş harfini</strong> yazınız</p>
          <p style={s.altBilgi}>Tekrar {cizimTekrar + 1} / 3 — Kelime {hedefKelimeBas + 1} / {CIZIM_KELIMELER.length}</p>
        </>
      );
    }
    const kelime = CIZIM_KELIMELER[hedefKelime];
    return (
      <>
        <span style={{ ...s.badge, background: 'linear-gradient(135deg,#e67e22,#f39c12)' }}>Kelime Yazma</span>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
          <button onClick={() => sesliOku(kelime)} style={s.sesBtn}>{sesOynuyor ? <VolumeIcon/> : <MuteIcon/>} Dinle</button>
        </div>
        <p style={{ ...s.altBilgi, marginTop: 4 }}>Duyduğunuz kelimeyi <strong>tamamını</strong> yazınız</p>
        <p style={s.altBilgi}>Tekrar {cizimTekrar + 1} / 3 — Kelime {hedefKelime + 1} / {CIZIM_KELIMELER.length}</p>
      </>
    );
  };

  const ilerlemeYuzdesi = () => {
    if (adim === 'klavye') return klavyeTamamlandi ? 50 : 0;
    if (adim === 'cizim') {
      const toplam = CIZIM_HARFLER.length * 3 + CIZIM_KELIMELER.length * 3 + CIZIM_KELIMELER.length * 3;
      return 50 + Math.round((cizimHamVeriler.length / toplam) * 50);
    }
    return 100;
  };

  const ilerleme = ilerlemeYuzdesi();

  return (
    <div style={s.sayfa}>
      <Header navigate={navigate} />

      <div style={s.icerik}>
        
        {/* Başlık Alanı - Sonuç ekranında gizlenir */}
        {adim !== 'sonuc' && (
          <div style={s.baslik}>
            <h1 style={s.h1}>Tanı ve <span style={{ color: '#e67e22' }}>Analiz</span></h1>
            <p style={s.altBaslik}>Yapay zeka destekli okuma ve yazma değerlendirmesi</p>
          </div>
        )}

        {/* Sonuç Ekranı Özel Başlık */}
        {adim === 'sonuc' && backendSonuc && !yukleniyor && (
          <div style={s.baslikSonuc}>
             <h1 style={s.h1Sonuc}><span style={{ color: '#e67e22' }}>Analiz </span>Sonuçları</h1>
          </div>
        )}

        {/* ── LAYOUT YAPI ── */}
        <div style={adim === 'sonuc' ? s.sonucLayout : s.anaLayout}>
          
          {/* SOL SİDEBAR (İlerleme Çubuğu) - Sonuç ekranında GİZLİ */}
          {adim !== 'sonuc' && (
            <div style={s.solSidebar}>
              <h3 style={{ fontSize: '1.2rem', color: '#2c3e50', marginBottom: '24px', fontWeight: 800 }}>Test Süreci</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <AdimGostergesi aktif={adim === 'klavye'} tamam={adim === 'cizim' || adim === 'sonuc'} no={1} label="Klavye Analizi" aciklama="Yazım ritmi ve hatalar" />
                <div style={{ width: 3, height: 35, background: (adim === 'cizim' || adim === 'sonuc') ? '#27ae60' : '#f0f0f0', margin: '4px 0 4px 20px', borderRadius: 2, transition: 'background 0.5s' }} />
                
                <AdimGostergesi aktif={adim === 'cizim'} tamam={adim === 'sonuc'} no={2} label="Çizim Analizi" aciklama="Motor beceri ve titreme" />
                <div style={{ width: 3, height: 35, background: adim === 'sonuc' ? '#27ae60' : '#f0f0f0', margin: '4px 0 4px 20px', borderRadius: 2, transition: 'background 0.5s' }} />
                
                <AdimGostergesi aktif={adim === 'sonuc'} tamam={false} no={3} label="Yapay Zeka Raporu" aciklama="Analiz sonuçları" />
              </div>

              {/* Yüzdelik Mini Bar */}
              <div style={{ marginTop: '40px', padding: '20px', background: '#f8f9fa', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7f8c8d' }}>Tamamlanma</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#3498db' }}>%{ilerleme}</span>
                </div>
                <div style={{ height: 6, background: '#e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${ilerleme}%`, background: 'linear-gradient(90deg, #3498db, #6A74C9)', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            </div>
          )}

          {/* SAĞ İÇERİK (Aktif Test veya Sonuç) */}
          <div style={adim === 'sonuc' ? s.sonucSagIcerik : s.sagIcerik}>

            {/* ── KLAVYE BÖLÜMÜ ── */}
            {adim === 'klavye' && (
              <div style={s.kart}>

                {!klavyeTamamlandi ? (
                  <>
                    <div style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: '1.4rem', color: '#2c3e50', marginBottom: 8, fontWeight: 700 }}>Bir cümle giriniz.</h3>
                        <p style={{ fontSize: '0.95rem', color: '#7f8c8d' }}>Lütfen aşağıdaki alana istediğiniz bir cümleyi serbestçe yazınız.</p>
                    </div>
                    
                    <textarea placeholder="Buraya yazınız..." value={yazılanMetin} onChange={(e) => setYazılanMetin(e.target.value)} onKeyDown={handleTusBasildi} style={s.textArea} autoFocus />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                      <p style={{ fontSize: '0.85rem', color: '#aaa', fontWeight: 500 }}>⏱ Yazım hızı ve ritminiz ölçülüyor</p>
                      <button onClick={klavyeIlerle} disabled={yazılanMetin.trim().length === 0} style={{ ...s.birincilBtn, opacity: yazılanMetin.trim().length === 0 ? 0.4 : 1 }}>
                        Kaydet ve İlerle <ArrowRightIcon />
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                      <CheckCircleIcon size={80} color="#27ae60" />
                    </div>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2c3e50', marginBottom: 8 }}>Klavye Analizi Tamamlandı!</h3>
                    <p style={{ color: '#7f8c8d', marginBottom: 32, fontSize: '1.1rem' }}>Yazım veriniz kaydedildi. Şimdi çizim analizine geçebilirsiniz.</p>
                    <button onClick={() => setAdim('cizim')} style={s.birincilBtn}>Çizim Analizine Geç <ArrowRightIcon /></button>
                  </div>
                )}
              </div>
            )}

            {/* ── ÇİZİM BÖLÜMÜ ── */}
            {adim === 'cizim' && (
              <div style={s.kart}>
                {/* cizimGostergesi sadece test tamamlanmadıysa görünsün */}
                {!cizimTamamlandi && (
                  <div style={s.cizimUst}>
                    {cizimGostergesi()}
                  </div>
                )}
                {!cizimTamamlandi ? (
                  <>
                    <div style={s.canvasSarici}>
                      <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        width={cizimAdim === 0 ? 400 : 800}
                        height={cizimAdim === 0 ? 400 : 200}
                        style={{
                          ...s.canvas,
                          width: cizimAdim === 0 ? '400px' : '100%',
                          maxWidth: cizimAdim === 0 ? '400px' : '800px',
                          height: 'auto',
                          aspectRatio: cizimAdim === 0 ? '1/1' : '4/1',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button onClick={temizleCanvas} style={s.ikinciBtn}>
                        <TrashIcon /> Temizle
                      </button>
                      <button onClick={cizimIlerle} style={s.birincilBtn}>
                        Kaydet ve İlerle <ArrowRightIcon />
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                       <SparklesIcon size={80} color="#f39c12" />
                    </div>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2c3e50', marginBottom: 8 }}>Tüm Testler Tamamlandı!</h3>
                    <p style={{ color: '#7f8c8d', marginBottom: 32, fontSize: '1.1rem' }}>Verileriniz hazır, yapay zeka analizine gönderebilirsiniz.</p>
                    
                    {/* Buton ortalandı */}
                    <button onClick={sonuclariGonderVeGoster} style={{ ...s.birincilBtn, display: 'inline-flex', margin: '0 auto', background: 'linear-gradient(135deg, #e67e22, #f39c12)', padding: '16px 40px', fontSize: '1.1rem' }}>
                      <SendIcon /> Verileri Gönder ve Sonucu Gör
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── SONUÇ BÖLÜMÜ (TAM EKRAN, ŞEFFAF ARKA PLAN) ── */}
            {adim === 'sonuc' && (
              <div style={{ width: '100%' }}>
                {yukleniyor || !backendSonuc ? (
                  <div style={{ textAlign: 'center', padding: '120px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                      <SpinnerIcon size={80} color="#3498db" />
                    </div>
                    <h2 style={{ color: '#2c3e50', fontSize: '2.5rem', marginBottom: '10px', fontWeight: 900 }}>Verileriniz İnceleniyor...</h2>
                    <p style={{ color: '#7f8c8d', fontSize: '1.2rem' }}>Yapay zeka modellerimiz klavye ritminizi ve çizimlerinizi analiz ediyor.</p>
                  </div>
                ) : (
                  <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    
                    {/* YENİ 2 SÜTUNLU YAPI */}
                    <div style={{ display: 'flex', flexWrap: 'wrap-reverse', gap: '60px', alignItems: 'center', justifyContent: 'center' }}>
                      
                      <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <svg width="280" height="280" viewBox="0 0 200 200">
                            <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="18" />
                            <circle cx="100" cy="100" r="85" fill="none" 
                              stroke={backendSonuc.riskSkoru < 30 ? '#27ae60' : backendSonuc.riskSkoru < 60 ? '#e67e22' : '#e74c3c'} 
                              strokeWidth="18" strokeDasharray={`${2 * Math.PI * 85 * backendSonuc.riskSkoru / 100} ${2 * Math.PI * 85}`} strokeLinecap="round" strokeDashoffset={2 * Math.PI * 85 * 0.25} style={{ transition: 'stroke-dasharray 1.5s ease-out' }} />
                          </svg>
                          <div style={{ position: 'absolute', textAlign: 'center' }}>
                            <div style={{ fontSize: '4.5rem', fontWeight: 900, color: '#2c3e50', lineHeight: 1 }}>{backendSonuc.riskSkoru}</div>
                            <div style={{ fontSize: '1.2rem', color: '#999', fontWeight: 700 }}>/ 100</div>
                          </div>
                        </div>
                        
                        <div style={{ 
                            marginTop: '-24px', zIndex: 10,
                            background: backendSonuc.riskSkoru < 30 ? '#27ae60' : backendSonuc.riskSkoru < 60 ? '#e67e22' : '#e74c3c', 
                            color: 'white', padding: '12px 40px', borderRadius: '99px', 
                            fontSize: '1.4rem', fontWeight: 800, 
                            boxShadow: `0 8px 20px ${backendSonuc.riskSkoru < 30 ? '#27ae60' : backendSonuc.riskSkoru < 60 ? '#e67e22' : '#e74c3c'}50` 
                        }}>
                           {backendSonuc.riskSeviyesi}
                        </div>
                      </div>

                      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
                        <SonucSatiri baslik="Klavye Hata Oranı" deger={`%${backendSonuc.klavyeHataOrtalamasi}`} aciklama="Hata Oranı" renk="#3498db" ikon={<KeyboardIcon size={24} color="#3498db"/>} />
                        <SonucSatiri baslik="Silme (Backspace)" deger={backendSonuc.backspaceOrtalamasi} aciklama="Silme Sayısı" renk="#9b59b6" ikon={<BackspaceIcon size={24} color="#9b59b6"/>} />
                        <SonucSatiri baslik="Çizim Titremesi" deger={backendSonuc.titremeOrtalamasi} aciklama="Titreme Sayısı" renk="#e67e22" ikon={<PenIcon size={24} color="#e67e22"/>} />
                        <SonucSatiri baslik="Çizim Duraksaması" deger={backendSonuc.duraksamaOrtalamasi} aciklama="Duraksama Sayısı" renk="#e74c3c" ikon={<PauseIcon size={24} color="#e74c3c"/>} son={true} />
                      </div>

                    </div>

                    {/* ── YENİ: YAPAY ZEKA TAHMİNLERİ BÖLÜMÜ ── */}
                    {backendSonuc.yapayZekaTahminleri && backendSonuc.yapayZekaTahminleri.length > 0 && (
                      <div style={{ marginTop: '60px', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '24px', justifyContent: 'center' }}>
                          <SparklesIcon size={28} color="#e67e22" />
                          <h3 style={{ fontSize: '1.5rem', color: '#2c3e50', fontWeight: 800 }}>Yapay Zeka Çizim Analizi</h3>
                        </div>
                        
                        {/* Yatayda kaydırılabilir (scroll) kart dizilimi */}
                        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                          {backendSonuc.yapayZekaTahminleri.map((tahmin, i) => (
                            <div key={i} style={{ 
                              flex: '0 0 200px', padding: '24px', borderRadius: '24px', 
                              border: `2px solid ${tahmin.karisti ? '#e74c3c30' : '#27ae6030'}`,
                              background: tahmin.karisti ? '#fff5f5' : '#f0fdf4',
                              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                            }}>
                              <div style={{ fontSize: '0.85rem', color: '#7f8c8d', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>HEDEF: {tahmin.hedef}</div>
                              
                              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#2c3e50', margin: '10px 0', lineHeight: 1 }}>
                                {tahmin.tahmin}
                              </div>
                              
                              <div style={{ 
                                fontSize: '0.95rem', fontWeight: 800, color: tahmin.karisti ? '#e74c3c' : '#27ae60', 
                                background: 'white', padding: '8px 16px', borderRadius: '99px', 
                                boxShadow: '0 4px 15px rgba(0,0,0,0.04)' 
                              }}>
                                %{tahmin.guven} {tahmin.karisti ? 'Karıştırdı' : 'Emin'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Aksiyon Butonları */}
                    <div style={{ textAlign: 'center', marginTop: 80, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button onClick={() => navigate('/rapor', { state: { analizVerisi: backendSonuc } })} style={{...s.birincilBtn, padding: '16px 40px', fontSize: '1.1rem'}}>Gelişim Raporumu Gör <ArrowRightIcon /></button>
                      <button onClick={() => { setAdim('klavye'); setKlavyeHamVeriler([]); setCizimHamVeriler([]); setBackendSonuc(null); setCizimAdim(0); setCizimTekrar(0); setHedefHarf(0); setKlavyeTamamlandi(false); setCizimTamamlandi(false); }} style={{...s.ikinciBtn, padding: '16px 40px', fontSize: '1.1rem'}}>Tekrar Başla</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── YARDIMCI BİLEŞENLER ─────────────────────────────────────────────────────
function Header({ navigate }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px clamp(20px, 5vw, 80px)', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(5px)' }}>
      <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}><img src={logo} alt="İzge Logo" style={{ height: '60px', objectFit: 'contain' }} /></div>
      <nav style={{ display: 'flex', gap: '30px', fontWeight: 'bold' }}>
        <span style={navLinkStyle} onClick={() => navigate('/')}>Ana Sayfa</span>
        <span style={navLinkStyle} onClick={() => navigate('/rapor')}>Gelişim Raporu</span>
        <span style={navLinkStyle} onClick={() => navigate('/analiz')}>Context</span>
        <span style={navLinkStyle} onClick={() => { if (window.location.pathname === '/') document.getElementById('hakkimizda')?.scrollIntoView({ behavior: 'smooth' }); else { navigate('/'); setTimeout(() => document.getElementById('hakkimizda')?.scrollIntoView({ behavior: 'smooth' }), 100); } }}>Hakkımızda</span>
      </nav>
    </header>
  );
}

function AdimGostergesi({ aktif, tamam, no, label, aciklama }) {
  const bg = tamam ? '#27ae60' : aktif ? '#3498db' : '#f0f0f0';
  const color = tamam || aktif ? 'white' : '#aaa';
  const textRenk = tamam ? '#2c3e50' : aktif ? '#3498db' : '#aaa';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%', background: bg, color: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: '1.1rem', flexShrink: 0, transition: 'all 0.4s',
        boxShadow: aktif ? '0 0 0 6px rgba(52,152,219,0.15)' : 'none'
      }}>
        {tamam ? <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : no}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '1.05rem', fontWeight: 700, color: textRenk, transition: 'color 0.4s' }}>{label}</span>
        <span style={{ fontSize: '0.8rem', color: '#999', fontWeight: 500, marginTop: '2px' }}>{aciklama}</span>
      </div>
    </div>
  );
}

// ─── YENİ: ŞEFFAF SONUÇ SATIRI ───
function SonucSatiri({ ikon, baslik, deger, aciklama, renk, son }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px 0', borderBottom: son ? 'none' : '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ width: 56, height: 56, borderRadius: '16px', background: `${renk}15`, color: renk, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {ikon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2c3e50', marginBottom: 4 }}>{baslik}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontSize: '2.2rem', fontWeight: 900, color: renk, lineHeight: 1 }}>{deger}</span>
          <span style={{ fontSize: '1rem', color: '#999', fontWeight: 600 }}>{aciklama}</span>
        </div>
      </div>
    </div>
  );
}

// ─── STİLLER ─────────────────────────────────────────────────────────────────
const s = {
  sayfa: { minHeight: '100vh', background: 'linear-gradient(160deg, #f0f4ff 0%, #fef9f3 50%, #f5f8ff 100%)', fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#2c3e50' },
  icerik: { maxWidth: 1400, margin: '0 auto', padding: '40px 20px 80px' },
  baslik: { textAlign: 'center', marginBottom: 40 },
  h1: { fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 900, marginBottom: 8, color: '#2c3e50' },
  altBaslik: { fontSize: '1.1rem', color: '#7f8c8d', fontWeight: 500 },

  baslikSonuc: { textAlign: 'center', marginBottom: 60 },
  h1Sonuc: { fontSize: '3rem', fontWeight: 900, color: '#2c3e50', textShadow: '0 2px 10px rgba(0,0,0,0.02)' },
  
  anaLayout: { display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' },
  solSidebar: { flex: '0 0 280px', width: '280px', background: 'white', borderRadius: '24px', padding: '32px 24px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', position: 'sticky', top: '100px', alignSelf: 'flex-start', marginLeft: '-20px' },
  sagIcerik: { flex: '1 1 0', width: '100%', minWidth: '300px' },

  sonucLayout: { display: 'block', width: '100%' },
  sonucSagIcerik: { width: '100%', maxWidth: '100%' },

  kart: { background: 'white', borderRadius: 28, padding: 'clamp(24px,4vw,48px)', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' },

  sekmeSarici: { display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' },
  sekme: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: 99, border: '2px solid #eee', background: 'transparent', cursor: 'default', fontWeight: 700, fontSize: '0.95rem', color: '#aaa' },
  sekmeAktif: { background: 'linear-gradient(135deg,#3498db,#6A74C9)', color: 'white', border: '2px solid transparent' },
  referansKutu: { background: 'linear-gradient(135deg,#fff8f2,#fff)', borderLeft: '5px solid #e67e22', borderRadius: 16, padding: '24px', marginBottom: 24 },
  textArea: { width: '100%', height: 220, padding: 20, borderRadius: 16, border: '2px solid #eee', fontSize: '1.2rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none', marginBottom: 20, boxSizing: 'border-box', transition: 'border-color 0.3s' },
  sesBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: 99, background: 'linear-gradient(135deg,#6A74C9,#3498db)', color: 'white', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(52,152,219,0.3)' },
  cizimUst: { textAlign: 'center', marginBottom: 24 },
  badge: { display: 'inline-block', padding: '8px 20px', borderRadius: 99, background: 'linear-gradient(135deg,#3498db,#6A74C9)', color: 'white', fontWeight: 700, fontSize: '0.9rem', marginBottom: 16 },
  talimat: { fontSize: '1.2rem', fontWeight: 600, color: '#2c3e50', marginBottom: 4 },
  altBilgi: { fontSize: '0.9rem', color: '#aaa', fontWeight: 500 },
  canvasSarici: { display: 'flex', justifyContent: 'center', width: '100%' },
  canvas: { 
    background: 'white', 
    border: '3px dashed #3498db', 
    borderRadius: 24, 
    cursor: 'crosshair', 
    touchAction: 'none', 
    width: '100%', 
    height: 'auto', 
    boxShadow: '0 8px 24px rgba(52,152,219,0.08)' 
  },
  birincilBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 40px', borderRadius: 99, background: 'linear-gradient(135deg,#3498db,#6A74C9)', color: 'white', border: 'none', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 6px 20px rgba(52,152,219,0.3)', transition: 'transform 0.2s, box-shadow 0.2s' },
  ikinciBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', borderRadius: 99, background: 'white', color: '#2c3e50', border: '2px solid #eee', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer' }
};

const navLinkStyle = { cursor: 'pointer', fontSize: '1.1rem', transition: 'color 0.3s ease', color: '#2c3e50' };