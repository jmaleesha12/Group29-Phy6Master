package com.example.Phy6_Master.controller;

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

    /**
     * Get all courses enrolled by a student
     * @param studentId the student ID (must be greater than 0)
     * @return list of enrolled courses
     */
    @GetMapping("/{studentId}/courses")
    public ResponseEntity<List<Course>> getEnrolledCourses(
            @PathVariable(name = "studentId") Long studentId) {
        if (studentId == null || studentId <= 0) {
            return ResponseEntity.badRequest().build();
        }
        List<Course> courses = studentService.getEnrolledCourses(studentId);
        return ResponseEntity.ok(courses);
    }
}
