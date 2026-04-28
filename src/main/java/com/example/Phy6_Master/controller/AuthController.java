package com.example.Phy6_Master.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Phy6_Master.dto.AccountantResponse;
import com.example.Phy6_Master.dto.AccountantSignUpRequest;
import com.example.Phy6_Master.dto.AuthResponse;
import com.example.Phy6_Master.dto.AuthSignInRequest;
import com.example.Phy6_Master.dto.AuthSignUpRequest;
import com.example.Phy6_Master.dto.ForgotPasswordRequest;
import com.example.Phy6_Master.dto.ForgotPasswordResponse;
import com.example.Phy6_Master.dto.ResetPasswordRequest;
import com.example.Phy6_Master.dto.StudentResponse;
import com.example.Phy6_Master.dto.StudentSignUpRequest;
import com.example.Phy6_Master.dto.TeacherResponse;
import com.example.Phy6_Master.dto.TeacherSignUpRequest;
import com.example.Phy6_Master.dto.TutorResponse;
import com.example.Phy6_Master.dto.TutorSignUpRequest;
import com.example.Phy6_Master.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@Valid @RequestBody AuthSignInRequest request) {
        try {
            AuthResponse response = authService.signIn(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", exception.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        ForgotPasswordResponse response = authService.requestPasswordReset(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            String message = authService.resetPassword(request);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", exception.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Valid @RequestBody AuthSignUpRequest request) {
        try {
            AuthResponse response = authService.signUpStudent(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", exception.getMessage()));
        }
    }

    @PostMapping("/signup/student")
    public ResponseEntity<?> signUpStudent(@Valid @RequestBody StudentSignUpRequest request) {
        try {
            StudentResponse response = authService.signUpAsStudent(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", exception.getMessage()));
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating student account: " + exception.getMessage()));
        }
    }

    @PostMapping("/signup/teacher")
    public ResponseEntity<?> signUpTeacher(@Valid @RequestBody TeacherSignUpRequest request) {
        try {
            TeacherResponse response = authService.signUpAsTeacher(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", exception.getMessage()));
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating teacher account: " + exception.getMessage()));
        }
    }

    @PostMapping("/signup/tutor")
    public ResponseEntity<?> signUpTutor(@Valid @RequestBody TutorSignUpRequest request) {
        try {
            TutorResponse response = authService.signUpAsTutor(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", exception.getMessage()));
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating tutor account: " + exception.getMessage()));
        }
    }

    @PostMapping("/signup/accountant")
    public ResponseEntity<?> signUpAccountant(@Valid @RequestBody AccountantSignUpRequest request) {
        try {
            AccountantResponse response = authService.signUpAsAccountant(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", exception.getMessage()));
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating accountant account: " + exception.getMessage()));
        }
    }
}
