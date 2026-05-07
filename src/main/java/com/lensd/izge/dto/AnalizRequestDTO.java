package com.lensd.izge.dto;

import java.util.List;

public class AnalizRequestDTO {
    private List<KlavyeAnalizDTO> klavyeAnalizleri;
    private List<CizimAnalizDTO> cizimAnalizleri;

    public List<KlavyeAnalizDTO> getKlavyeAnalizleri() { return klavyeAnalizleri; }
    public void setKlavyeAnalizleri(List<KlavyeAnalizDTO> klavyeAnalizleri) { this.klavyeAnalizleri = klavyeAnalizleri; }
    
    public List<CizimAnalizDTO> getCizimAnalizleri() { return cizimAnalizleri; }
    public void setCizimAnalizleri(List<CizimAnalizDTO> cizimAnalizleri) { this.cizimAnalizleri = cizimAnalizleri; }
}