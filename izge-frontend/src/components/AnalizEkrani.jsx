import React, { useState } from 'react';

export default function AnalizEkrani() {
    // Örnek çizim verisi (ileride gerçek Canvas verisiyle dolacak)
    const [mockCoordinates] = useState([[10, 20, 100], [15, 25, 200]]);

    const sendCanvasDataToBackend = async (targetLetter, coordinates) => {
        try {
            const response = await fetch('http://localhost:8080/api/analysis/canvas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetLetter: targetLetter,
                    coordinatesJson: JSON.stringify(coordinates) // CanvasDTO formatına uygun
                })
            });
            if (response.ok) {
                alert("Veri başarıyla kaydedildi!");
            }
        } catch (error) {
            console.error("Hata:", error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3>Çizim Analiz Testi</h3>
            <button onClick={() => sendCanvasDataToBackend('b', mockCoordinates)}>
                Backend'e Gönder
            </button>
        </div>
    );
}