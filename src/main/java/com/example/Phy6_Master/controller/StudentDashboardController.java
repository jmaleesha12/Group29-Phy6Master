package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.dto.StudentDashboardResponse;
import com.example.Phy6_Master.model.Course;
import com.example.Phy6_Master.model.Student;
import com.example.Phy6_Master.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/students")
public class StudentDashboardController {

    private final StudentService studentService;

    public StudentDashboardController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/dashboard/{userId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long userId) {
        try {
            Optional<Student> studentOpt = studentService.getStudentByUserId(userId);
            if (studentOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Student profile not found"));
            }

            Student student = studentOpt.get();

            // Use existing service to fetch enrolled courses (upcoming classes can be derived by the frontend)
            List<Course> enrolledCourses = studentService.getEnrolledCourses(student.getUser().getId());

            // Aggregated response - placeholders used for modules not yet implemented
            StudentDashboardResponse resp = new StudentDashboardResponse(
                    student,
                    enrolledCourses,
                    Collections.emptyList(), // announcements
                    Collections.emptyMap(),   // paymentStatus
                    Collections.emptyMap(),   // quizPerformance
                    Collections.emptyList()   // progress
            );

            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error retrieving dashboard: " + e.getMessage()));
        }
    }
}
