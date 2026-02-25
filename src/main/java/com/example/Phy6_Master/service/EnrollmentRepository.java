package com.example.Phy6_Master.repository;

import com.example.Phy6_Master.model.Enrollment;
import com.example.Phy6_Master.model.User;
import com.example.Phy6_Master.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudent(User student);
    List<Enrollment> findByCourse(Course course);
}
