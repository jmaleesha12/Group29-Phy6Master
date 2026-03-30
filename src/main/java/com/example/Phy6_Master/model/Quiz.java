package com.example.Phy6_Master.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "quizzes")
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnore
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = true)
    @JsonIgnore
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    @JsonIgnore
    private User teacher;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Question> questions = new ArrayList<>();

    // Quiz settings
    private Integer totalQuestions;
    private Integer passingScore;
    private Boolean isPublished;
    private Boolean allowReview;
    private Integer timeLimit; // in minutes, null = no limit

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Expose courseId in JSON
    @JsonProperty("courseId")
    public Long getCourseId() {
        return course != null ? course.getId() : null;
    }

    // Expose lessonId in JSON
    @JsonProperty("lessonId")
    public Long getLessonId() {
        return lesson != null ? lesson.getId() : null;
    }

    // Expose teacherId in JSON
    @JsonProperty("teacherId")
    public Long getTeacherId() {
        return teacher != null ? teacher.getId() : null;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.totalQuestions == null) {
            this.totalQuestions = 0;
        }
        if (this.isPublished == null) {
            this.isPublished = false;
        }
        if (this.allowReview == null) {
            this.allowReview = true;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
