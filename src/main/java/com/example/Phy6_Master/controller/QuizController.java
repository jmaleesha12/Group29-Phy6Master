package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.dto.AddQuestionRequest;
import com.example.Phy6_Master.dto.CreateQuizRequest;
import com.example.Phy6_Master.dto.QuizResponse;
import com.example.Phy6_Master.dto.UpdateQuestionRequest;
import com.example.Phy6_Master.dto.UpdateQuizRequest;
import com.example.Phy6_Master.model.Question;
import com.example.Phy6_Master.model.Quiz;
import com.example.Phy6_Master.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    /**
     * Create a new quiz with questions
     * POST /api/quizzes
     */
    @PostMapping
    public ResponseEntity<?> createQuiz(
            @RequestParam Long teacherId,
            @Valid @RequestBody CreateQuizRequest request) {
        try {
            Quiz quiz = quizService.createQuiz(teacherId, request);
            QuizResponse response = quizService.convertToResponse(quiz);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating quiz", "error", e.getMessage()));
        }
    }

    /**
     * Get quiz by ID
     * GET /api/quizzes/{quizId}
     */
    @GetMapping("/{quizId}")
    public ResponseEntity<?> getQuiz(@PathVariable Long quizId) {
        try {
            Quiz quiz = quizService.getQuizById(quizId);
            QuizResponse response = quizService.convertToResponse(quiz);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Get all quizzes for a course
     * GET /api/quizzes/course/{courseId}
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getQuizzesByCourse(@PathVariable Long courseId) {
        try {
            List<Quiz> quizzes = quizService.getQuizzesByCourse(courseId);
            List<QuizResponse> responses = quizzes.stream()
                    .map(quizService::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching quizzes"));
        }
    }

    /**
     * Get published quizzes for a course (for students)
     * GET /api/quizzes/course/{courseId}/published
     */
    @GetMapping("/course/{courseId}/published")
    public ResponseEntity<?> getPublishedQuizzesByCourse(@PathVariable Long courseId) {
        try {
            List<Quiz> quizzes = quizService.getPublishedQuizzesByCourse(courseId);
            List<QuizResponse> responses = quizzes.stream()
                    .map(quizService::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching quizzes"));
        }
    }

    /**
     * Get all quizzes created by a teacher
     * GET /api/quizzes/teacher/{teacherId}
     */
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getQuizzesByTeacher(@PathVariable Long teacherId) {
        try {
            List<Quiz> quizzes = quizService.getQuizzesByTeacher(teacherId);
            List<QuizResponse> responses = quizzes.stream()
                    .map(quizService::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching quizzes"));
        }
    }

    /**
     * Update quiz details
     * PUT /api/quizzes/{quizId}
     */
    @PutMapping("/{quizId}")
    public ResponseEntity<?> updateQuiz(
            @PathVariable Long quizId,
            @RequestParam Long teacherId,
            @Valid @RequestBody UpdateQuizRequest request) {
        try {
            Quiz quiz = quizService.updateQuiz(quizId, teacherId, request);
            QuizResponse response = quizService.convertToResponse(quiz);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating quiz"));
        }
    }

    /**
     * Delete a quiz
     * DELETE /api/quizzes/{quizId}
     */
    @DeleteMapping("/{quizId}")
    public ResponseEntity<?> deleteQuiz(
            @PathVariable Long quizId,
            @RequestParam Long teacherId) {
        try {
            quizService.deleteQuiz(quizId, teacherId);
            return ResponseEntity.ok(Map.of("message", "Quiz deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting quiz"));
        }
    }

    /**
     * Add a question to a quiz
     * POST /api/quizzes/{quizId}/questions
     */
    @PostMapping("/{quizId}/questions")
    public ResponseEntity<?> addQuestion(
            @PathVariable Long quizId,
            @RequestParam Long teacherId,
            @Valid @RequestBody AddQuestionRequest request) {
        try {
            Question question = quizService.addQuestion(quizId, teacherId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(question);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error adding question"));
        }
    }

    /**
     * Get a specific question by ID
     * GET /api/quizzes/{quizId}/questions/{questionId}
     */
    @GetMapping("/{quizId}/questions/{questionId}")
    public ResponseEntity<?> getQuestion(
            @PathVariable Long quizId,
            @PathVariable Long questionId) {
        try {
            Question question = quizService.getQuestion(questionId);
            return ResponseEntity.ok(question);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Update a question
     * PUT /api/quizzes/{quizId}/questions/{questionId}
     */
    @PutMapping("/{quizId}/questions/{questionId}")
    public ResponseEntity<?> updateQuestion(
            @PathVariable Long quizId,
            @PathVariable Long questionId,
            @RequestParam Long teacherId,
            @Valid @RequestBody UpdateQuestionRequest request) {
        try {
            Question question = quizService.updateQuestion(quizId, questionId, teacherId, request);
            return ResponseEntity.ok(question);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating question"));
        }
    }

    /**
     * Delete a question from a quiz
     * DELETE /api/quizzes/{quizId}/questions/{questionId}
     */
    @DeleteMapping("/{quizId}/questions/{questionId}")
    public ResponseEntity<?> deleteQuestion(
            @PathVariable Long quizId,
            @PathVariable Long questionId,
            @RequestParam Long teacherId) {
        try {
            quizService.deleteQuestion(quizId, questionId, teacherId);
            return ResponseEntity.ok(Map.of("message", "Question deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting question"));
        }
    }
}
