package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.model.QuizResult;
import com.example.Phy6_Master.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/quizzes")
public class QuizController {
    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/results/{userId}")
    public ResponseEntity<List<QuizResult>> results(@PathVariable Long userId) {
        return ResponseEntity.ok(quizService.getResultsForUser(userId));
    }

    @GetMapping("/summary/{userId}")
    public ResponseEntity<Map<String, Object>> summary(@PathVariable Long userId) {
        return ResponseEntity.ok(quizService.getSummaryForUser(userId));
    }
}
