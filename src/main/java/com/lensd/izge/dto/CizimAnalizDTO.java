package com.lensd.izge.dto;

import java.util.List;

public class CizimAnalizDTO {
    private String tip; // "harf", "kelimeBas", "kelime"
    private String hedefKarakter;
    private List<KoordinatDTO> koordinatlar;

    public String getTip() { return tip; }
    public void setTip(String tip) { this.tip = tip; }

    public String getHedefKarakter() { return hedefKarakter; }
    public void setHedefKarakter(String hedefKarakter) { this.hedefKarakter = hedefKarakter; }
    
    public List<KoordinatDTO> getKoordinatlar() { return koordinatlar; }
    public void setKoordinatlar(List<KoordinatDTO> koordinatlar) { this.koordinatlar = koordinatlar; }
}