package com.example.Phy6_Master.service;

import com.example.Phy6_Master.dto.PasswordResetConfirmRequest;
import com.example.Phy6_Master.dto.PasswordResetRequest;
import com.example.Phy6_Master.model.User;
import com.example.Phy6_Master.repository.StudentRepository;
import com.example.Phy6_Master.repository.TeacherRepository;
import com.example.Phy6_Master.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private TeacherRepository teacherRepository;

    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    public void setUp() {
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.authService = new AuthService(userRepository, studentRepository, teacherRepository, passwordEncoder);
    }

    @Test
    public void whenValidEmail_thenRequestPasswordResetCreatesToken() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setPassword(passwordEncoder.encode("oldpass"));

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        PasswordResetRequest request = new PasswordResetRequest();
        request.setEmail("test@example.com");

        String token = authService.requestPasswordReset(request);

        assertNotNull(token);
        assertNotNull(user.getPasswordResetToken());
        assertEquals(token, user.getPasswordResetToken());
        assertNotNull(user.getPasswordResetTokenExpiry());
        assertTrue(user.getPasswordResetTokenExpiry().isAfter(LocalDateTime.now()));

        verify(userRepository).findByEmail("test@example.com");
        verify(userRepository).save(user);
    }

    @Test
    public void whenInvalidEmail_thenRequestPasswordResetThrows() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        PasswordResetRequest request = new PasswordResetRequest();
        request.setEmail("missing@example.com");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> authService.requestPasswordReset(request));
        assertEquals("User with email not found", ex.getMessage());
    }

    @Test
    public void whenValidToken_thenConfirmPasswordReset() {
        User user = new User();
        user.setId(1L);
        user.setPassword(passwordEncoder.encode("oldpass"));
        user.setPasswordResetToken("valid-token");
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusMinutes(30));

        when(userRepository.findByPasswordResetToken("valid-token")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        PasswordResetConfirmRequest request = new PasswordResetConfirmRequest();
        request.setToken("valid-token");
        request.setNewPassword("newpass123");

        authService.confirmPasswordReset(request);

        assertTrue(passwordEncoder.matches("newpass123", user.getPassword()));
        assertNull(user.getPasswordResetToken());
        assertNull(user.getPasswordResetTokenExpiry());

        verify(userRepository).findByPasswordResetToken("valid-token");
        verify(userRepository).save(user);
    }

    @Test
    public void whenExpiredToken_thenConfirmPasswordResetThrows() {
        User user = new User();
        user.setId(1L);
        user.setPassword(passwordEncoder.encode("oldpass"));
        user.setPasswordResetToken("expired-token");
        user.setPasswordResetTokenExpiry(LocalDateTime.now().minusMinutes(10));

        when(userRepository.findByPasswordResetToken("expired-token")).thenReturn(Optional.of(user));

        PasswordResetConfirmRequest request = new PasswordResetConfirmRequest();
        request.setToken("expired-token");
        request.setNewPassword("newpass123");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> authService.confirmPasswordReset(request));
        assertEquals("Password reset token expired", ex.getMessage());
    }
}
