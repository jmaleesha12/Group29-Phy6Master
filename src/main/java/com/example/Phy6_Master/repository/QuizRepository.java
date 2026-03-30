package com.example.Phy6_Master.repository;

import com.example.Phy6_Master.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByCourse_Id(Long courseId);

    List<Quiz> findByLesson_Id(Long lessonId);

    List<Quiz> findByTeacher_Id(Long teacherId);

    List<Quiz> findByCourse_IdAndIsPublishedTrue(Long courseId);

    Optional<Quiz> findByIdAndTeacher_Id(Long quizId, Long teacherId);

    List<Quiz> findByCourse_IdOrderByCreatedAtDesc(Long courseId);
}
