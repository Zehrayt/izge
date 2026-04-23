package com.lensd.izge.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "canvas_records")
public class CanvasEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "LONGTEXT")
    private String coordinatesJson; // format: [[x1,y1,t1], [x2,y2,t2]...] 

    private String targetLetter; // çizilmesi istenen harf (b, d vb.)
    private LocalDateTime createdAt;

    public CanvasEntity() { this.createdAt = LocalDateTime.now(); }


    public Long getId() { return id; }

    public String getCoordinatesJson() { return coordinatesJson; }
    public void setCoordinatesJson(String coordinatesJson) { this.coordinatesJson = coordinatesJson; }
    
    public String getTargetLetter() { return targetLetter; }
    public void setTargetLetter(String targetLetter) { this.targetLetter = targetLetter; }
}