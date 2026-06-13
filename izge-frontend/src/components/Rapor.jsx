import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area, Legend, BarChart, Bar 
} from 'recharts';

import logo from '../assets/images/Resim1.png'; // Logoyu ekledik

const RENKLER = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Rapor() {
  const location = useLocation();
  const navigate = useNavigate();

  // Test bitip de yönlenen kullanıcı için anlık veri:
  const anlikVeri = location.state?.analizVerisi;
  
  // State'ler
  const [seciliVeri, setSeciliVeri] = useState(anlikVeri);
  const [gecmisTestler, setGecmisTestler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  // Sayfa yüklendiğinde geçmiş verileri backend'den çekelim
  useEffect(() => {
    const gecmisVerileriGetir = async () => {
      try {
        // Gerçek Backend URL'ine istek atıyoruz
        const response = await fetch('http://localhost:8080/api/analiz/gecmis');
        if (!response.ok) throw new Error("Veriler çekilemedi");
        
        const data = await response.json(); // Backend'den gelen tüm geçmiş testler

        // Verileri en yeni test en üstte görünecek şekilde ters çevirelim
        const siraliData = data.reverse();

        // Eğer kullanıcı testi yeni bitirip bu sayfaya yönlendirildiyse (anlikVeri doluysa) 
        // ve bu anlık veri henüz veritabanından dönen listede yoksa geçici olarak en başa ekleyelim
        if (anlikVeri && !siraliData.some(d => d.id === anlikVeri.id)) {
          // Tarih ve saat formatını o anki zamana göre oluşturalım
          const bugun = new Date();
          const yeniTest = {
            ...anlikVeri,
            tarih: bugun.toLocaleDateString('tr-TR'),
            saat: bugun.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          };
          siraliData.unshift(yeniTest);
        }

        setGecmisTestler(siraliData);

        // Eğer kullanıcı sayfaya direkt girdiyse ve test listesi boş değilse, en üsttekini seçili yap
        if (!seciliVeri && siraliData.length > 0) {
          setSeciliVeri(siraliData[0]);
        }
      } catch (error) {
        console.error("Geçmiş veriler alınırken hata oluştu:", error);
      } finally {
        setYukleniyor(false);
      }
    };

    gecmisVerileriGetir();
  }, []);

  if (yukleniyor) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '1.2rem' }}>Verileriniz Yükleniyor...</div>;
  }

  if (!seciliVeri) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ color: '#334155' }}>Henüz Analiz Verisi Yok</h2>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>Raporları görebilmek için önce bir test tamamlamalısınız.</p>
        <button onClick={() => navigate('/analiz')} style={s.birincilBtn}>Teste Git</button>
      </div>
    );
  }

  // Grafikler için veriyi hazırlama
  const barGrafikVerisi = [
    { isim: 'Klavye Hata', deger: seciliVeri.klavyeHataOrtalamasi },
    { isim: 'Silme (Del)', deger: seciliVeri.backspaceOrtalamasi },
    { isim: 'Titreme', deger: seciliVeri.titremeOrtalamasi },
    { isim: 'Duraksama', deger: seciliVeri.duraksamaOrtalamasi }
  ];

  // Gelişim grafiği (Eskiden yeniye doğru çizdirmek için listeyi ters çeviriyoruz)
  const gelisimVerisi = [...gecmisTestler].reverse().map((test, index) => ({
    isim: `Test ${index + 1}`,
    skor: test.riskSkoru
  }));

  return (
    <div style={s.sayfa}>
      <Header navigate={navigate} />
      
      <div style={s.icerik}>
        <div style={s.baslikAlani}>
          <div>
            <h1 style={s.h1}>Gelişim <span style={{ color: '#3b82f6' }}>Raporu</span></h1>
            <p style={s.altBaslik}>Yapay zeka analizlerinizin zaman içindeki değişimi.</p>
          </div>
        </div>

        <div style={s.layout}>
          {/* SOL TARAF (Dashboard ve Grafikler) */}
          <div style={s.solTaraf}>
            
            {/* 1. Satır: İstatistik Kartları */}
            <div style={s.istatistikGrid}>
              <div style={s.kart}>
                <div style={s.kartIkon}>🧠</div>
                <div style={s.kartBaslik}>RİSK SKORU</div>
                <div style={{...s.kartDeger, color: seciliVeri.riskSkoru > 60 ? '#ef4444' : seciliVeri.riskSkoru > 30 ? '#f59e0b' : '#10b981'}}>
                  {seciliVeri.riskSkoru} / 100
                </div>
                <div style={s.kartAltBilgi}>{seciliVeri.riskSeviyesi}</div>
              </div>
              
              <div style={s.kart}>
                <div style={s.kartIkon}>⌨️</div>
                <div style={s.kartBaslik}>KLAVYE HATASI</div>
                <div style={s.kartDeger}>{seciliVeri.klavyeHataOrtalamasi}</div>
                <div style={s.kartAltBilgi}>Ortalama Hata Miktarı</div>
              </div>

              <div style={s.kart}>
                <div style={s.kartIkon}>✏️</div>
                <div style={s.kartBaslik}>MOTOR BECERİ (Titreme)</div>
                <div style={s.kartDeger}>{seciliVeri.titremeOrtalamasi}</div>
                <div style={s.kartAltBilgi}>Birim Sapma</div>
              </div>

              <div style={s.kart}>
                <div style={s.kartIkon}>⏱️</div>
                <div style={s.kartBaslik}>DURAKSAMA SÜRESİ</div>
                <div style={s.kartDeger}>{seciliVeri.duraksamaOrtalamasi}</div>
                <div style={s.kartAltBilgi}>Saniye Gecikme</div>
              </div>
            </div>

            {/* 2. Satır: Grafikler */}
            <div style={s.grafikGrid}>
              
              {/* Genel İlerleme Grafiği (Zaman İçindeki Risk Skoru) */}
              <div style={s.grafikKart}>
                <h3 style={s.grafikBaslik}>Genel Gelişim Eğrisi (Risk Skoru)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={gelisimVerisi} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="renkSkor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="isim" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="skor" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#renkSkor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Seçili Testin Metrik Analizi */}
              <div style={s.grafikKart}>
                <h3 style={s.grafikBaslik}>Seçili Test Dağılımı</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barGrafikVerisi} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="isim" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="deger" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>

          {/* SAĞ TARAF (Timeline - Geçmiş Testler Listesi) */}
          <div style={s.sagTaraf}>
            <div style={s.timelineKart}>
              <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '20px', fontWeight: 'bold' }}>Geçmiş Oturumlar</h3>
              
              <div style={s.timelineAlan}>
                {gecmisTestler.map((test, index) => {
                  const aktifMi = seciliVeri.id === test.id;
                  return (
                    <div 
                      key={index} 
                      style={{...s.timelineOge, ...(aktifMi ? s.timelineOgeAktif : {})}}
                      onClick={() => setSeciliVeri(test)}
                    >
                      <div style={{...s.timelineDaire, backgroundColor: aktifMi ? '#3b82f6' : '#cbd5e1'}}></div>
                      <div style={s.timelineIcerik}>
                        <div style={s.timelineTarih}>{test.tarih || 'Bugün'}</div>
                        <div style={s.timelineSaat}>{test.saat}</div>
                        <div style={{ marginTop: '8px', fontSize: '0.85rem', fontWeight: 'bold', color: test.riskSkoru > 60 ? '#ef4444' : test.riskSkoru > 30 ? '#f59e0b' : '#10b981' }}>
                          Risk Skoru: {test.riskSkoru}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Header({ navigate }) {
  const navLinkStyle = { cursor: 'pointer', fontSize: '1.1rem', transition: 'color 0.3s ease', color: '#2c3e50', fontWeight: 'bold' };
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px clamp(20px, 5vw, 80px)', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0' }}>
      <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}><img src={logo} alt="İzge Logo" style={{ height: '50px', objectFit: 'contain' }} /></div>
      <nav style={{ display: 'flex', gap: '30px' }}>
        <span style={navLinkStyle} onClick={() => navigate('/')}>Ana Sayfa</span>
        <span style={{...navLinkStyle, color: '#3b82f6'}} onClick={() => navigate('/rapor')}>Gelişim Raporu</span>
        <span style={navLinkStyle} onClick={() => navigate('/analiz')}>Analiz Testi</span>
      </nav>
    </header>
  );
}

