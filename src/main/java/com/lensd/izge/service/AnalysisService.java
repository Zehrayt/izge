package com.lensd.izge.service;

import com.lensd.izge.dto.*;
import com.lensd.izge.entity.CanvasEntity;
import com.lensd.izge.entity.KeystrokeEntity;
import com.lensd.izge.entity.TestOturumEntity;
import com.lensd.izge.repository.CanvasRepository;
import com.lensd.izge.repository.KeystrokeRepository;
import com.lensd.izge.repository.TestOturumRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList; // Bu import eklendi

@Service
public class AnalysisService {

    @Autowired
    private KeystrokeRepository keystrokeRepository;

    @Autowired
    private CanvasRepository canvasRepository;

    @Autowired
    private TestOturumRepository testOturumRepository;

    @Autowired
    private PythonAIService pythonAIService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    
    //Tüm analiz verilerini değerlendirir, veritabanına kaydeder ve nihai sonucu döner.
    public AnalizResponseDTO evaluateAnalysis(String userId, AnalizRequestDTO request) {
        AnalizResponseDTO response = new AnalizResponseDTO();

        // 1. HAM VERİLERİ VERİTABANINA KAYDET
        saveRawDataToDatabase(userId, request);

        // 2. KULAK VE DİL MODÜLÜ (Klavye Metrikleri)
        int klavyeHataOrt = calculateAverageKeyboardError(request.getKlavyeAnalizleri());
        int backspaceOrt = calculateAverageBackspace(request.getKlavyeAnalizleri());

        // 3. GÖZ MODÜLÜ (Çizim Metrikleri)
        int titremeOrt = calculateAverageJitter(request.getCizimAnalizleri());
        int duraksamaOrt = calculateAveragePauses(request.getCizimAnalizleri());

        int cizimKaristirmaSayisi = 0;
        List<AITahminDTO> aiTahminListesi = new ArrayList<>();

        if (request.getCizimAnalizleri() != null) {
            for (CizimAnalizDTO cizim : request.getCizimAnalizleri()) {
                AITahminDTO aiSonuc = pythonAIService.harfTahminEt(cizim);
                if (aiSonuc != null) {
                    aiTahminListesi.add(aiSonuc);
                    if (aiSonuc.isKaristi()) {
                        cizimKaristirmaSayisi++;
                    }
                }
            }
        }

        // 4. BEYİN MODÜLÜ (Risk Skoru)
        int riskSkoru = calculateRiskScore(klavyeHataOrt, backspaceOrt, titremeOrt, duraksamaOrt, cizimKaristirmaSayisi);
        String riskSeviyesi = determineRiskLevel(riskSkoru);

        // TEST SONUCUNU MYSQL'E KAYDET
        TestOturumEntity oturum = new TestOturumEntity();
        oturum.setUserId(userId != null ? userId : "anonim_kullanici");
        oturum.setKlavyeHataOrtalamasi(klavyeHataOrt);
        oturum.setBackspaceOrtalamasi(backspaceOrt);
        oturum.setTitremeOrtalamasi(titremeOrt);
        oturum.setDuraksamaOrtalamasi(duraksamaOrt);
        oturum.setRiskSkoru(riskSkoru);
        oturum.setRiskSeviyesi(riskSeviyesi);
        oturum.setOlusturulmaTarihi(LocalDateTime.now());
        
        TestOturumEntity savedOturum = testOturumRepository.save(oturum);

        // 5. SONUÇLARI DTO'YA YERLEŞTİR
        response.setId(savedOturum.getId());
        response.setKlavyeHataOrtalamasi(klavyeHataOrt);
        response.setBackspaceOrtalamasi(backspaceOrt);
        response.setTitremeOrtalamasi(titremeOrt);
        response.setDuraksamaOrtalamasi(duraksamaOrt);
        response.setRiskSkoru(riskSkoru);
        response.setRiskSeviyesi(riskSeviyesi);
        response.setYapayZekaTahminleri(aiTahminListesi);

        // Tarih ve saat formatla
        DateTimeFormatter tarihFormat = DateTimeFormatter.ofPattern("dd MMMM yyyy", new Locale("tr"));
        DateTimeFormatter saatFormat = DateTimeFormatter.ofPattern("HH:mm");
        response.setTarih(savedOturum.getOlusturulmaTarihi().format(tarihFormat));
        response.setSaat(savedOturum.getOlusturulmaTarihi().format(saatFormat));

        return response;
    }

    // VERİTABANI KAYIT İŞLEMİ
    private void saveRawDataToDatabase(String userId, AnalizRequestDTO request) {
        try {
            if (request.getKlavyeAnalizleri() != null) {
                for (KlavyeAnalizDTO klavye : request.getKlavyeAnalizleri()) {
                    KeystrokeEntity kEntity = new KeystrokeEntity();
                    kEntity.setUserId(userId != null ? userId : "anonim_kullanici");
                    kEntity.setDataJson(objectMapper.writeValueAsString(klavye));
                    keystrokeRepository.save(kEntity);
                }
            }
            
            if (request.getCizimAnalizleri() != null) {
                for (CizimAnalizDTO cizim : request.getCizimAnalizleri()) {
                    CanvasEntity cEntity = new CanvasEntity();
                    cEntity.setTargetLetter(cizim.getHedefKarakter());
                    cEntity.setCoordinatesJson(objectMapper.writeValueAsString(cizim.getKoordinatlar()));
                    canvasRepository.save(cEntity);
                }
            }
        } catch (Exception e) {
            System.err.println("Veritabanına kayıt sırasında hata oluştu: " + e.getMessage());
        }
    }

