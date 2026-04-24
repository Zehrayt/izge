package com.lensd.izge.dto;

public class CanvasDTO {
    private String targetLetter;
    private String coordinatesJson; // Frontend'den gelecek olan [[x,y,t], [x,y,t]] formatındaki veri

    public CanvasDTO() {}

    public String getTargetLetter() { return targetLetter; }
    public void setTargetLetter(String targetLetter) { this.targetLetter = targetLetter; }

    public String getCoordinatesJson() { return coordinatesJson; }
    public void setCoordinatesJson(String coordinatesJson) { this.coordinatesJson = coordinatesJson; }
}