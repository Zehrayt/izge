import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AnaSayfa() {
  const navigate = useNavigate();
  const anaRenk = '#f6f4f0'; 
  const izgeTuruncu = '#e67e22'; 

  return (
    <div style={{ color: '#2c3e50', backgroundColor: 'white', paddingBottom: '50px', minHeight: '100vh' }}>
      
      <section style={{ 
        backgroundColor: anaRenk, 
        // padding'i ekrana göre dinamik yaptık
        padding: 'clamp(20px, 5vw, 50px)', 
        borderRadius: '40px',
        margin: 'clamp(10px, 3vw, 20px)',
        textAlign: 'center'
      }}>
        
        <div style={{ textAlign: 'left', marginBottom: 'clamp(20px, 4vw, 40px)' }}>
           <img 
             src="/IMG_3031.jpg" 
             alt="İzge Logo" 
             style={{ height: 'clamp(50px, 8vw, 70px)', objectFit: 'contain' }} 
           />
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '30px',
          flexWrap: 'wrap-reverse'
        }}>
          
          <div style={{ flex: 1, textAlign: 'center', minWidth: 'min(100%, 350px)' }}>
            <h1 style={{ 
                // Yazı boyutu artık telefonda küçük, bilgisayarda büyük olacak
                fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
                fontWeight: '900', 
                lineHeight: '1.2', 
                marginBottom: '25px',
                color: '#2c3e50' // Dark mode ezmesin diye rengi zorladık
            }}>
              Yolculuğunu <br /> 
              <span style={{ color: izgeTuruncu }}>İzge</span> ile Güçlendir
            </h1>
            <p style={{ 
                fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
                color: '#5f6769', 
                marginBottom: '40px', 
                lineHeight: '1.6', 
                maxWidth: '600px', 
                margin: '0 auto 40px auto' 
            }}>
              İzge, erken teşhis ile anlık müdahaleyi aynı platformda buluşturan yapay zeka destekli bir okuma ve yazma asistanıdır.
            </p>
            
            <button 
             onClick={() => navigate('/analiz')} 
             style={{ 
             padding: 'clamp(15px, 3vw, 25px) clamp(30px, 6vw, 60px)', 
             fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', 
             backgroundColor: '#3498db', 
             color: 'white', 
             border: 'none', 
             borderRadius: '50px', 
             cursor: 'pointer', 
             fontWeight: 'bold',
             boxShadow: '0 10px 25px rgba(52, 152, 219, 0.4)',
             width: 'auto',
             maxWidth: '100%'
             }}
            >
             Analize Başla ➔
            </button>
          </div>

          <div style={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center',
            overflow: 'hidden',
            minWidth: 'min(100%, 300px)'
          }}>
            <img 
              src="/IMG_3029.jpg" 
              alt="İzge Çocuk" 
              style={{ 
                width: '100%', 
                maxWidth: '480px', 
                borderRadius: '25px',
                mixBlendMode: 'multiply',
                clipPath: 'inset(2px)', 
                objectFit: 'cover'
              }} 
            />
          </div>
        </div>
      </section>

      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '25px', 
        padding: '20px clamp(15px, 4vw, 30px)' 
      }}>
        <div style={{ ...featureStyle, backgroundColor: anaRenk }}>
          <div style={{fontSize: '50px', marginBottom: '15px'}}>🎯</div>
          <h3 style={{color: '#2c3e50'}}>Akıllı İmleç Analizi</h3>
          <p style={{color: '#5f6769'}}>Kullanıcının okuma sırasındaki göz ve imleç hareketlerini takip ederek raporlar.</p>
        </div>

        <div style={{ ...featureStyle, backgroundColor: anaRenk }}>
          <div style={{fontSize: '50px', marginBottom: '15px'}}>📖</div>
          <h3 style={{color: '#2c3e50'}}>Adaptif Biyonik Okuma</h3>
          <p style={{color: '#5f6769'}}>Metinleri disleksi dostu formata dönüştürerek okuma hızını artırır.</p>
        </div>

        <div style={{ ...featureStyle, backgroundColor: anaRenk }}>
          <div style={{fontSize: '50px', marginBottom: '15px'}}>📊</div>
          <h3 style={{color: '#2c3e50'}}>Gelişim Takibi</h3>
          <p style={{color: '#5f6769'}}>Okuma performansını haftalık grafiklerle sunarak gelişimi takip eder.</p>
        </div>
      </section>
    </div>
  );
}

const featureStyle = {
  padding: '40px',
  borderRadius: '35px',
  textAlign: 'center',
  border: 'none',
  boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
};