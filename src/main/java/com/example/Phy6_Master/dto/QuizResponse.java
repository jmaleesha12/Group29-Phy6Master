package com.example.Phy6_Master.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResponse {
    private Long id;
    private String title;
    private String description;
    private Long courseId;
    private Long lessonId;
    private Long teacherId;
    private Integer totalQuestions;
    private Integer passingScore;
    private Boolean isPublished;
    private Boolean allowReview;
    private Integer timeLimit;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<QuestionResponse> questions;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionResponse {
        private Long id;
        private String questionText;
        private Integer questionOrder;
        private Long quizId;
        private List<OptionResponse> options;
        private Long correctOptionId;
        private String explanation;
        private Double points;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class OptionResponse {
            private Long id;
            private String optionText;
            private Integer optionOrder;
            private Long questionId;
            private String explanation;
        }
    }
}
