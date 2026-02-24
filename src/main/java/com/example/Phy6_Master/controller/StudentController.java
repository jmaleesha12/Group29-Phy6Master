package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.model.Course;
import com.example.Phy6_Master.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/{studentId}/courses")
    public ResponseEntity<List<Course>> getEnrolledCourses(@PathVariable Long studentId) {
        return ResponseEntity.ok(studentService.getEnrolledCourses(studentId));
    }
}
