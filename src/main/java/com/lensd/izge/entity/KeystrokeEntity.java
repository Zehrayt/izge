package com.lensd.izge.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "keystroke_records")
public class KeystrokeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId; // ilerisi için kullanıcı tanımı yapalım
    
    @Column(columnDefinition = "LONGTEXT")
    private String dataJson; // Tüm tuş vuruşlarını içeren JSON bloğu

    private LocalDateTime createdAt;

    public KeystrokeEntity() { this.createdAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getDataJson() { return dataJson; }
    public void setDataJson(String dataJson) { this.dataJson = dataJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }

}