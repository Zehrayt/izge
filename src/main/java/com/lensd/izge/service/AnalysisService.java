package com.lensd.izge.service;

import com.lensd.izge.entity.CanvasEntity;
import com.lensd.izge.entity.KeystrokeEntity;
import com.lensd.izge.repository.CanvasRepository;
import com.lensd.izge.repository.KeystrokeRepository;
import org.springframework.stereotype.Service;

@Service
public class AnalysisService {

    private final KeystrokeRepository keystrokeRepository;
    private final CanvasRepository canvasRepository;

    public AnalysisService(KeystrokeRepository keystrokeRepository, 
                           CanvasRepository canvasRepository) {
        this.keystrokeRepository = keystrokeRepository;
        this.canvasRepository = canvasRepository;
    }

    public void saveKeystrokeData(String userId, String rawJsonData) {
        KeystrokeEntity entity = new KeystrokeEntity();
        entity.setUserId(userId);
        entity.setDataJson(rawJsonData);
        keystrokeRepository.save(entity);
    }

    public void saveCanvasData(String targetLetter, String coordinatesJson) {
        CanvasEntity entity = new CanvasEntity();
        entity.setTargetLetter(targetLetter);
        entity.setCoordinatesJson(coordinatesJson);
        canvasRepository.save(entity);
    }
}