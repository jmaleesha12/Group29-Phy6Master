package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.model.Teacher;
import com.example.Phy6_Master.service.TeacherService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/teachers")
public class TeacherRoleController {

    private final TeacherService teacherService;

    public TeacherRoleController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getTeacherProfile(@PathVariable Long userId) {
        try {
            Optional<Teacher> teacher = teacherService.getTeacherByUserId(userId);
            if (teacher.isPresent()) {
                return ResponseEntity.ok(teacher.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Teacher profile not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error retrieving teacher profile: " + e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllTeachers() {
        try {
            List<Teacher> teachers = teacherService.getAllTeachers();
            return ResponseEntity.ok(teachers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error retrieving teachers: " + e.getMessage()));
        }
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<?> updateTeacherProfile(@PathVariable Long userId, @RequestBody Teacher teacherDetails) {
        try {
            Teacher updatedTeacher = teacherService.updateTeacherProfile(userId, teacherDetails);
            return ResponseEntity.ok(Map.of(
                    "message", "Teacher profile updated successfully",
                    "teacher", updatedTeacher
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating profile: " + e.getMessage()));
        }
    }

    @GetMapping("/search/{employeeId}")
    public ResponseEntity<?> searchByEmployeeId(@PathVariable String employeeId) {
        try {
            Optional<Teacher> teacher = teacherService.getTeacherByEmployeeId(employeeId);
            if (teacher.isPresent()) {
                return ResponseEntity.ok(teacher.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Teacher not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error searching teacher: " + e.getMessage()));
        }
    }
}
