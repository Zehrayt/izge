package com.lensd.izge.dto;

import java.util.Map;

public class AITahminDTO {
    private String tahmin;
    private String hedef;
    private double guven;
    private boolean karisti;
    private Map<String, Double> olasiliklar;

    public String getTahmin() { return tahmin; }
    public void setTahmin(String tahmin) { this.tahmin = tahmin; }

    public String getHedef() { return hedef; }
    public void setHedef(String hedef) { this.hedef = hedef; }

    public double getGuven() { return guven; }
    public void setGuven(double guven) { this.guven = guven; }

    public boolean isKaristi() { return karisti; }
    public void setKaristi(boolean karisti) { this.karisti = karisti; }

    public Map<String, Double> getOlasiliklar() { return olasiliklar; }
    public void setOlasiliklar(Map<String, Double> olasiliklar) { this.olasiliklar = olasiliklar; }
}