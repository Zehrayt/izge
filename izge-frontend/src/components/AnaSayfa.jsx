import React from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/images/IMG_3031.jpeg';
import cocukResmi from '../assets/images/IMG_3029.png';
import arkaPlan from '../assets/images/alt.png';

import analizIkon from '../assets/images/analiz.png';
import biyonikIkon from '../assets/images/biyonik.png';
import imlecIkon from '../assets/images/imleç.png';

export default function AnaSayfa() {
  const navigate = useNavigate();
  
  const izgeTuruncu = '#e67e22'; 
  const izgeMavi = '#3498db';

  return (
    <div style={{ 
      color: '#2c3e50', 
      backgroundImage: `url(${arkaPlan})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundAttachment: 'fixed', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px clamp(20px, 5vw, 80px)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(5px)'
      }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img 
            src={logo} 
            alt="İzge Logo" 
            style={{ height: '50px', objectFit: 'contain' }} 
          />
        </div>

        <nav style={{ display: 'flex', gap: '30px', fontWeight: 'bold' }}>
          <span style={navLinkStyle} onClick={() => navigate('/')}>Ana Sayfa</span>
          <span style={navLinkStyle} onClick={() => navigate('/analiz')}>Analiz</span>
          <span style={navLinkStyle} onClick={() => navigate('/rapor')}>Gelişim Raporu</span>
          <span style={navLinkStyle} onClick={() => navigate('/analiz')}>Context</span>
          <span style={navLinkStyle} onClick={() => navigate('/cizim')}>Hakkımızda</span>
        </nav>
      </header>

      <section style={{ 
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'clamp(40px, 8vw, 100px) 20px', 
        textAlign: 'center'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '50px',
          flexWrap: 'wrap-reverse'
        }}>
          
          <div style={{ flex: 1.2, textAlign: 'center', minWidth: 'min(100%, 400px)' }}>
            <h1 style={{ 
                fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
                fontWeight: '900', 
                lineHeight: '1.1', 
                marginBottom: '25px',
                color: '#2c3e50'
            }}>
              Yolculuğunu <br />
              <span style={{ color: izgeTuruncu }}>İzge</span> ile Güçlendir
            </h1>
            
            <p style={{ 
                fontSize: 'clamp(1.1rem, 2.2vw, 1.3rem)', 
                color: '#4a4a4a', 
                marginBottom: '40px', 
                lineHeight: '1.6', 
                maxWidth: '600px', 
                margin: '0 auto 40px auto',
                fontWeight: '500'
            }}>
              Erken teşhis ve anlık müdahaleyi birleştiren, yapay zeka destekli yeni nesil okuma ve yazma asistanı.
            </p>
            
            <button 
             onClick={() => navigate('/analiz')} 
             style={buttonStyle}
             onMouseOver={(e) => e.target.style.transform = 'translateY(-5px)'}
             onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
             Analize Başla ➔
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <img 
              src={cocukResmi} 
              alt="İzge Çocuk" 
              style={{ 
                width: '100%', 
                maxWidth: '480px', 
                borderRadius: '30px',
                mixBlendMode: 'multiply',
                clipPath: 'inset(2px)', 
                objectFit: 'cover'
              }} 
            />
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER (ŞEFFAF VE GÖRSEL DESTEKLİ) */}
      <section style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'space-around', // İkonları ekrana eşit aralıklarla yayar
        gap: '40px', // Aralarındaki minimum güvenli boşluk
        padding: '40px clamp(20px, 5vw, 80px)',
        width: '100%',
        maxWidth: '1400px', // Daha geniş bir alana yayılmaları için limiti artırdık
        margin: '0 auto'
      }}>
        <div style={featureStyle}>
          <img src={imlecIkon} alt="Akıllı İmleç" style={iconStyle} />
          <h3 style={featureTitleStyle}>Akıllı İmleç Analizi</h3>
          <p style={featureTextStyle}>Kullanıcının okuma sırasındaki göz ve imleç hareketlerini takip ederek raporlar.</p>
        </div>

        <div style={featureStyle}>
          <img src={biyonikIkon} alt="Biyonik Okuma" style={iconStyle} />
          <h3 style={featureTitleStyle}>Adaptif Biyonik Okuma</h3>
          <p style={featureTextStyle}>Metinleri disleksi dostu formata dönüştürerek okuma hızını artırır.</p>
        </div>

        <div style={featureStyle}>
          <img src={analizIkon} alt="Gelişim Takibi" style={iconStyle} />
          <h3 style={featureTitleStyle}>Gelişim Takibi</h3>
          <p style={featureTextStyle}>Okuma performansını haftalık grafiklerle sunarak gelişimi takip eder.</p>
        </div>
      </section>
    </div>
  );
}

const navLinkStyle = {
  cursor: 'pointer',
  fontSize: '1.1rem',
  transition: 'color 0.3s ease',
  color: '#2c3e50'
};

const buttonStyle = {
  padding: '18px 60px', 
  fontSize: '1.4rem', 
  backgroundColor: '#3498db', 
  color: 'white', 
  border: 'none', 
  borderRadius: '60px', 
  cursor: 'pointer', 
  fontWeight: 'bold',
  boxShadow: '0 10px 25px rgba(52, 152, 219, 0.3)',
  transition: 'all 0.3s ease'
};

const iconStyle = {
  height: '150px',
  width: '150px',
  objectFit: 'contain',
  marginBottom: '1px'
};

const featureStyle = {
  padding: '10px', 
  textAlign: 'center',
  backgroundColor: 'transparent',
  border: 'none',
  boxShadow: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: '1 1 300px', // Dar ekranda (telefonda) otomatik olarak alt alta geçmesini sağlar
  maxWidth: '350px'  // Yazıların çok fazla yayılmasını engeller
};

const featureTitleStyle = {
  color: '#2c3e50',
  fontSize: '1.6rem',
  marginBottom: '15px',
  fontWeight: '800'
};

const featureTextStyle = {
  color: '#4a4a4a',
  fontSize: '1.1rem',
  lineHeight: '1.5',
  fontWeight: '500',
  maxWidth: '260px',
  margin: '0 auto'
};