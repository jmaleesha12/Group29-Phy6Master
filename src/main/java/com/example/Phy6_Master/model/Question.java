package com.example.Phy6_Master.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2000)
    private String questionText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    @JsonIgnore
    private Quiz quiz;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Option> options = new ArrayList<>();

    @Column(name = "question_order")
    private Integer questionOrder; // Order of question in quiz

    @Enumerated(EnumType.STRING)
    private QuestionType questionType = QuestionType.MULTIPLE_CHOICE;

    // ID of the correct option
    @Column(name = "correct_option_id")
    private Long correctOptionId;

    @Column(length = 500)
    private String explanation; // Optional explanation for the correct answer

    private Double points = 1.0; // Points for this question

    public enum QuestionType {
        MULTIPLE_CHOICE,
        TRUE_FALSE,
        SHORT_ANSWER
    }

    // Expose quizId in JSON
    @JsonProperty("quizId")
    public Long getQuizId() {
        return quiz != null ? quiz.getId() : null;
    }

    // Get correct option with null safety
    @JsonProperty("correctOption")
    public Option getCorrectOption() {
        if (correctOptionId == null || options == null) {
            return null;
        }
        return options.stream()
                .filter(opt -> opt.getId().equals(correctOptionId))
                .findFirst()
                .orElse(null);
    }
}
