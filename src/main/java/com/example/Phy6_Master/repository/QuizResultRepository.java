package com.example.Phy6_Master.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Phy6_Master.model.QuizResult;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    Optional<QuizResult> findBySession_Id(Long sessionId);

    @EntityGraph(attributePaths = {"quiz", "session"})
    List<QuizResult> findByStudent_IdOrderByEvaluatedAtDesc(Long studentId);
}