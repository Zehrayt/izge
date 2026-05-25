import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';

const RENKLER = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8E44AD'];

export default function Rapor() {
  const location = useLocation();
  const navigate = useNavigate();

  // KÖPRÜNÜN SONU: Analiz sayfasından gönderilen gerçek veriyi yakalıyoruz
  const gercekVeri = location.state?.analizVerisi;

  // Eğer kullanıcı test yapmadan direkt "/rapor" url'sine girdiyse onu uyar ve teste geri gönder
  if (!gercekVeri) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ color: '#334155' }}>Analiz Verisi Bulunamadı</h2>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>Raporu görüntüleyebilmek için lütfen önce okuma testini tamamlayın.</p>
        <button 
          onClick={() => navigate('/analiz')}
          style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
        >
          Teste Geri Dön
        </button>
      </div>
    );
  }

  // Gelen gerçek verileri Bar Chart'ın anlayacağı dizi (array) formatına çeviriyoruz
  const metrikVerileri = [
    { isim: 'Klavye Hatası', deger: gercekVeri.klavyeHataOrtalamasi },
    { isim: 'Silme (Backspace)', deger: gercekVeri.backspaceOrtalamasi },
    { isim: 'Titreme', deger: gercekVeri.titremeOrtalamasi },
    { isim: 'Duraksama', deger: gercekVeri.duraksamaOrtalamasi }
  ];

  // Yapay Zeka tahminleri listesini grafiğe hazırlıyoruz
  const aiTahminleri = gercekVeri.yapayZekaTahminleri || [];

  return (
    <div style={{ padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1e293b', margin: 0 }}>İzge Analiz Sonuçları</h1>
        <span style={{ 
            backgroundColor: gercekVeri.riskSkoru > 60 ? '#fee2e2' : '#e0f2fe', 
            color: gercekVeri.riskSkoru > 60 ? '#ef4444' : '#0284c7', 
            padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' 
        }}>
          Risk Seviyesi: {gercekVeri.riskSeviyesi}
        </span>
      </div>

      {/* 1. SATIR: ÖZET KARTLARI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={cardStyle}>
          <p style={cardLabelStyle}>YAPAY ZEKA RİSK SKORU</p>
          <h2 style={{ ...cardValueStyle, color: gercekVeri.riskSkoru > 60 ? '#ef4444' : '#10b981' }}>
            %{gercekVeri.riskSkoru}
          </h2>
        </div>
        <div style={cardStyle}>
          <p style={cardLabelStyle}>KLAVYE HATA ORT.</p>
          <h2 style={{ ...cardValueStyle, color: '#f59e0b' }}>{gercekVeri.klavyeHataOrtalamasi}</h2>
        </div>
        <div style={cardStyle}>
          <p style={cardLabelStyle}>SİLME (BACKSPACE)</p>
          <h2 style={{ ...cardValueStyle, color: '#3b82f6' }}>{gercekVeri.backspaceOrtalamasi}</h2>
        </div>
        <div style={cardStyle}>
          <p style={cardLabelStyle}>DURAKSAMA SÜRESİ</p>
          <h2 style={{ ...cardValueStyle, color: '#8b5cf6' }}>{gercekVeri.duraksamaOrtalamasi}</h2>
        </div>
      </div>

      {/* 2. SATIR: GRAFİKLER */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px' }}>
        
        {/* Tüm Metriklerin Karşılaştırmalı Çubuk Grafiği */}
        <div style={graphBoxStyle}>
          <h3 style={graphTitleStyle}>Oturum Metrik Dağılımı</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrikVerileri}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="isim" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <RechartsTooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="deger" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Yapay Zeka Anomali Tahminleri (Pie Chart) */}
        <div style={graphBoxStyle}>
          <h3 style={graphTitleStyle}>AI Modeli Okuma Anomalisi Tespitleri</h3>
          {aiTahminleri.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={aiTahminleri} 
                  innerRadius={70} 
                  outerRadius={90} 
                  paddingAngle={5} 
                  dataKey="deger"   // Backend'den gelen AITahminDTO içindeki alan adı (örn: deger/oran)
                  nameKey="isim"    // Backend'den gelen AITahminDTO içindeki alan adı (örn: anomaliTuru/isim)
                >
                  {aiTahminleri.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={RENKLER[index % RENKLER.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display:'flex', height:'300px', alignItems:'center', justifyContent:'center', color:'#94a3b8' }}>
              Yapay zeka tahmini bulunamadı.
            </div>
          )}
        </div>

        {/* AI Yorum Özeti */}
        <div style={{ ...graphBoxStyle, gridColumn: '1 / -1', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h3 style={{ ...graphTitleStyle, color: '#166534', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🧠 Yapay Zeka Sonuç Raporu
          </h3>
          <p style={{ color: '#15803d', lineHeight: '1.6', margin: 0, fontSize: '15px' }}>
            Bu test oturumunda kullanıcının <strong>{gercekVeri.duraksamaOrtalamasi} saniye duraksama</strong> ve <strong>{gercekVeri.titremeOrtalamasi} birim fare titremesi</strong> gerçekleştirdiği tespit edilmiştir. 
            Modellerimiz bu motor beceri ve klavye hatalarını analiz ederek güncel risk skorunu <strong>%{gercekVeri.riskSkoru}</strong> olarak belirlemiştir. 
            Bu seviye sistem tarafından <strong>"{gercekVeri.riskSeviyesi}"</strong> olarak sınıflandırılmaktadır.
          </p>
        </div>

      </div>
    </div>
  );
}

// Ortak Tasarım Stilleri
const cardStyle = { 
  backgroundColor: 'white', padding: '25px', borderRadius: '16px', 
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  display: 'flex', flexDirection: 'column', justifyContent: 'center'
};
const cardLabelStyle = { color: '#64748b', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px', margin: '0 0 10px 0' };
const cardValueStyle = { fontSize: '32px', fontWeight: 'bold', margin: 0 };

const graphBoxStyle = { 
  backgroundColor: 'white', padding: '25px', borderRadius: '16px', 
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
};
const graphTitleStyle = { margin: '0 0 20px 0', fontSize: '16px', color: '#334155', fontWeight: '600' };