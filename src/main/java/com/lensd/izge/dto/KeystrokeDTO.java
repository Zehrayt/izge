package com.lensd.izge.dto;


public class KeystrokeDTO {
    private String key;          // Basılan tuş ('a', 'b', 'Backspace')
    private long timestamp;      // Basıldığı an (milisaniye)
    private String inputType;    // Verinin hangi kutudan geldiği 

    public KeystrokeDTO() {}

    public KeystrokeDTO(String key, long timestamp, String inputType) {
        this.key = key;
        this.timestamp = timestamp;
        this.inputType = inputType;
    }
    
    //getter ve setter metodları
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public String getInputType() { return inputType; }
    public void setInputType(String inputType) { this.inputType = inputType; }
}