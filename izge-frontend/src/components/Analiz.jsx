import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/images/Resim1.png';

// ─── SABITLER ────────────────────────────────────────────────────────────────
const KLAVYE_METINLER = [
  "Bugün gökyüzü çok bulutlu ve hava serin.",
  "Kedi bahçede oynarken çiçekleri devirdi.",
  "Okula giderken yolda bir köpek gördüm.",
  "Annem bana sarı bir bisiklet aldı.",
  "Kitaplar bilginin kapısını açar.",
];

const DINLEME_METINLER = [
  "Sabahleyin erken kalkmak çok zordur.",
  "Bahçedeki elmalar olgunlaştı.",
  "Yağmur yağınca gökkuşağı çıktı.",
  "Kardeşim resim yapmayı çok sever.",
  "Denizde yüzmek harika bir duygu.",
];

const CIZIM_HARFLER = ['b', 'd', 'p', 'q'];
const CIZIM_KELIMELER = ['baba', 'dede', 'para', 'kalem'];
const DINLEME_KELIMELER = ['bulut', 'deniz', 'araba', 'elma', 'kalem'];

// Levenshtein mesafesi
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function hataYuzdesi(referans, yazilan) {
  if (!referans) return 0;
  const dist = levenshtein(referans.toLowerCase(), yazilan.toLowerCase());
  return Math.min(100, Math.round((dist / referans.length) * 100));
}

