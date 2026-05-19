package com.lensd.izge.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lensd.izge.dto.AITahminDTO;
import com.lensd.izge.dto.CizimAnalizDTO;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

@Service
public class PythonAIService {

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String FLASK_URL = "http://localhost:5001/tahmin";

    public AITahminDTO harfTahminEt(CizimAnalizDTO cizim) {
        try {
            // Flask'a gönderilecek payload
            Map<String, Object> payload = new HashMap<>();
            payload.put("koordinatlar", cizim.getKoordinatlar());
            payload.put("hedefKarakter", cizim.getHedefKarakter());

            String json = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(FLASK_URL))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request, HttpResponse.BodyHandlers.ofString()
            );

            return objectMapper.readValue(response.body(), AITahminDTO.class);

        } catch (Exception e) {
            System.err.println("Flask'a bağlanılamadı: " + e.getMessage());
            // Flask çalışmıyorsa null dön, AnalysisService halleder
            return null;
        }
    }
}