// ─── Tasarım Stilleri ───
const s = {
  sayfa: { minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Segoe UI', system-ui, sans-serif" },
  icerik: { maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' },
  baslikAlani: { marginBottom: '30px' },
  h1: { fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0' },
  altBaslik: { fontSize: '1.1rem', color: '#64748b', margin: 0 },
  
  layout: { display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' },
  
  solTaraf: { flex: '1 1 800px', display: 'flex', flexDirection: 'column', gap: '30px' },
  
  istatistikGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
  kart: { backgroundColor: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
  kartIkon: { fontSize: '2rem', marginBottom: '10px' },
  kartBaslik: { fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '1px', marginBottom: '10px' },
  kartDeger: { fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 },
  kartAltBilgi: { fontSize: '0.9rem', color: '#64748b', marginTop: '10px', fontWeight: 500 },

  grafikGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' },
  grafikKart: { backgroundColor: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  grafikBaslik: { fontSize: '1.1rem', fontWeight: 700, color: '#334155', marginBottom: '20px' },

  sagTaraf: { flex: '0 0 320px', width: '320px' },
  timelineKart: { backgroundColor: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'sticky', top: '20px', maxHeight: '80vh', overflowY: 'auto' },
  timelineAlan: { position: 'relative', paddingLeft: '20px', borderLeft: '2px solid #e2e8f0' },
  timelineOge: { position: 'relative', padding: '16px', marginBottom: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid transparent' },
  timelineOgeAktif: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe', transform: 'translateX(-5px)' },
  timelineDaire: { position: 'absolute', width: '14px', height: '14px', borderRadius: '50%', left: '-28px', top: '20px', border: '3px solid white', boxShadow: '0 0 0 2px #e2e8f0' },
  timelineIcerik: { display: 'flex', flexDirection: 'column' },
  timelineTarih: { fontSize: '1rem', fontWeight: 700, color: '#334155' },
  timelineSaat: { fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' },

  birincilBtn: { padding: '12px 30px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '99px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }
};