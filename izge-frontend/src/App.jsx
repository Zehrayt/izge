import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 3 Sayfamızı da (Bileşenleri) projeye dahil ediyoruz
import AnaSayfa from './components/AnaSayfa';
import Analiz from './components/Analiz';
import OkumaAsistani from './components/OkumaAsistani';

function App() {
  return (
    <Router>
      <Routes>
        {/* ilk Ana Sayfa açılsın */}
        <Route path="/" element={<AnaSayfa />} />
        
        {/* Ana sayfadaki "Analize Başla" butonuna basıldığında Analiz sayfası açılsın */}
        <Route path="/analiz" element={<Analiz />} />
        
        {/* Kullanıcı Okuma Asistanı modülüne gitmek isterse */}
        <Route path="/okuma" element={<OkumaAsistani />} />
      </Routes>
    </Router>
  );
}

export default App;