package com.example.Phy6_Master.repository;

import com.example.Phy6_Master.model.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {
    Optional<StudentAnswer> findBySession_IdAndQuestion_Id(Long sessionId, Long questionId);

    List<StudentAnswer> findBySession_Id(Long sessionId);
}
