package com.example.Phy6_Master.service;

import com.example.Phy6_Master.model.*;
import com.example.Phy6_Master.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private LearningMaterialRepository learningMaterialRepository;

    @Autowired
    private com.example.Phy6_Master.repository.StudentRepository studentRepository;

    // Existing methods
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

    // New role-based methods
    public Optional<Student> getStudentByUserId(Long userId) {
        return studentRepository.findByUser_Id(userId);
    }

    public Optional<Student> getStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId);
    }

    public Optional<Student> getStudentByEnrollmentNumber(String enrollmentNumber) {
        return studentRepository.findByEnrollmentNumber(enrollmentNumber);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student updateStudentProfile(Long userId, Student studentDetails) {
        Optional<Student> student = studentRepository.findByUser_Id(userId);

        if (!student.isPresent()) {
            throw new IllegalArgumentException("Student not found for user ID: " + userId);
        }

        Student existingStudent = student.get();

        if (studentDetails.getEnrollmentNumber() != null) {
            existingStudent.setEnrollmentNumber(studentDetails.getEnrollmentNumber());
        }
        if (studentDetails.getSchool() != null) {
            existingStudent.setSchool(studentDetails.getSchool());
        }
        if (studentDetails.getGrade() != null) {
            existingStudent.setGrade(studentDetails.getGrade());
        }
        if (studentDetails.getAddress() != null) {
            existingStudent.setAddress(studentDetails.getAddress());
        }
        if (studentDetails.getParentName() != null) {
            existingStudent.setParentName(studentDetails.getParentName());
        }
        if (studentDetails.getParentPhoneNumber() != null) {
            existingStudent.setParentPhoneNumber(studentDetails.getParentPhoneNumber());
        }

        return studentRepository.save(existingStudent);
    }

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public void deleteStudent(Long studentId) {
        studentRepository.deleteById(studentId);
    }
}
