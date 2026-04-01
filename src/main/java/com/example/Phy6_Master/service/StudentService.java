package com.example.Phy6_Master.service;

import com.example.Phy6_Master.model.Course;
import com.example.Phy6_Master.model.Enrollment;
import com.example.Phy6_Master.model.LearningMaterial;
import com.example.Phy6_Master.repository.EnrollmentRepository;
import com.example.Phy6_Master.repository.LearningMaterialRepository;
import com.example.Phy6_Master.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private LearningMaterialRepository learningMaterialRepository;

    public List<Course> getEnrolledCourses(Long userId) {
        return userRepository.findById(userId)
                .map(user -> enrollmentRepository.findByStudent(user).stream()
                .filter(e -> "APPROVED".equalsIgnoreCase(e.getStatus()) || "ACTIVE".equalsIgnoreCase(e.getStatus()))
                        .map(Enrollment::getCourse)
                        .collect(Collectors.toList()))
                .orElse(List.of());
    }

    public List<LearningMaterial> getCourseMaterials(Long courseId) {
        // ideally check if student is enrolled in this course
        return learningMaterialRepository.findByCourseId(courseId);
    }
}
