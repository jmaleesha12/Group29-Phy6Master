package com.example.Phy6_Master.dto;

import com.example.Phy6_Master.model.LearningMaterial;

public class MaterialResponse {
    private Long id;
    private String title;
    private String type;
    private String url;
    private Long lessonId;

    public MaterialResponse() {}

    public MaterialResponse(LearningMaterial material) {
        this.id = material.getId();
        this.title = material.getTitle();
        this.type = material.getType().name();
        this.url = material.getUrl();
        this.lessonId = material.getLesson().getId();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Long getLessonId() { return lessonId; }
    public void setLessonId(Long lessonId) { this.lessonId = lessonId; }
}
