package com.example.Phy6_Master.service;

import com.example.Phy6_Master.dto.*;
import com.example.Phy6_Master.model.User;
import com.example.Phy6_Master.model.Student;
import com.example.Phy6_Master.model.Teacher;
import com.example.Phy6_Master.repository.UserRepository;
import com.example.Phy6_Master.repository.StudentRepository;
import com.example.Phy6_Master.repository.TeacherRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, StudentRepository studentRepository,
                       TeacherRepository teacherRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse signIn(AuthSignInRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return new AuthResponse(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getRole(),
                "Signed in successfully"
        );
    }

    public AuthResponse signUpStudent(AuthSignUpRequest request) {
        userRepository.findByUsername(request.getUsername()).ifPresent(existing -> {
            throw new IllegalArgumentException("Username already exists");
        });

        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.STUDENT);

        User saved = userRepository.save(user);

        return new AuthResponse(
                saved.getId(),
                saved.getUsername(),
                saved.getName(),
                saved.getRole(),
                "Account created successfully"
        );
    }

    public StudentResponse signUpAsStudent(StudentSignUpRequest request) {
        userRepository.findByUsername(request.getUsername()).ifPresent(existing -> {
            throw new IllegalArgumentException("Username already exists");
        });

        // Create User
        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(User.Role.STUDENT);
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        // Create Student Profile
        Student student = new Student();
        student.setUser(savedUser);
        student.setStudentId("STU-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        student.setSchool(request.getSchool());
        student.setGrade(request.getGrade());
        student.setAddress(request.getAddress());
        student.setParentName(request.getParentName());
        student.setParentPhoneNumber(request.getParentPhoneNumber());

        Student savedStudent = studentRepository.save(student);

        return new StudentResponse(
                savedUser.getId(),
                savedStudent.getId(),
                savedUser.getUsername(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhoneNumber(),
                student.getSchool(),
                student.getGrade(),
                student.getAddress(),
                student.getParentName(),
                student.getParentPhoneNumber(),
                savedUser.getRole(),
                "Student account created successfully"
        );
    }

    public TeacherResponse signUpAsTeacher(TeacherSignUpRequest request) {
        userRepository.findByUsername(request.getUsername()).ifPresent(existing -> {
            throw new IllegalArgumentException("Username already exists");
        });

        // Create User
        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(User.Role.TEACHER);
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        // Create Teacher Profile
        Teacher teacher = new Teacher();
        teacher.setUser(savedUser);
        teacher.setEmployeeId("EMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        teacher.setQualification(request.getQualification());
        teacher.setSpecialization(request.getSpecialization());
        teacher.setDepartment(request.getDepartment());
        teacher.setExperience(request.getExperience());
        teacher.setOffice(request.getOffice());
        teacher.setOfficePhoneNumber(request.getOfficePhoneNumber());

        Teacher savedTeacher = teacherRepository.save(teacher);

        return new TeacherResponse(
                savedUser.getId(),
                savedTeacher.getId(),
                savedUser.getUsername(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhoneNumber(),
                teacher.getQualification(),
                teacher.getSpecialization(),
                teacher.getDepartment(),
                teacher.getExperience(),
                teacher.getOffice(),
                teacher.getOfficePhoneNumber(),
                savedUser.getRole(),
                "Teacher account created successfully"
        );
    }

    public String requestPasswordReset(PasswordResetRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User with email not found"));

        String token = UUID.randomUUID().toString();
        user.setPasswordResetToken(token);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        // TODO: send token via email (send service integration)
        return token;
    }

    public void confirmPasswordReset(PasswordResetConfirmRequest request) {
        User user = userRepository.findByPasswordResetToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired password reset token"));

        if (user.getPasswordResetTokenExpiry() == null || user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Password reset token expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);
    }

    public void ensureDefaultTeacher() {
        userRepository.findByUsername("teacher").orElseGet(() -> {
            User teacher = new User();
            teacher.setName("Default Teacher");
            teacher.setUsername("teacher");
            teacher.setPassword(passwordEncoder.encode("teacher123"));
            teacher.setRole(User.Role.TEACHER);
            return userRepository.save(teacher);
        });
    }
}
