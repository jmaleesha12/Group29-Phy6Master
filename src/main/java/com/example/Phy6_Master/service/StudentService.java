package com.example.Phy6_Master.service;

import com.example.Phy6_Master.model.Course;
import com.example.Phy6_Master.model.Enrollment;
import com.example.Phy6_Master.model.LearningMaterial;
import com.example.Phy6_Master.model.User;
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

    public List<Course> getEnrolledCourses(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Enrollment> enrollments = enrollmentRepository.findByStudent(student);
        return enrollments.stream()
                .map(Enrollment::getCourse)
                .collect(Collectors.toList());
    }

    public List<LearningMaterial> getCourseMaterials(Long courseId) {
        // ideally check if student is enrolled in this course
        return learningMaterialRepository.findByCourseId(courseId);
    }
}
