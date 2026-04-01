package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.dto.ClassAccessResponseDTO;
import com.example.Phy6_Master.dto.PendingEnrollmentResponseDTO;
import com.example.Phy6_Master.model.User;
import com.example.Phy6_Master.repository.UserRepository;
import com.example.Phy6_Master.service.ClassAccessService;
import com.example.Phy6_Master.service.StudentEnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/enrollments")
@RequiredArgsConstructor
public class StudentEnrollmentController {

    private final StudentEnrollmentService studentEnrollmentService;
    private final ClassAccessService classAccessService;
    private final UserRepository userRepository;

    @GetMapping("/pending/{userId}")
    public ResponseEntity<List<PendingEnrollmentResponseDTO>> getPendingEnrollments(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return ResponseEntity.ok(studentEnrollmentService.getPendingEnrollments(user));
    }

    @GetMapping("/access/{userId}/{courseId}")
    public ResponseEntity<ClassAccessResponseDTO> checkClassAccess(@PathVariable Long userId, @PathVariable Long courseId) {
        User user = userRepository.findById(userId).orElseThrow();
        return ResponseEntity.ok(classAccessService.checkAccess(user, courseId));
    }

    @GetMapping("/status/{userId}")
    public ResponseEntity<List<com.example.Phy6_Master.dto.EnrollmentStatusItemDTO>> getEnrollmentStatuses(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return ResponseEntity.ok(studentEnrollmentService.getAllEnrollmentStatuses(user));
    }
}
