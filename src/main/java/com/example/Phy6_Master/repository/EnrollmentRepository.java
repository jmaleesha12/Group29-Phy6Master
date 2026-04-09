package com.example.Phy6_Master.repository;

import com.example.Phy6_Master.model.Enrollment;
import com.example.Phy6_Master.model.User;
import com.example.Phy6_Master.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudent(User student);
    List<Enrollment> findByCourse(Course course);
    Optional<Enrollment> findByStudentAndCourse(User user, Course course);
    Optional<Enrollment> findByStudentAndCourseAndStatus(User user, Course course, String status);
    boolean existsByStudentAndCourse(User user, Course course);
    boolean existsByStudentAndCourseAndStatus(User user, Course course, String status);
}
