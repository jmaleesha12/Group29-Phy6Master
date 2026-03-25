package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.dto.StudentProfileRequest;
import com.example.Phy6_Master.dto.StudentResponse;
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

    @GetMapping("/{studentId}/profile")
    public ResponseEntity<StudentResponse> getStudentProfile(@PathVariable String studentId) {
        StudentResponse response = studentService.getStudentProfileByStudentId(studentId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{userId}/profile")
    public ResponseEntity<StudentResponse> createStudentProfile(@PathVariable Long userId,
                                                                @RequestBody StudentProfileRequest request) {
        StudentResponse response = studentService.createStudentProfile(userId, request);
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{studentId}/profile")
    public ResponseEntity<StudentResponse> updateStudentProfile(@PathVariable String studentId,
                                                                @RequestBody StudentProfileRequest request) {
        StudentResponse response = studentService.updateStudentProfile(studentId, request);
        return ResponseEntity.ok(response);
    }
}
