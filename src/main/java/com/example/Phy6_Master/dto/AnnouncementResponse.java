 package com.example.Phy6_Master.dto;

import com.example.Phy6_Master.model.Announcement;
import java.time.LocalDateTime;

public class AnnouncementResponse {
    private Long id;
    private String title;
    private String content;
    private Long courseId;
    private String courseName;
    private Long teacherId;
    private String teacherName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AnnouncementResponse() {}

    public AnnouncementResponse(Announcement announcement) {
        this.id = announcement.getId();
        this.title = announcement.getTitle();
        this.content = announcement.getContent();
        this.courseId = announcement.getCourse().getId();
        this.courseName = announcement.getCourse().getTitle();
        this.teacherId = announcement.getTeacher().getId();
        this.teacherName = announcement.getTeacher().getName();
        this.createdAt = announcement.getCreatedAt();
        this.updatedAt = announcement.getUpdatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }

    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
