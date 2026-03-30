package com.example.Phy6_Master.repository;

import com.example.Phy6_Master.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByQuiz_IdOrderByQuestionOrder(Long quizId);

    Optional<Question> findByIdAndQuiz_Id(Long questionId, Long quizId);

    Integer countByQuiz_Id(Long quizId);
}
