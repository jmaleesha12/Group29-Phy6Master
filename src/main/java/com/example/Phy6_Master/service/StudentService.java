package com.example.Phy6_Master.service;

import com.example.Phy6_Master.model.Course;
import com.example.Phy6_Master.model.Enrollment;
import com.example.Phy6_Master.model.LearningMaterial;
import com.example.Phy6_Master.model.User;
import com.example.Phy6_Master.dto.MaterialResponse;
import com.example.Phy6_Master.model.Lesson;
import com.example.Phy6_Master.repository.EnrollmentRepository;
import com.example.Phy6_Master.repository.LearningMaterialRepository;
import com.example.Phy6_Master.repository.UserRepository;
import com.example.Phy6_Master.repository.LessonRepository;

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

    @Autowired
    private LessonRepository lessonRepository;

    public List<Course> getEnrolledCourses(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Enrollment> enrollments = enrollmentRepository.findByStudent(student);
        return enrollments.stream()
                .map(Enrollment::getCourse)
                .collect(Collectors.toList());
    }

    public List<LearningMaterial> getCourseMaterials(Long courseId) {
        return learningMaterialRepository.findByCourseId(courseId);
    }

    public List<LessonResponse> getCourseLessonsWithMaterials(Long studentId, Long courseId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        boolean isEnrolled = enrollmentRepository.findByStudent(student).stream()
                .anyMatch(e -> e.getCourse().getId().equals(courseId));

        if (!isEnrolled) {
            throw new RuntimeException("Student is not enrolled in this course");
        }

        List<Lesson> lessons = lessonRepository.findByCourseId(courseId);

        return lessons.stream().map(lesson -> {
            List<MaterialResponse> materials = learningMaterialRepository.findByLessonId(lesson.getId())
                    .stream()
                    .map(MaterialResponse::new)
                    .collect(Collectors.toList());
            return new LessonResponse(lesson, materials);
        }).collect(Collectors.toList());
    }

    public List<MaterialResponse> getLessonMaterials(Long studentId, Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        boolean isEnrolled = enrollmentRepository.findByStudent(student).stream()
                .anyMatch(e -> e.getCourse().getId().equals(lesson.getCourse().getId()));

        if (!isEnrolled) {
            throw new RuntimeException("Student is not enrolled in this course");
        }

        return learningMaterialRepository.findByLessonId(lessonId)
                .stream()
                .map(MaterialResponse::new)
                .collect(Collectors.toList());
    }
}
