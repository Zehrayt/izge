package com.lensd.izge.controller;

import com.lensd.izge.dto.AnalizRequestDTO;
import com.lensd.izge.dto.AnalizResponseDTO;
import com.lensd.izge.service.AnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analiz")
@CrossOrigin(origins = "*") // React'ten (localhost:5173 vb.) gelen isteklere izin verir (CORS hatasını önler)
public class AnalysisController {

    @Autowired
    private AnalysisService analysisService;

    @PostMapping("/kaydet")
    public ResponseEntity<AnalizResponseDTO> kaydetVeAnalizEt(
            @RequestParam(required = false, defaultValue = "anonim_kullanici") String userId,
            @RequestBody AnalizRequestDTO request) {
        
        try {
            // Verileri kaydet ve matematiksel analizi yap
            AnalizResponseDTO response = analysisService.evaluateAnalysis(userId, request);
            
            // Sonucu HTTP 200 (OK) statüsü ile React'e gönder
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Analiz sırasında hata: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}