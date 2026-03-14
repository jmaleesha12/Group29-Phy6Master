package com.example.Phy6_Master.dto;

import com.example.Phy6_Master.model.Lesson;
import java.util.List;

public class LessonResponse {
    private Long id;
    private String title;
    private String content;
    private Long courseId;
    private List<MaterialResponse> materials;

    public LessonResponse() {}

    public LessonResponse(Lesson lesson, List<MaterialResponse> materials) {
        this.id = lesson.getId();
        this.title = lesson.getTitle();
        this.content = lesson.getContent();
        this.courseId = lesson.getCourse().getId();
        this.materials = materials;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public List<MaterialResponse> getMaterials() { return materials; }
    public void setMaterials(List<MaterialResponse> materials) { this.materials = materials; }
}
