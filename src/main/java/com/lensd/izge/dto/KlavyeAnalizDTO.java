package com.lensd.izge.dto;

import java.util.List;

public class KlavyeAnalizDTO {
    private String tip; // "yaz", "dinle"
    private String referansMetin;
    private String yazilanMetin;
    private List<Long> tusAraliklari;
    private int silmeSayisi;

    public String getTip() { return tip; }
    public void setTip(String tip) { this.tip = tip; }

    public String getReferansMetin() { return referansMetin; }
    public void setReferansMetin(String referansMetin) { this.referansMetin = referansMetin; }

    public String getYazilanMetin() { return yazilanMetin; }
    public void setYazilanMetin(String yazilanMetin) { this.yazilanMetin = yazilanMetin; }

    public List<Long> getTusAraliklari() { return tusAraliklari; }
    public void setTusAraliklari(List<Long> tusAraliklari) { this.tusAraliklari = tusAraliklari; }
    
    public int getSilmeSayisi() { return silmeSayisi; }
    public void setSilmeSayisi(int silmeSayisi) { this.silmeSayisi = silmeSayisi; }
}