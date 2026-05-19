package com.lensd.izge.dto;

public class AnalizResponseDTO {
    private int klavyeHataOrtalamasi;
    private int backspaceOrtalamasi;
    private int titremeOrtalamasi;
    private int duraksamaOrtalamasi;
    private int riskSkoru;
    private String riskSeviyesi;

    private java.util.List<AITahminDTO> yapayZekaTahminleri;

    public int getKlavyeHataOrtalamasi() { return klavyeHataOrtalamasi; }
    public void setKlavyeHataOrtalamasi(int klavyeHataOrtalamasi) { this.klavyeHataOrtalamasi = klavyeHataOrtalamasi; }
    
    public int getBackspaceOrtalamasi() { return backspaceOrtalamasi; }
    public void setBackspaceOrtalamasi(int backspaceOrtalamasi) { this.backspaceOrtalamasi = backspaceOrtalamasi; }
    
    public int getTitremeOrtalamasi() { return titremeOrtalamasi; }
    public void setTitremeOrtalamasi(int titremeOrtalamasi) { this.titremeOrtalamasi = titremeOrtalamasi; }
    
    public int getDuraksamaOrtalamasi() { return duraksamaOrtalamasi; }
    public void setDuraksamaOrtalamasi(int duraksamaOrtalamasi) { this.duraksamaOrtalamasi = duraksamaOrtalamasi; }
   
    public int getRiskSkoru() { return riskSkoru; }
    public void setRiskSkoru(int riskSkoru) { this.riskSkoru = riskSkoru; }
    
    public String getRiskSeviyesi() { return riskSeviyesi; }
    public void setRiskSeviyesi(String riskSeviyesi) { this.riskSeviyesi = riskSeviyesi; }

    public java.util.List<AITahminDTO> getYapayZekaTahminleri() { return yapayZekaTahminleri; }
    public void setYapayZekaTahminleri(java.util.List<AITahminDTO> yapayZekaTahminleri) { this.yapayZekaTahminleri = yapayZekaTahminleri; }
}