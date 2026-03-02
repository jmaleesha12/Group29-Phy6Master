package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.dto.StudentResponse;
import com.example.Phy6_Master.model.Student;
import com.example.Phy6_Master.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/students")
public class StudentRoleController {

    private final StudentService studentService;

    public StudentRoleController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getStudentProfile(@PathVariable Long userId) {
        try {
            Optional<Student> student = studentService.getStudentByUserId(userId);
            if (student.isPresent()) {
                return ResponseEntity.ok(student.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Student profile not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error retrieving student profile: " + e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllStudents() {
        try {
            List<Student> students = studentService.getAllStudents();
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error retrieving students: " + e.getMessage()));
        }
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<?> updateStudentProfile(@PathVariable Long userId, @RequestBody Student studentDetails) {
        try {
            Student updatedStudent = studentService.updateStudentProfile(userId, studentDetails);
            return ResponseEntity.ok(Map.of(
                    "message", "Student profile updated successfully",
                    "student", updatedStudent
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating profile: " + e.getMessage()));
        }
    }

    @GetMapping("/search/{studentId}")
    public ResponseEntity<?> searchByStudentId(@PathVariable String studentId) {
        try {
            Optional<Student> student = studentService.getStudentByStudentId(studentId);
            if (student.isPresent()) {
                return ResponseEntity.ok(student.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Student not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error searching student: " + e.getMessage()));
        }
    }
}