// ─── ANA BİLEŞEN ─────────────────────────────────────────────────────────────
export default function Analiz() {
  const navigate = useNavigate();

  // Adım: 'klavye' | 'cizim' | 'sonuc'
  const [adim, setAdim] = useState('klavye');

  // ── Klavye analizi state'leri ──
  const [klavyeAlt, setKlavyeAlt] = useState('yaz'); // 'yaz' | 'dinle'
  const [klavyeIndex, setKlavyeIndex] = useState(0);
  const [dinleIndex, setDinleIndex] = useState(0);
  const [yazılanMetin, setYazılanMetin] = useState('');
  const [klavyeSonuclar, setKlavyeSonuclar] = useState([]); // {tip, referans, yazilan, hata}
  const [sesOynuyor, setSesOynuyor] = useState(false);
  const [klavyeTamamlandi, setKlavyeTamamlandi] = useState(false);

  // Tuş zamanlaması
  const tusZamanlari = useRef([]);
  const sonTusZamani = useRef(null);
  const backspaceSayisi = useRef(0);

  // ── Çizim analizi state'leri ──
  const [cizimAdim, setCizimAdim] = useState(0); // 0=harf, 1=kelimeBas, 2=kelime
  const [cizimTekrar, setCizimTekrar] = useState(0); // 0-2
  const [hedefHarf, setHedefHarf] = useState(0);
  const [hedefKelimeBas, setHedefKelimeBas] = useState(0);
  const [hedefKelime, setHedefKelime] = useState(0);
  const [cizimSonuclar, setCizimSonuclar] = useState([]);
  const [koordinatlar, setKoordinatlar] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [cizimTamamlandi, setCizimTamamlandi] = useState(false);
  const canvasRef = useRef(null);

  // Sesli okuma (Web Speech API)
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

  // Canvas başlatma
  useEffect(() => {
    if (adim !== 'cizim') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 4;
  }, [adim, cizimAdim, cizimTekrar]);

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
    const referans = klavyeAlt === 'yaz'
      ? KLAVYE_METINLER[klavyeIndex]
      : DINLEME_METINLER[dinleIndex];

    const aralikOrt = tusZamanlari.current.length
      ? tusZamanlari.current.reduce((a, b) => a + b, 0) / tusZamanlari.current.length
      : 0;

    const sonuc = {
      tip: klavyeAlt,
      referans,
      yazilan: yazılanMetin,
      hata: hataYuzdesi(referans, yazılanMetin),
      backspace: backspaceSayisi.current,
      aralikOrt: Math.round(aralikOrt),
    };

    const yeniSonuclar = [...klavyeSonuclar, sonuc];
    setKlavyeSonuclar(yeniSonuclar);
    setYazılanMetin('');
    tusZamanlari.current = [];
    sonTusZamani.current = null;
    backspaceSayisi.current = 0;

    // Sıradaki adıma geç
    if (klavyeAlt === 'yaz') {
      if (klavyeIndex < KLAVYE_METINLER.length - 1) {
        setKlavyeIndex(prev => prev + 1);
      } else {
        // Yazma bitti, dinlemeye geç
        setKlavyeAlt('dinle');
        setKlavyeIndex(0);
      }
    } else {
      if (dinleIndex < DINLEME_METINLER.length - 1) {
        setDinleIndex(prev => prev + 1);
      } else {
        setKlavyeTamamlandi(true);
      }
    }
  };

  // ── Çizim Handlers ──
  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const { x, y } = getPos(e, canvas);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setKoordinatlar(prev => [...prev, [x, y, Date.now()]]);
  }, []);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const { x, y } = getPos(e, canvas);
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    setKoordinatlar(prev => [...prev, [x, y, Date.now()]]);
  }, [isDrawing]);

  const stopDrawing = useCallback(() => setIsDrawing(false), []);

  const temizleCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setKoordinatlar([]);
  };

  const cizimMetrikHesapla = (koords) => {
    if (koords.length < 2) return { titreme: 0, duraksamaSayisi: 0, hiz: 0 };
    let titreme = 0;
    let duraksamaSayisi = 0;
    for (let i = 1; i < koords.length - 1; i++) {
      const dx1 = koords[i][0] - koords[i - 1][0];
      const dy1 = koords[i][1] - koords[i - 1][1];
      const dx2 = koords[i + 1][0] - koords[i][0];
      const dy2 = koords[i + 1][1] - koords[i][1];
      const aci = Math.abs(Math.atan2(dy2, dx2) - Math.atan2(dy1, dx1));
      if (aci > Math.PI / 4) titreme++;
      const dt = koords[i + 1][2] - koords[i][2];
      if (dt > 300) duraksamaSayisi++;
    }
    const sure = koords[koords.length - 1][2] - koords[0][2];
    const hiz = sure > 0 ? Math.round(koords.length / (sure / 1000)) : 0;
    return { titreme, duraksamaSayisi, hiz };
  };

  const cizimIlerle = () => {
    if (koordinatlar.length === 0) {
      alert('Lütfen önce çizim yapınız!');
      return;
    }
    const metrik = cizimMetrikHesapla(koordinatlar);
    let hedef = '';
    let tip = '';
    if (cizimAdim === 0) {
      hedef = CIZIM_HARFLER[hedefHarf];
      tip = 'harf';
    } else if (cizimAdim === 1) {
      hedef = CIZIM_KELIMELER[hedefKelimeBas][0];
      tip = 'kelimeBas';
    } else {
      hedef = CIZIM_KELIMELER[hedefKelime];
      tip = 'kelime';
    }

    const yeniSonuc = { tip, hedef, ...metrik, koordinatSayisi: koordinatlar.length };
    const yeniSonuclar = [...cizimSonuclar, yeniSonuc];
    setCizimSonuclar(yeniSonuclar);
    temizleCanvas();

    // İlerle
    if (cizimAdim === 0) {
      if (cizimTekrar < 2) {
        setCizimTekrar(prev => prev + 1);
      } else {
        setCizimTekrar(0);
        if (hedefHarf < CIZIM_HARFLER.length - 1) {
          setHedefHarf(prev => prev + 1);
        } else {
          setCizimAdim(1);
          setHedefHarf(0);
        }
      }
    } else if (cizimAdim === 1) {
      if (cizimTekrar < 2) {
        setCizimTekrar(prev => prev + 1);
      } else {
        setCizimTekrar(0);
        if (hedefKelimeBas < CIZIM_KELIMELER.length - 1) {
          setHedefKelimeBas(prev => prev + 1);
        } else {
          setCizimAdim(2);
          setHedefKelimeBas(0);
        }
      }
    } else {
      if (cizimTekrar < 2) {
        setCizimTekrar(prev => prev + 1);
      } else {
        setCizimTekrar(0);
        if (hedefKelime < CIZIM_KELIMELER.length - 1) {
          setHedefKelime(prev => prev + 1);
        } else {
          setCizimTamamlandi(true);
        }
      }
    }
  };

  // ── Sonuç hesapla ──
  const sonucHesapla = () => {
    const klavyeHataOrt = klavyeSonuclar.length
      ? Math.round(klavyeSonuclar.reduce((a, b) => a + b.hata, 0) / klavyeSonuclar.length)
      : 0;
    const backspaceOrt = klavyeSonuclar.length
      ? Math.round(klavyeSonuclar.reduce((a, b) => a + b.backspace, 0) / klavyeSonuclar.length)
      : 0;
    const titremeOrt = cizimSonuclar.length
      ? Math.round(cizimSonuclar.reduce((a, b) => a + b.titreme, 0) / cizimSonuclar.length)
      : 0;
    const duraksamaOrt = cizimSonuclar.length
      ? Math.round(cizimSonuclar.reduce((a, b) => a + b.duraksamaSayisi, 0) / cizimSonuclar.length)
      : 0;

    // Risk skoru (0-100)
    let risk = 0;
    risk += Math.min(40, klavyeHataOrt * 0.8);
    risk += Math.min(20, backspaceOrt * 2);
    risk += Math.min(25, titremeOrt * 1.5);
    risk += Math.min(15, duraksamaOrt * 2);
    return { klavyeHataOrt, backspaceOrt, titremeOrt, duraksamaOrt, risk: Math.round(risk) };
  };

  // ── Render Yardımcıları ──
  const cizimGostergesi = () => {
    if (cizimAdim === 0) {
      return (
        <>
          <span style={s.badge}>Harf Çizimi</span>
          <p style={s.talimat}>
            Lütfen <strong style={{ color: '#e67e22', fontSize: '1.8rem' }}>"{CIZIM_HARFLER[hedefHarf]}"</strong> harfini çiziniz
          </p>
          <p style={s.altBilgi}>Tekrar {cizimTekrar + 1} / 3 — Harf {hedefHarf + 1} / {CIZIM_HARFLER.length}</p>
        </>
      );
    }
    if (cizimAdim === 1) {
      const kelime = CIZIM_KELIMELER[hedefKelimeBas];
      return (
        <>
          <span style={{ ...s.badge, background: 'linear-gradient(135deg,#6A74C9,#A8B8DD)' }}>Kelime Baş Harfi</span>
          <p style={s.talimat}>
            <button onClick={() => sesliOku(kelime)} style={s.sesBtn}>
              {sesOynuyor ? '🔊' : '🔈'} Dinle
            </button>
          </p>
          <p style={{ ...s.altBilgi, marginTop: 4 }}>Duyduğunuz kelimenin <strong>baş harfini</strong> yazınız</p>
          <p style={s.altBilgi}>Tekrar {cizimTekrar + 1} / 3 — Kelime {hedefKelimeBas + 1} / {CIZIM_KELIMELER.length}</p>
        </>
      );
    }
    const kelime = CIZIM_KELIMELER[hedefKelime];
    return (
      <>
        <span style={{ ...s.badge, background: 'linear-gradient(135deg,#e67e22,#f39c12)' }}>Kelime Yazma</span>
        <p style={s.talimat}>
          <button onClick={() => sesliOku(kelime)} style={s.sesBtn}>
            {sesOynuyor ? '🔊' : '🔈'} Dinle
          </button>
        </p>
        <p style={{ ...s.altBilgi, marginTop: 4 }}>Duyduğunuz kelimeyi <strong>tamamını</strong> yazınız</p>
        <p style={s.altBilgi}>Tekrar {cizimTekrar + 1} / 3 — Kelime {hedefKelime + 1} / {CIZIM_KELIMELER.length}</p>
      </>
    );
  };

  const ilerlemeYuzdesi = () => {
    if (adim === 'klavye') {
      const toplam = KLAVYE_METINLER.length + DINLEME_METINLER.length;
      return Math.round((klavyeSonuclar.length / toplam) * 50);
    }
    if (adim === 'cizim') {
      const toplam = CIZIM_HARFLER.length * 3 + CIZIM_KELIMELER.length * 3 + CIZIM_KELIMELER.length * 3;
      return 50 + Math.round((cizimSonuclar.length / toplam) * 50);
    }
    return 100;
  };

  // ─── SONUÇ EKRANI ──────────────────────────────────────────────────────────
  if (adim === 'sonuc') {
    const { klavyeHataOrt, backspaceOrt, titremeOrt, duraksamaOrt, risk } = sonucHesapla();
    const riskRenk = risk < 30 ? '#27ae60' : risk < 60 ? '#e67e22' : '#e74c3c';
    const riskLabel = risk < 30 ? 'Düşük Risk' : risk < 60 ? 'Orta Risk' : 'Yüksek Risk';
    return (
      <div style={s.sayfa}>
        <Header navigate={navigate} />
        <div style={s.icerik}>
          <div style={s.baslik}>
            <h1 style={s.h1}>Analiz <span style={{ color: '#e67e22' }}>Sonuçları</span></h1>
            <p style={s.altBaslik}>Tüm testler tamamlandı. İşte değerlendirmen:</p>
          </div>

          {/* Risk Skoru */}
          <div style={{ ...s.kart, textAlign: 'center', marginBottom: 32 }}>
            <p style={{ fontSize: '1rem', color: '#7f8c8d', marginBottom: 8, fontWeight: 600 }}>GENEL RİSK SKORU</p>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="65" fill="none" stroke="#f0f0f0" strokeWidth="14" />
                <circle cx="80" cy="80" r="65" fill="none" stroke={riskRenk} strokeWidth="14"
                  strokeDasharray={`${2 * Math.PI * 65 * risk / 100} ${2 * Math.PI * 65 * (1 - risk / 100)}`}
                  strokeLinecap="round" strokeDashoffset={2 * Math.PI * 65 * 0.25}
                  style={{ transition: 'stroke-dasharray 1s ease' }} />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: riskRenk }}>{risk}</div>
                <div style={{ fontSize: '0.8rem', color: '#999', fontWeight: 600 }}>/ 100</div>
              </div>
            </div>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: riskRenk, marginTop: 12 }}>{riskLabel}</p>
            {risk >= 60 && (
              <p style={{ fontSize: '0.95rem', color: '#666', marginTop: 8, maxWidth: 400, margin: '8px auto 0' }}>
                Sonuçlar dikkat gerektiriyor. Bir uzmanla görüşmenizi öneririz.
              </p>
            )}
          </div>

          {/* Metrik kartları */}
          <div style={s.grid2}>
            <MetrikKart baslik="Klavye Hata Oranı" deger={`%${klavyeHataOrt}`} renk="#3498db" ikon="⌨️"
              aciklama="Referans metne göre ortalama yazım hatası" />
            <MetrikKart baslik="Silme (Backspace)" deger={backspaceOrt} renk="#9b59b6" ikon="⌫"
              aciklama="Yazı başına ortalama geri silme sayısı" />
            <MetrikKart baslik="Çizim Titremesi" deger={titremeOrt} renk="#e67e22" ikon="✏️"
              aciklama="Harf çizimindeki yön değişimi sayısı" />
            <MetrikKart baslik="Çizim Duraksaması" deger={duraksamaOrt} renk="#e74c3c" ikon="⏸️"
              aciklama="Çizim sırasında 300ms+ duraksama sayısı" />
          </div>

          {/* Detaylı tablolar */}
          <div style={s.grid2}>
            <div style={s.kart}>
              <h3 style={s.kartBaslik}>⌨️ Klavye Analizi</h3>
              <table style={s.tablo}>
                <thead>
                  <tr>
                    <th style={s.th}>Tip</th>
                    <th style={s.th}>Hata %</th>
                    <th style={s.th}>Backspace</th>
                    <th style={s.th}>Ort. Aralık</th>
                  </tr>
                </thead>
                <tbody>
                  {klavyeSonuclar.map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                      <td style={s.td}>{r.tip === 'yaz' ? '📖 Yazarak' : '🎧 Dinleyerek'}</td>
                      <td style={{ ...s.td, color: r.hata > 30 ? '#e74c3c' : '#27ae60', fontWeight: 700 }}>%{r.hata}</td>
                      <td style={s.td}>{r.backspace}</td>
                      <td style={s.td}>{r.aralikOrt}ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={s.kart}>
              <h3 style={s.kartBaslik}>✏️ Çizim Analizi</h3>
              <table style={s.tablo}>
                <thead>
                  <tr>
                    <th style={s.th}>Tip</th>
                    <th style={s.th}>Hedef</th>
                    <th style={s.th}>Titreme</th>
                    <th style={s.th}>Duraklama</th>
                  </tr>
                </thead>
                <tbody>
                  {cizimSonuclar.slice(0, 10).map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                      <td style={s.td}>{r.tip === 'harf' ? '🔤' : r.tip === 'kelimeBas' ? '🔠' : '📝'}</td>
                      <td style={{ ...s.td, fontWeight: 700, color: '#2c3e50' }}>{r.hedef}</td>
                      <td style={{ ...s.td, color: r.titreme > 5 ? '#e74c3c' : '#27ae60', fontWeight: 600 }}>{r.titreme}</td>
                      <td style={{ ...s.td, color: r.duraksamaSayisi > 2 ? '#e74c3c' : '#27ae60', fontWeight: 600 }}>{r.duraksamaSayisi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 40, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/rapor')} style={s.birincilBtn}>Gelişim Raporumu Gör ➔</button>
            <button onClick={() => { setAdim('klavye'); setKlavyeAlt('yaz'); setKlavyeIndex(0); setDinleIndex(0); setKlavyeSonuclar([]); setCizimSonuclar([]); setCizimAdim(0); setCizimTekrar(0); setHedefHarf(0); setKlavyeTamamlandi(false); setCizimTamamlandi(false); }} style={s.ikinciBtn}>
              Tekrar Başla
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── RENDER ────────────────────────────────────────────────────────────────
  const ilerleme = ilerlemeYuzdesi();

  return (
    <div style={s.sayfa}>
      <Header navigate={navigate} />

      <div style={s.icerik}>
        {/* Başlık */}
        <div style={s.baslik}>
          <h1 style={s.h1}>Tanı ve <span style={{ color: '#e67e22' }}>Analiz</span></h1>
          <p style={s.altBaslik}>Yapay zeka destekli okuma ve yazma değerlendirmesi</p>
        </div>

        {/* İlerleme Çubuğu */}
        <div style={s.ilerlemeSarica}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2c3e50' }}>
              {adim === 'klavye' ? '1. Klavye Analizi' : '2. Çizim Analizi'}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>%{ilerleme}</span>
          </div>
          <div style={s.ilerlemeBar}>
            <div style={{ ...s.ilerlemeIc, width: `${ilerleme}%` }} />
          </div>
          <div style={s.adimlar}>
            <AdimGostergesi aktif={adim === 'klavye'} tamam={adim === 'cizim' || adim === 'sonuc'} no={1} label="Klavye" />
            <div style={{ flex: 1, height: 2, background: adim !== 'klavye' ? '#3498db' : '#ddd', margin: '0 8px', alignSelf: 'center', borderRadius: 4, transition: 'background 0.5s' }} />
            <AdimGostergesi aktif={adim === 'cizim'} tamam={adim === 'sonuc'} no={2} label="Çizim" />
            <div style={{ flex: 1, height: 2, background: adim === 'sonuc' ? '#3498db' : '#ddd', margin: '0 8px', alignSelf: 'center', borderRadius: 4, transition: 'background 0.5s' }} />
            <AdimGostergesi aktif={adim === 'sonuc'} tamam={false} no={3} label="Sonuç" />
          </div>
        </div>

        {/* ── KLAVYE BÖLÜMÜ ── */}
        {adim === 'klavye' && (
          <div style={s.kart}>
            {/* Alt sekme */}
            <div style={s.sekmeSarici}>
              <button style={{ ...s.sekme, ...(klavyeAlt === 'yaz' ? s.sekmeAktif : {}) }}>
                📖 Bakarak Yazma ({Math.min(klavyeIndex + 1, KLAVYE_METINLER.length)}/{KLAVYE_METINLER.length})
              </button>
              <button style={{ ...s.sekme, ...(klavyeAlt === 'dinle' ? s.sekmeAktif : {}) }}>
                🎧 Dinleyerek Yazma ({Math.min(dinleIndex + 1, DINLEME_METINLER.length)}/{DINLEME_METINLER.length})
              </button>
            </div>

            {!klavyeTamamlandi ? (
              <>
                {klavyeAlt === 'yaz' ? (
                  <div style={s.referansKutu}>
                    <p style={{ fontSize: '0.8rem', color: '#7f8c8d', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Referans Metin</p>
                    <p style={{ fontSize: '1.25rem', color: '#2c3e50', fontWeight: 600, lineHeight: 1.6 }}>
                      {KLAVYE_METINLER[klavyeIndex]}
                    </p>
                  </div>
                ) : (
                  <div style={{ ...s.referansKutu, borderLeftColor: '#6A74C9', background: 'linear-gradient(135deg, #f8f4ff, #fff)' }}>
                    <p style={{ fontSize: '0.8rem', color: '#7f8c8d', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Sesli Metin</p>
                    <button onClick={() => sesliOku(DINLEME_METINLER[dinleIndex])} style={s.sesBtn}>
                      {sesOynuyor ? '🔊 Oynuyor...' : '🔈 Metni Dinle'}
                    </button>
                    <p style={{ fontSize: '0.85rem', color: '#999', marginTop: 10 }}>Duyduğunuz metni aşağıya yazınız. Metni tekrar göremezsiniz.</p>
                  </div>
                )}

                <textarea
                  placeholder="Buraya yazınız..."
                  value={yazılanMetin}
                  onChange={(e) => setYazılanMetin(e.target.value)}
                  onKeyDown={handleTusBasildi}
                  style={s.textArea}
                  autoFocus
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <p style={{ fontSize: '0.82rem', color: '#aaa' }}>⏱ Yazım hızı ve ritminiz ölçülüyor</p>
                  <button
                    onClick={klavyeIlerle}
                    disabled={yazılanMetin.trim().length === 0}
                    style={{ ...s.birincilBtn, opacity: yazılanMetin.trim().length === 0 ? 0.4 : 1 }}
                  >
                    Kaydet ve İlerle ➔
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '4rem', marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2c3e50', marginBottom: 8 }}>Klavye Analizi Tamamlandı!</h3>
                <p style={{ color: '#7f8c8d', marginBottom: 32 }}>{klavyeSonuclar.length} test kaydedildi. Şimdi çizim analizine geçebilirsiniz.</p>
                <button onClick={() => setAdim('cizim')} style={s.birincilBtn}>Çizim Analizine Geç ➔</button>
              </div>
            )}
          </div>
        )}

        {/* ── ÇİZİM BÖLÜMÜ ── */}
        {adim === 'cizim' && (
          <div style={s.kart}>
            <div style={s.cizimUst}>
              {cizimGostergesi()}
            </div>

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
                    width={500}
                    height={300}
                    style={s.canvas}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <button onClick={temizleCanvas} style={s.ikinciBtn}>🗑 Temizle</button>
                  <button onClick={cizimIlerle} style={s.birincilBtn}>Kaydet ve İlerle ➔</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2c3e50', marginBottom: 8 }}>Tüm Testler Tamamlandı!</h3>
                <p style={{ color: '#7f8c8d', marginBottom: 32 }}>Sonuçlarınız hazırlanıyor...</p>
                <button onClick={() => setAdim('sonuc')} style={s.birincilBtn}>Sonuçları Gör ➔</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── YARDIMCI BİLEŞENLER ─────────────────────────────────────────────────────
function Header({ navigate }) {
  return (
    <header style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px clamp(20px, 5vw, 80px)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(5px)'
            }}>
              <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <img 
                  src={logo} 
                  alt="İzge Logo" 
                  style={{ height: '60px', objectFit: 'contain' }} 
                />
              </div>
    
              <nav style={{ display: 'flex', gap: '30px', fontWeight: 'bold' }}>
                <span style={navLinkStyle} onClick={() => navigate('/')}>Ana Sayfa</span>
                <span style={navLinkStyle} onClick={() => navigate('/rapor')}>Gelişim Raporu</span>
                <span style={navLinkStyle} onClick={() => navigate('/analiz')}>Context</span>
                <span style={navLinkStyle} onClick={() => {
                  if (window.location.pathname === '/') {
                    // Zaten ana sayfadaysak sadece aşağı kaydır
                    document.getElementById('hakkimizda')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    // Başka sayfadaysak önce ana sayfaya git, 100ms bekle ve kaydır
                    navigate('/');
                    setTimeout(() => {
                      document.getElementById('hakkimizda')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}>
                  Hakkımızda
                </span>
              </nav>
            </header>
  );
}

function AdimGostergesi({ aktif, tamam, no, label }) {
  const renk = tamam ? '#27ae60' : aktif ? '#3498db' : '#ddd';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: renk, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem', transition: 'background 0.4s', boxShadow: aktif ? '0 0 0 4px rgba(52,152,219,0.2)' : 'none' }}>
        {tamam ? '✓' : no}
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: aktif ? '#3498db' : '#aaa' }}>{label}</span>
    </div>
  );
}

function MetrikKart({ baslik, deger, renk, ikon, aciklama }) {
  return (
    <div style={{ background: 'white', borderRadius: 20, padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', borderTop: `4px solid ${renk}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: '1.8rem' }}>{ikon}</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: 0.5 }}>{baslik}</span>
      </div>
      <div style={{ fontSize: '2.4rem', fontWeight: 900, color: renk }}>{deger}</div>
      <p style={{ fontSize: '0.82rem', color: '#aaa', marginTop: 4 }}>{aciklama}</p>
    </div>
  );
}

// ─── STİLLER ─────────────────────────────────────────────────────────────────
const s = {
  sayfa: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #f0f4ff 0%, #fef9f3 50%, #f5f8ff 100%)',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: '#2c3e50',
  },
  icerik: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '40px 20px 80px',
  },
  baslik: {
    textAlign: 'center',
    marginBottom: 36,
  },
  h1: {
    fontSize: 'clamp(2rem,5vw,3rem)',
    fontWeight: 900,
    marginBottom: 8,
    color: '#2c3e50',
  },
  altBaslik: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
    fontWeight: 500,
  },
  ilerlemeSarica: {
    background: 'white',
    borderRadius: 20,
    padding: '20px 24px',
    marginBottom: 28,
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  },
  ilerlemeBar: {
    height: 8,
    background: '#f0f0f0',
    borderRadius: 99,
    overflow: 'hidden',
    marginBottom: 20,
  },
  ilerlemeIc: {
    height: '100%',
    background: 'linear-gradient(90deg,#3498db,#6A74C9)',
    borderRadius: 99,
    transition: 'width 0.5s ease',
  },
  adimlar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kart: {
    background: 'white',
    borderRadius: 28,
    padding: 'clamp(24px,4vw,40px)',
    boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
  },
  sekmeSarici: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  sekme: {
    padding: '10px 20px',
    borderRadius: 99,
    border: '2px solid #eee',
    background: 'transparent',
    cursor: 'default',
    fontWeight: 700,
    fontSize: '0.9rem',
    color: '#aaa',
  },
  sekmeAktif: {
    background: 'linear-gradient(135deg,#3498db,#6A74C9)',
    color: 'white',
    border: '2px solid transparent',
  },
  referansKutu: {
    background: 'linear-gradient(135deg,#fff8f2,#fff)',
    borderLeft: '5px solid #e67e22',
    borderRadius: 16,
    padding: '20px 24px',
    marginBottom: 20,
  },
  textArea: {
    width: '100%',
    height: 130,
    padding: 16,
    borderRadius: 16,
    border: '2px solid #eee',
    fontSize: '1.05rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    marginBottom: 16,
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  sesBtn: {
    padding: '12px 28px',
    borderRadius: 99,
    background: 'linear-gradient(135deg,#6A74C9,#3498db)',
    color: 'white',
    border: 'none',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(52,152,219,0.3)',
  },
  cizimUst: {
    textAlign: 'center',
    marginBottom: 20,
  },
  badge: {
    display: 'inline-block',
    padding: '6px 18px',
    borderRadius: 99,
    background: 'linear-gradient(135deg,#3498db,#6A74C9)',
    color: 'white',
    fontWeight: 700,
    fontSize: '0.85rem',
    marginBottom: 14,
  },
  talimat: {
    fontSize: '1.15rem',
    fontWeight: 600,
    color: '#2c3e50',
    marginBottom: 4,
  },
  altBilgi: {
    fontSize: '0.85rem',
    color: '#aaa',
    fontWeight: 500,
  },
  canvasSarici: {
    display: 'flex',
    justifyContent: 'center',
  },
  canvas: {
    background: 'white',
    border: '2.5px dashed #3498db',
    borderRadius: 20,
    cursor: 'crosshair',
    touchAction: 'none',
    maxWidth: '100%',
    boxShadow: '0 4px 20px rgba(52,152,219,0.1)',
  },
  birincilBtn: {
    padding: '14px 36px',
    borderRadius: 99,
    background: 'linear-gradient(135deg,#3498db,#6A74C9)',
    color: 'white',
    border: 'none',
    fontWeight: 800,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(52,152,219,0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  ikinciBtn: {
    padding: '14px 28px',
    borderRadius: 99,
    background: 'white',
    color: '#2c3e50',
    border: '2px solid #eee',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 20,
    marginBottom: 24,
  },
  kartBaslik: {
    fontSize: '1.1rem',
    fontWeight: 800,
    marginBottom: 16,
    color: '#2c3e50',
  },
  tablo: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.88rem',
  },
  th: {
    padding: '8px 10px',
    textAlign: 'left',
    fontWeight: 700,
    color: '#7f8c8d',
    borderBottom: '2px solid #f0f0f0',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  td: {
    padding: '8px 10px',
    color: '#2c3e50',
    borderBottom: '1px solid #f5f5f5',
  },
};

const navLinkStyle = {
  cursor: 'pointer',
  fontSize: '1.1rem',
  transition: 'color 0.3s ease',
  color: '#2c3e50'
};
