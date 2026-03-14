package com.example.Phy6_Master.controller;
import com.example.Phy6_Master.dto.MaterialResponse;
import com.example.Phy6_Master.model.Course;
import com.example.Phy6_Master.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/{studentId}/courses")
    public ResponseEntity<List<Course>> getEnrolledCourses(@PathVariable Long studentId) {
        List<Course> courses = studentService.getEnrolledCourses(studentId);
        return ResponseEntity.ok(courses);
    }
}

// Add these new endpoints to your existing StudentController

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