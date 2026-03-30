package com.example.Phy6_Master.util;

import com.example.Phy6_Master.dto.QuizResponse;
import com.example.Phy6_Master.model.Option;
import com.example.Phy6_Master.model.Question;
import com.example.Phy6_Master.model.Quiz;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class for Quiz-related operations
 */
public class QuizUtils {

    /**
     * Calculate quiz score based on answers
     */
    public static double calculateScore(Quiz quiz, java.util.Map<Long, Long> answers) {
        if (quiz.getQuestions().isEmpty()) {
            return 0;
        }

        double totalPoints = 0;
        double earnedPoints = 0;

        for (Question question : quiz.getQuestions()) {
            double points = question.getPoints() != null ? question.getPoints() : 1.0;
            totalPoints += points;

            Long selectedOptionId = answers.get(question.getId());
            if (selectedOptionId != null && selectedOptionId.equals(question.getCorrectOptionId())) {
                earnedPoints += points;
            }
        }

        return totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    }

    /**
     * Check if quiz is available for taking (published and not expired)
     */
    public static boolean isQuizAvailable(Quiz quiz) {
        return quiz.getIsPublished() != null && quiz.getIsPublished();
    }

    /**
     * Get correct answer for a question
     */
    public static Option getCorrectOption(Question question) {
        if (question.getCorrectOptionId() == null || question.getOptions() == null) {
            return null;
        }

        return question.getOptions().stream()
                .filter(opt -> opt.getId().equals(question.getCorrectOptionId()))
                .findFirst()
                .orElse(null);
    }

    /**
     * Validate quiz completion (all questions answered)
     */
    public static boolean isQuizComplete(Quiz quiz, java.util.Map<Long, Long> answers) {
        return quiz.getQuestions().stream()
                .allMatch(q -> answers.containsKey(q.getId()));
    }

    /**
     * Count answered questions
     */
    public static int countAnsweredQuestions(Quiz quiz, java.util.Map<Long, Long> answers) {
        return (int) quiz.getQuestions().stream()
                .filter(q -> answers.containsKey(q.getId()))
                .count();
    }

    /**
     * Check if student passed the quiz
     */
    public static boolean studentPassed(Quiz quiz, double score) {
        return score >= (quiz.getPassingScore() != null ? quiz.getPassingScore() : 60);
    }

    /**
     * Format time remaining in mm:ss format
     */
    public static String formatTimeRemaining(int seconds) {
        int minutes = seconds / 60;
        int secs = seconds % 60;
        return String.format("%02d:%02d", minutes, secs);
    }

    /**
     * Shuffle answer options (preserves correct option ID)
     */
    public static List<Option> shuffleOptions(List<Option> options) {
        List<Option> shuffled = new ArrayList<>(options);
        java.util.Collections.shuffle(shuffled);
        return shuffled;
    }

    /**
     * Get question difficulty (based on point value)
     */
    public static String getQuestionDifficulty(Question question) {
        if (question.getPoints() == null) {
            return "MEDIUM";
        }

        if (question.getPoints() >= 2.0) {
            return "HARD";
        } else if (question.getPoints() >= 1.5) {
            return "MEDIUM";
        } else {
            return "EASY";
        }
    }

    /**
     * Validate quiz can be edited (not started by any student yet)
     */
    public static boolean canEditQuiz(Quiz quiz) {
        // This would require checking if any student has started the quiz
        // For now, returning true - would be enhanced with attempt tracking
        return true;
    }

    /**
     * Generate quiz statistics summary
     */
    public static QuizStatistics getQuizStatistics(Quiz quiz) {
        QuizStatistics stats = new QuizStatistics();
        stats.setTotalQuestions(quiz.getTotalQuestions());
        stats.setTotalPoints(quiz.getQuestions().stream()
                .mapToDouble(q -> q.getPoints() != null ? q.getPoints() : 1.0)
                .sum());
        stats.setAveragePointsPerQuestion(stats.getTotalPoints() / stats.getTotalQuestions());
        stats.setAllowReview(quiz.getAllowReview());
        stats.setPassingScore(quiz.getPassingScore());
        stats.setTimeLimit(quiz.getTimeLimit());
        return stats;
    }

    /**
     * Check if question has valid structure
     */
    public static boolean isQuestionValid(Question question) {
        if (question.getQuestionText() == null || question.getQuestionText().trim().isEmpty()) {
            return false;
        }

        if (question.getOptions() == null || question.getOptions().isEmpty()) {
            return false;
        }

        if (question.getCorrectOptionId() == null) {
            return false;
        }

        boolean hasCorrectOption = question.getOptions().stream()
                .anyMatch(opt -> opt.getId().equals(question.getCorrectOptionId()));

        return hasCorrectOption;
    }

    /**
     * Get total questions count (including nested)
     */
    public static int getTotalQuestionsCount(List<Quiz> quizzes) {
        return (int) quizzes.stream()
                .mapToLong(q -> q.getTotalQuestions() != null ? q.getTotalQuestions() : 0)
                .sum();
    }

    public static class QuizStatistics {
        private Integer totalQuestions;
        private Double totalPoints;
        private Double averagePointsPerQuestion;
        private Boolean allowReview;
        private Integer passingScore;
        private Integer timeLimit;

        // Getters and setters
        public Integer getTotalQuestions() { return totalQuestions; }
        public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

        public Double getTotalPoints() { return totalPoints; }
        public void setTotalPoints(Double totalPoints) { this.totalPoints = totalPoints; }

        public Double getAveragePointsPerQuestion() { return averagePointsPerQuestion; }
        public void setAveragePointsPerQuestion(Double averagePointsPerQuestion) { this.averagePointsPerQuestion = averagePointsPerQuestion; }

        public Boolean getAllowReview() { return allowReview; }
        public void setAllowReview(Boolean allowReview) { this.allowReview = allowReview; }

        public Integer getPassingScore() { return passingScore; }
        public void setPassingScore(Integer passingScore) { this.passingScore = passingScore; }

        public Integer getTimeLimit() { return timeLimit; }
        public void setTimeLimit(Integer timeLimit) { this.timeLimit = timeLimit; }
    }
}
