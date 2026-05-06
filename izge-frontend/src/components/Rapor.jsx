import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line 
} from 'recharts';

// Arkadaşlarının istediği veriler (Simüle edilmiş)
const haftalikVeri = [
  { ad: 'Pzt', hiz: 42, hata: 5 },
  { ad: 'Sal', hiz: 48, hata: 4 },
  { ad: 'Çar', hiz: 45, hata: 6 },
  { ad: 'Per', hiz: 55, hata: 3 },
  { ad: 'Cum', hiz: 58, hata: 2 },
  { ad: 'Cmt', hiz: 65, hata: 2 },
  { ad: 'Paz', hiz: 70, hata: 1 },
];

const hataDagilimi = [
  { name: 'Harf Karıştırma', value: 45 },
  { name: 'Satır Atlama', value: 25 },
  { name: 'Yazım Yanlışı', value: 20 },
  { name: 'Diğer', value: 10 },
];

const RENKLER = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Rapor() {
  return (
    <div style={{ padding: '40px', backgroundColor: '#f4f7f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '30px' }}>Gelişim Raporu</h1>

      {/* ÜST ÖZET KARTLARI (image_81'deki gibi) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={cardStyle}>
          <p style={{ color: '#7f8c8d', fontSize: '14px', margin: 0 }}>DİSLEKSİ RİSK SKORU</p>
          <h2 style={{ color: '#e74c3c', fontSize: '36px', margin: '10px 0' }}>%85</h2>
          <span style={{ backgroundColor: '#fdecea', color: '#e74c3c', padding: '4px 8px', borderRadius: '5px', fontSize: '12px' }}>Kritik Seviye</span>
        </div>
        <div style={cardStyle}>
          <p style={{ color: '#7f8c8d', fontSize: '14px', margin: 0 }}>ORTALAMA YAZIM HIZI</p>
          <h2 style={{ color: '#2980b9', fontSize: '36px', margin: '10px 0' }}>52 <small style={{fontSize: '16px'}}>K/D</small></h2>
          <span style={{ backgroundColor: '#eaf4fb', color: '#2980b9', padding: '4px 8px', borderRadius: '5px', fontSize: '12px' }}>%15 İyileşme</span>
        </div>
        <div style={cardStyle}>
          <p style={{ color: '#7f8c8d', fontSize: '14px', margin: 0 }}>TOPLAM ANALİZ SÜRESİ</p>
          <h2 style={{ color: '#27ae60', fontSize: '36px', margin: '10px 0' }}>120 <small style={{fontSize: '16px'}}>dk</small></h2>
          <span style={{ backgroundColor: '#eafaf1', color: '#27ae60', padding: '4px 8px', borderRadius: '5px', fontSize: '12px' }}>7 Seans</span>
        </div>
      </div>

      {/* GRAFİKLER (image_82 ve 83 referanslı) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        
        {/* Yazım Hızı Grafiği */}
        <div style={graphBoxStyle}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Haftalık Yazım Hızı Gelişimi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={haftalikVeri}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="ad" />
              <YAxis />
              <Tooltip cursor={{fill: '#f0f0f0'}} />
              <Bar dataKey="hiz" fill="#3498db" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hata Analizi Pastası */}
        <div style={graphBoxStyle}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Bilişsel Profil: Hata Dağılımı</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={hataDagilimi} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {hataDagilimi.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={RENKLER[index % RENKLER.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Fare Hareket Stabilite Grafiği */}
        <div style={{ ...graphBoxStyle, gridColumn: 'span 1' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Motor Beceriler: Fare Stabilite Analizi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={haftalikVeri}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="ad" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hiz" stroke="#8e44ad" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Yorumu Kutusu (image_84 referanslı) */}
        <div style={{ ...graphBoxStyle, backgroundColor: '#fffbe6', border: '1px solid #ffe58f' }}>
          <h3 style={{ color: '#856404', marginBottom: '15px' }}>🤖 Yapay Zeka Gözlemi</h3>
          <p style={{ color: '#856404', lineHeight: '1.6' }}>
            Kullanıcının <strong>b-d</strong> harflerini karıştırma eğilimi hafta başına göre <strong>%20 azaldı</strong>. 
            Okuma odağı özellikle "Satır Odaklama" modu açıkken çok daha stabil. 
            Bir sonraki aşama olarak daha karmaşık cümle yapılarına geçilmesi önerilir.
          </p>
        </div>

      </div>
    </div>
  );
}

const cardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const graphBoxStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '25px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' };