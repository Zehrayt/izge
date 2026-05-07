package com.lensd.izge.service;

import com.lensd.izge.dto.*;
import com.lensd.izge.entity.CanvasEntity;
import com.lensd.izge.entity.KeystrokeEntity;
import com.lensd.izge.repository.CanvasRepository;
import com.lensd.izge.repository.KeystrokeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalysisService {

    @Autowired
    private KeystrokeRepository keystrokeRepository;

    @Autowired
    private CanvasRepository canvasRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Tüm analiz verilerini değerlendirir, veritabanına kaydeder ve nihai sonucu döner.
     */
    public AnalizResponseDTO evaluateAnalysis(String userId, AnalizRequestDTO request) {
        AnalizResponseDTO response = new AnalizResponseDTO();

        // 1. HAM VERİLERİ VERİTABANINA KAYDET!!! (İleride model eğitimi ve gelişim raporu için)
        saveRawDataToDatabase(userId, request);

        // 2. KULAK VE DİL MODÜLÜ (Klavye Metrikleri)
        // NOT: Zemberek ve HeceTokenizer entegrasyonu ileride bu metodların içine eklenecek.
        int klavyeHataOrt = calculateAverageKeyboardError(request.getKlavyeAnalizleri());
        int backspaceOrt = calculateAverageBackspace(request.getKlavyeAnalizleri());

        // 3. GÖZ MODÜLÜ (Çizim Metrikleri)
        // NOT: T-H-E Dataset ve Python CV modelinden dönen sonuçlar ileride buraya entegre edilecek.
        int titremeOrt = calculateAverageJitter(request.getCizimAnalizleri());
        int duraksamaOrt = calculateAveragePauses(request.getCizimAnalizleri());

        // 4. BEYİN MODÜLÜ (Risk Skoru ve Karar Mekanizması)
        // NOT: Akademik makalelerden elde edilen ağırlıklar ileride bu metoda eklenecek.
        int riskSkoru = calculateRiskScore(klavyeHataOrt, backspaceOrt, titremeOrt, duraksamaOrt);
        String riskSeviyesi = determineRiskLevel(riskSkoru);

        // 5. SONUÇLARI DTO'YA YERLEŞTİR VE FRONTEND'E GÖNDER
        response.setKlavyeHataOrtalamasi(klavyeHataOrt);
        response.setBackspaceOrtalamasi(backspaceOrt);
        response.setTitremeOrtalamasi(titremeOrt);
        response.setDuraksamaOrtalamasi(duraksamaOrt);
        response.setRiskSkoru(riskSkoru);
        response.setRiskSeviyesi(riskSeviyesi);

        return response;
    }

    // --- VERİTABANI KAYIT İŞLEMİ ---
    private void saveRawDataToDatabase(String userId, AnalizRequestDTO request) {
        try {
            // Klavye verilerini tek tek Entity'e çevirip kaydet
            if (request.getKlavyeAnalizleri() != null) {
                for (KlavyeAnalizDTO klavye : request.getKlavyeAnalizleri()) {
                    KeystrokeEntity kEntity = new KeystrokeEntity();
                    kEntity.setUserId(userId != null ? userId : "anonim_kullanici");
                    kEntity.setDataJson(objectMapper.writeValueAsString(klavye));
                    keystrokeRepository.save(kEntity);
                }
            }
            
            // Çizim verilerini tek tek Entity'e çevirip kaydet
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


    // MATEMATİKSEL ALGORİTMALAR

    private int calculateAverageKeyboardError(List<KlavyeAnalizDTO> analizler) {
        if (analizler == null || analizler.isEmpty()) return 0;
        double totalError = 0;
        for (KlavyeAnalizDTO a : analizler) {
            totalError += calculateHataYuzdesi(a.getReferansMetin(), a.getYazilanMetin());
        }
        return (int) Math.round(totalError / analizler.size());
    }

    private int calculateHataYuzdesi(String s1, String s2) {
        if (s1 == null || s1.isEmpty()) return 0;
        int distance = levenshteinDistance(s1.toLowerCase(), s2.toLowerCase());
        return Math.min(100, (int) Math.round(((double) distance / s1.length()) * 100));
    }

    private int levenshteinDistance(String a, String b) {
        if (a == null) a = "";
        if (b == null) b = "";
        int m = a.length();
        int n = b.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));
                }
            }
        }
        return dp[m][n];
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

    private int calculateRiskScore(int klvHata, int bspace, int titreme, int duraksama) {
        double score = 0;
        score += Math.min(40, klvHata * 0.8);
        score += Math.min(20, bspace * 2);
        score += Math.min(25, titreme * 1.5);
        score += Math.min(15, duraksama * 2);
        return (int) Math.round(score);
    }

    private String determineRiskLevel(int score) {
        if (score < 30) return "Düşük Risk";
        if (score < 60) return "Orta Risk";
        return "Yüksek Risk";
    }
}