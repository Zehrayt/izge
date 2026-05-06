import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AnaSayfa from './components/AnaSayfa';
import Analiz from './components/Analiz';
import OkumaAsistani from './components/OkumaAsistani';
import Rapor from './components/Rapor'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnaSayfa />} />
        <Route path="/analiz" element={<Analiz />} />
        <Route path="/okuma" element={<OkumaAsistani />} />
        <Route path="/rapor" element={<Rapor />} />
      </Routes>
    </Router>
  );
}

export default App;