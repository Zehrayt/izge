package com.lensd.izge.controller;

import com.lensd.izge.dto.CanvasDTO;
import com.lensd.izge.dto.KeystrokeDTO;
import com.lensd.izge.service.AnalysisService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper; // JSON dönüştürme için

@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "*") 
public class AnalysisController {

    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping("/keystroke")
    public String receiveKeystroke(@RequestBody List<KeystrokeDTO> keystrokeData) {
        try {
            // Gelen DTO listesini veritabanına yazmak için tek bir JSON String'e çevirme
            ObjectMapper mapper = new ObjectMapper();
            String jsonString = mapper.writeValueAsString(keystrokeData);
            
            // Servis üzerinden veritabanına kaydetme (!!!!!Şimdilik userId 'test_user')
            analysisService.saveKeystrokeData("test_user", jsonString);
            
            System.out.println("Veritabanına başarıyla kaydedildi! Veri boyutu: " + keystrokeData.size());
            return "Veri başarıyla alındı ve veritabanına kaydedildi!";
            
        } catch (Exception e) {
            e.printStackTrace();
            return "Veri kaydedilirken hata oluştu!";
        }
    }

    @PostMapping("/canvas")
    public String receiveCanvasData(@RequestBody CanvasDTO canvasData) {
        try {
            // Servis üzerinden veritabanına kaydetme
            analysisService.saveCanvasData(canvasData.getTargetLetter(), canvasData.getCoordinatesJson());
            
            System.out.println("Çizim verisi (Canvas) veritabanına başarıyla kaydedildi! Hedef Harf: " + canvasData.getTargetLetter());
            return "Çizim verisi başarıyla alındı ve kaydedildi!";
            
        } catch (Exception e) {
            e.printStackTrace();
            return "Çizim verisi kaydedilirken hata oluştu!";
        }
    }
}