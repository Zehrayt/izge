package com.lensd.izge.service;

import com.lensd.izge.entity.KeystrokeEntity;
import com.lensd.izge.repository.KeystrokeRepository;
import org.springframework.stereotype.Service;

@Service
public class AnalysisService {

    private final KeystrokeRepository keystrokeRepository;

    public AnalysisService(KeystrokeRepository keystrokeRepository) {
        this.keystrokeRepository = keystrokeRepository;
    }

    public void saveKeystrokeData(String userId, String rawJsonData) {
        KeystrokeEntity entity = new KeystrokeEntity();
        entity.setUserId(userId);
        entity.setDataJson(rawJsonData);
        keystrokeRepository.save(entity);
    }
}