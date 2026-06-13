package com.lensd.izge.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "test_oturum_gecmisi")
public class TestOturumEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private int klavyeHataOrtalamasi;
    private int backspaceOrtalamasi;
    private int titremeOrtalamasi;
    private int duraksamaOrtalamasi;
    private int riskSkoru;
    private String riskSeviyesi;

    private LocalDateTime olusturulmaTarihi = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

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
    
    public LocalDateTime getOlusturulmaTarihi() { return olusturulmaTarihi; }
    public void setOlusturulmaTarihi(LocalDateTime olusturulmaTarihi) { this.olusturulmaTarihi = olusturulmaTarihi; }
}