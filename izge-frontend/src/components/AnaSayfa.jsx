import React from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/images/Resim1.png';
import cocukResmi from '../assets/images/IMG_3029.png';
import arkaPlan from '../assets/images/alt.png';

import analizIkon from '../assets/images/analiz.png';
import biyonikIkon from '../assets/images/biyonik.png';
import imlecIkon from '../assets/images/imleç.png';

export default function AnaSayfa() {
  const navigate = useNavigate();
  
  const izgeTuruncu = '#e67e22'; 
  const izgeMavi = '#3498db';
  const acikMor = '#A8B8DD';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ 
        color: '#2c3e50', 
        backgroundImage: `url(${arkaPlan})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundAttachment: 'fixed', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '120px'
      }}>
        
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
            <span style={navLinkStyle} onClick={() => navigate('/analiz')}>Analiz</span>
            <span style={navLinkStyle} onClick={() => navigate('/rapor')}>Gelişim Raporu</span>
            <span style={navLinkStyle} onClick={() => navigate('/analiz')}>Context</span>
            <span style={navLinkStyle} onClick={() => document.getElementById('hakkimizda').scrollIntoView({ behavior: 'smooth' })}>Hakkımızda</span>
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
          maxWidth: '1400px', 
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

      <div style={{ 
        backgroundColor: acikMor, 
        paddingBottom: '80px',
        borderTopLeftRadius: '80px', 
        borderTopRightRadius: '80px', 
        marginTop: '-90px', 
        position: 'relative', 
        zIndex: 10,
        boxShadow: '0 -15px 40px rgba(0,0,0,0.08)' 
      }}>
        
        {/* HIZLI GEÇİŞ BÖLÜMÜ */}
        <div style={{ padding: '80px 20px', color: '#2c3e50', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: '800' }}>Hemen Okumaya Odaklan</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 30px', fontSize: '1.2rem', fontWeight: '500' }}>
            Analizle vakit kaybetmeden metinlerini disleksi dostu formata dönüştür.
          </p>
          <button 
            onClick={() => navigate('/okuma')}
            style={{ ...primaryButtonStyle, backgroundColor: 'white', color: '#6A74C9', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Biyonik Okumayı Aç
          </button>
        </div>

        {/* HAKKIMIZDA BÖLÜMÜ */}
        <div id="hakkimizda" style={{ 
          padding: '40px 20px', 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '50px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Yazı Alanı */}
          <div style={{ flex: '1', minWidth: '300px', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '20px', fontWeight: '800' }}>İzge Nedir?</h2>
            <p style={{ lineHeight: '1.7', fontSize: '1.15rem', color: '#2c3e50', fontWeight: '500' }}>
              İzge, dijital dünyada okuma ve yazma engellerini kaldırmak için geliştirildi. 
              Yapay zeka desteğiyle kullanıcı odaklı çözümler sunarak öğrenme sürecini 
              kişiselleştiriyor ve hızlandırıyoruz.
            </p>
          </div>

          {/* Resim Alanı (Placeholder) */}
          <div style={{ 
            flex: '1', 
            minWidth: '300px',
            maxWidth: '500px', 
            height: '350px', 
            backgroundColor: 'rgba(255,255,255,0.4)', 
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed rgba(255,255,255,0.8)'
          }}>
            {/* görseller hazır olduğunda kullanacağımız kod: */}
            {/* <img src="/senin-resmin.jpg" alt="Ekip" style={{ width: '100%', height: '100%', borderRadius: '30px', objectFit: 'cover' }} /> */}
            <span style={{ color: '#2c3e50', fontWeight: 'bold', fontSize: '1.1rem' }}>[ Buraya Görsel Gelecek ]</span>
          </div>
        </div>

        {/* EKİBİMİZ BÖLÜMÜ */}
        <div style={{ marginTop: '80px', padding: '0 20px' }}>
          
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: '30px', 
            maxWidth: '1200px', 
            margin: '0 auto' 
          }}>
            <div style={teamCardStyle}>
              {/* Güncellenen dış kapsayıcı stil ismi */}
              <div style={avatarOuterShapeStyle}>
                <div style={avatarStyle}>FZA</div>
              </div>
              <h3 style={memberNameStyle}>Fatma Zehra Aytaş</h3>
              <p style={memberRoleStyle}>Yazılım Geliştirici</p>
            </div>

            <div style={teamCardStyle}>
              <div style={avatarOuterShapeStyle}>
                <div style={avatarStyle}>BG</div>
              </div>
              <h3 style={memberNameStyle}>Berfin Gülce</h3>
              <p style={memberRoleStyle}>Yazılım Geliştirici</p>
            </div>

            <div style={teamCardStyle}>
              <div style={avatarOuterShapeStyle}>
                <div style={avatarStyle}>EY</div>
              </div>
              <h3 style={memberNameStyle}>Elifnur Yılmaz</h3>
              <p style={memberRoleStyle}>Yazılım Geliştirici</p>
            </div>

            <div style={teamCardStyle}>
              <div style={avatarOuterShapeStyle}>
                <div style={avatarStyle}>MET</div>
              </div>
              <h3 style={memberNameStyle}>Melda Ebrar Topuz</h3>
              <p style={memberRoleStyle}>Yazılım Geliştirici</p>
            </div>
          </div>
        </div>

      </div>

    </div>

    
  );
}

const navLinkStyle = {
  cursor: 'pointer',
  fontSize: '1.1rem',
  transition: 'color 0.3s ease',
  color: '#2c3e50'
};

const primaryButtonStyle = {
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

// 1. KARTIN KENDİSİ (SIFIR BEYAZLIK, SIFIR GÖLGE, SIFIR KUTU İZİ)
const teamCardStyle = {
  backgroundColor: 'transparent', 
  padding: '10px',
  textAlign: 'center',
  flex: '1 1 220px',
  maxWidth: '260px',
  border: 'none',
  boxShadow: 'none'
};

// 2. DIŞTAKİ ALT.PNG DESENİ (KAREMSİ / ELİPS ŞEKİL)
const avatarOuterShapeStyle = {
  width: '150px',
  height: '150px',
  borderRadius: '40px', // Tam yuvarlak değil, yumuşatılmış kare/elips
  backgroundColor: 'transparent', // Kesinlikle renk yok, sadece resim
  backgroundImage: `url(${arkaPlan})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  margin: '0 auto 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: '0.6' // alt.png hafif saydam
};

// 3. İÇTEKİ MOR DAİRE (YAZININ OLDUĞU YER)
const avatarStyle = {
  width: '80px',
  height: '80px',
  backgroundColor: '#7E84F7', // Net mor renk
  color: 'white',
  borderRadius: '50%', // Bu tam yuvarlak kalıyor
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  margin: '0',
  boxShadow: '0 5px 15px rgba(0,0,0,0.15)' // Mor daire biraz öne çıksın
};

const memberNameStyle = {
  fontSize: '1.2rem',
  color: '#2c3e50',
  fontWeight: '700',
  marginBottom: '8px'
};

const memberRoleStyle = {
  fontSize: '0.9rem',
  color: '#5f6769',
  fontWeight: '500'
};