    // GEÇMİŞİ GETİR
    public List<AnalizResponseDTO> kullaniciGecmisiniGetir() {
        List<TestOturumEntity> gecmisListesi = testOturumRepository.findAllByOrderByOlusturulmaTarihiDesc();
        List<AnalizResponseDTO> dtoList = new ArrayList<>();

        DateTimeFormatter tarihFormat = DateTimeFormatter.ofPattern("dd MMMM yyyy", new Locale("tr"));
        DateTimeFormatter saatFormat = DateTimeFormatter.ofPattern("HH:mm");

        for (TestOturumEntity oturum : gecmisListesi) {
            AnalizResponseDTO dto = new AnalizResponseDTO();
            dto.setId(oturum.getId());
            dto.setKlavyeHataOrtalamasi(oturum.getKlavyeHataOrtalamasi());
            dto.setBackspaceOrtalamasi(oturum.getBackspaceOrtalamasi());
            dto.setTitremeOrtalamasi(oturum.getTitremeOrtalamasi());
            dto.setDuraksamaOrtalamasi(oturum.getDuraksamaOrtalamasi());
            dto.setRiskSkoru(oturum.getRiskSkoru());
            dto.setRiskSeviyesi(oturum.getRiskSeviyesi());

            dto.setTarih(oturum.getOlusturulmaTarihi().format(tarihFormat));
            dto.setSaat(oturum.getOlusturulmaTarihi().format(saatFormat));

            dtoList.add(dto);
        }
        return dtoList;
    }

    // MATEMATİKSEL ALGORİTMALAR

    private int calculateAverageKeyboardError(List<KlavyeAnalizDTO> analizler) {
        if (analizler == null || analizler.isEmpty()) return 0;
        double totalError = 0;
        for (KlavyeAnalizDTO a : analizler) {
            totalError += a.getDisleksiSkoru(); 
        }
        return (int) Math.round(totalError / analizler.size());
    }

    private int calculateAverageBackspace(List<KlavyeAnalizDTO> analizler) {
        if (analizler == null || analizler.isEmpty()) return 0;
        return (int) Math.round(analizler.stream().mapToInt(KlavyeAnalizDTO::getSilmeSayisi).average().orElse(0));
    }

    private int calculateAverageJitter(List<CizimAnalizDTO> analizler) {
        if (analizler == null || analizler.isEmpty()) return 0;
        double totalJitter = 0;
        for (CizimAnalizDTO a : analizler) {
            totalJitter += countJitterInCoordinates(a.getKoordinatlar());
        }
        return (int) Math.round(totalJitter / analizler.size());
    }

    private int countJitterInCoordinates(List<KoordinatDTO> koords) {
        if (koords == null || koords.size() < 3) return 0;
        int jitterCount = 0;
        for (int i = 1; i < koords.size() - 1; i++) {
            double dx1 = koords.get(i).getX() - koords.get(i - 1).getX();
            double dy1 = koords.get(i).getY() - koords.get(i - 1).getY();
            double dx2 = koords.get(i + 1).getX() - koords.get(i).getX();
            double dy2 = koords.get(i + 1).getY() - koords.get(i).getY();
            
            double angle = Math.abs(Math.atan2(dy2, dx2) - Math.atan2(dy1, dx1));
            if (angle > Math.PI / 4) jitterCount++;
        }
        return jitterCount;
    }

    private int calculateAveragePauses(List<CizimAnalizDTO> analizler) {
        if (analizler == null || analizler.isEmpty()) return 0;
        double totalPauses = 0;
        for (CizimAnalizDTO a : analizler) {
            totalPauses += countPauses(a.getKoordinatlar());
        }
        return (int) Math.round(totalPauses / analizler.size());
    }

    private int countPauses(List<KoordinatDTO> koords) {
        if (koords == null || koords.size() < 2) return 0;
        int pauseCount = 0;
        for (int i = 0; i < koords.size() - 1; i++) {
            long dt = koords.get(i + 1).getTime() - koords.get(i).getTime();
            if (dt > 300) pauseCount++; 
        }
        return pauseCount;
    }

    private int calculateRiskScore(int klvHata, int bspace, 
                                int titreme, int duraksama,
                                int cizimKaristirma) {
        double score = 0;
        
        // Toplam riskin %35'ini Yazım Analizi, %65'ini Çizim + Motor Beceri oluştursun:
        score += Math.min(35, klvHata * 0.35);       // Yazım Analizi (Max 35 Puan)
        score += Math.min(10, bspace * 2);           // Silme Sayısı (Max 10 Puan)
        score += Math.min(15, titreme * 1.5);        // Titreme (Max 15 Puan)
        score += Math.min(10, duraksama * 2);        // Duraksama (Max 10 Puan)
        score += Math.min(30, cizimKaristirma * 5);  // Çizim Hataları (Max 30 Puan)
        
        // Matematiksel güvenlik (Eğer 100'ü geçerse 100'e sabitle)
        return Math.min(100, (int) Math.round(score)); 
    }

    private String determineRiskLevel(int score) {
        if (score < 30) return "Düşük Risk";
        if (score < 60) return "Orta Risk";
        return "Yüksek Risk";
    }
}