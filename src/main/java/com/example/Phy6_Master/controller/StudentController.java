package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.dto.MaterialResponse;
import com.example.Phy6_Master.dto.LessonResponse;
import com.example.Phy6_Master.model.Course;
import com.example.Phy6_Master.model.Student;
import com.example.Phy6_Master.repository.StudentRepository;
import com.example.Phy6_Master.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/{studentId}/courses")
    public ResponseEntity<List<Course>> getEnrolledCourses(@PathVariable Long studentId) {
        List<Course> courses = studentService.getEnrolledCourses(studentId);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        return ResponseEntity.ok(students);
    }

    // Look up Student entity by User ID (needed because auth stores userId, not studentId)
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<Student> getStudentByUserId(@PathVariable Long userId) {
        return studentRepository.findByUser_Id(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Convenience: get enrolled courses by User ID
    @GetMapping("/by-user/{userId}/courses")
    public ResponseEntity<List<Course>> getEnrolledCoursesByUserId(@PathVariable Long userId) {
        List<Course> courses = studentService.getEnrolledCourses(userId);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/by-user/{userId}/courses/{courseId}/lessons")
    public ResponseEntity<List<LessonResponse>> getCourseLessons(
            @PathVariable Long userId,
            @PathVariable Long courseId) {
        try {
            List<LessonResponse> lessons = studentService.getCourseLessonsWithMaterials(userId, courseId);
            return ResponseEntity.ok(lessons);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/by-user/{userId}/lessons/{lessonId}/materials")
    public ResponseEntity<List<MaterialResponse>> getLessonMaterials(
            @PathVariable Long userId,
            @PathVariable Long lessonId) {
        try {
            List<MaterialResponse> materials = studentService.getLessonMaterials(userId, lessonId);
            return ResponseEntity.ok(materials);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
