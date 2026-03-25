package com.example.Phy6_Master.service;

import com.example.Phy6_Master.dto.StudentProfileRequest;
import com.example.Phy6_Master.dto.StudentResponse;
import com.example.Phy6_Master.model.Course;
import com.example.Phy6_Master.model.Enrollment;
import com.example.Phy6_Master.model.LearningMaterial;
import com.example.Phy6_Master.model.Student;
import com.example.Phy6_Master.model.User;
import com.example.Phy6_Master.repository.EnrollmentRepository;
import com.example.Phy6_Master.repository.LearningMaterialRepository;
import com.example.Phy6_Master.repository.StudentRepository;
import com.example.Phy6_Master.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private LearningMaterialRepository learningMaterialRepository;

    public List<Course> getEnrolledCourses(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Enrollment> enrollments = enrollmentRepository.findByStudent(student);
        return enrollments.stream()
                .map(Enrollment::getCourse)
                .collect(Collectors.toList());
    }

    public List<LearningMaterial> getCourseMaterials(Long courseId) {
        // ideally check if student is enrolled in this course
        return learningMaterialRepository.findByCourseId(courseId);
    }

    public StudentResponse getStudentProfileByStudentId(String studentId) {
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        User user = student.getUser();
        return new StudentResponse(
                user.getId(),
                student.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNumber(),
                student.getSchool(),
                student.getGrade(),
                student.getAddress(),
                student.getParentName(),
                student.getParentPhoneNumber(),
                user.getRole(),
                "Student profile fetched"
        );
    }

    public StudentResponse updateStudentProfile(String studentId, StudentProfileRequest request) {
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (request.getSchool() != null) student.setSchool(request.getSchool());
        if (request.getGrade() != null) student.setGrade(request.getGrade());
        if (request.getAddress() != null) student.setAddress(request.getAddress());
        if (request.getParentName() != null) student.setParentName(request.getParentName());
        if (request.getParentPhoneNumber() != null) student.setParentPhoneNumber(request.getParentPhoneNumber());
        if (request.getBatch() != null) student.setBatch(request.getBatch());
        if (request.getEnrollmentNumber() != null) student.setEnrollmentNumber(request.getEnrollmentNumber());

        Student updatedStudent = studentRepository.save(student);

        User user = updatedStudent.getUser();
        return new StudentResponse(
                user.getId(),
                updatedStudent.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNumber(),
                updatedStudent.getSchool(),
                updatedStudent.getGrade(),
                updatedStudent.getAddress(),
                updatedStudent.getParentName(),
                updatedStudent.getParentPhoneNumber(),
                user.getRole(),
                "Student profile updated"
        );
    }

    public StudentResponse createStudentProfile(Long userId, StudentProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (studentRepository.findByUser_Id(userId).isPresent()) {
            throw new IllegalArgumentException("Student profile already exists for user");
        }

        Student student = new Student();
        student.setUser(user);
        student.setStudentId("STU-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        student.setSchool(request.getSchool());
        student.setGrade(request.getGrade());
        student.setAddress(request.getAddress());
        student.setParentName(request.getParentName());
        student.setParentPhoneNumber(request.getParentPhoneNumber());
        student.setBatch(request.getBatch());
        student.setEnrollmentNumber(request.getEnrollmentNumber());

        Student savedStudent = studentRepository.save(student);

        return new StudentResponse(
                user.getId(),
                savedStudent.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNumber(),
                savedStudent.getSchool(),
                savedStudent.getGrade(),
                savedStudent.getAddress(),
                savedStudent.getParentName(),
                savedStudent.getParentPhoneNumber(),
                user.getRole(),
                "Student profile created"
        );
    }
}

