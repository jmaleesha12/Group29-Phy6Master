package com.example.Phy6_Master.service;

import com.example.Phy6_Master.model.QuizResult;
import com.example.Phy6_Master.repository.QuizResultRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class QuizService {
    private final QuizResultRepository quizResultRepository;

    public QuizService(QuizResultRepository quizResultRepository) {
        this.quizResultRepository = quizResultRepository;
    }

    public List<QuizResult> getResultsForUser(Long userId) {
        return quizResultRepository.findByUserId(userId);
    }

    public Map<String, Object> getSummaryForUser(Long userId) {
        var results = getResultsForUser(userId);
        double avg = results.stream().mapToDouble(r -> r.getScore() == null ? 0 : r.getScore()).average().orElse(0);
        long completed = results.size();
        double best = results.stream().mapToDouble(r -> r.getScore() == null ? 0 : r.getScore()).max().orElse(0);
        Map<String, Object> m = new HashMap<>();
        m.put("completed", completed);
        m.put("totalQuizzes", Math.max(1, completed));
        m.put("averageScore", (int)Math.round(avg));
        m.put("bestScore", (int)Math.round(best));
        m.put("trend", "up"); // placeholder
        return m;
    }
}
