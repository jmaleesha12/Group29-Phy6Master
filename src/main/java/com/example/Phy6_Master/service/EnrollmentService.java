package com.example.Phy6_Master.service;

import com.example.Phy6_Master.model.Course;
import com.example.Phy6_Master.model.Enrollment;
import com.example.Phy6_Master.model.Student;
import com.example.Phy6_Master.model.User;
import com.example.Phy6_Master.repository.CourseRepository;
import com.example.Phy6_Master.repository.EnrollmentRepository;
import com.example.Phy6_Master.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final com.example.Phy6_Master.repository.UserRepository userRepository;

    public Enrollment createPendingEnrollment(Long studentId, Long courseId) {
        Student studentEntity = studentRepository.findByUser_Id(studentId)
                .orElseGet(() -> {
                    User u = userRepository.findById(studentId)
                            .orElseThrow(() -> new IllegalArgumentException("User not found"));
                    Student s = new Student();
                    s.setUser(u);
                    s.setStudentId("STU-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                    return studentRepository.save(s);
                });
        User user = studentEntity.getUser();

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        if (enrollmentRepository.existsByStudentAndCourseAndStatus(user, course, "PENDING")) {
            throw new IllegalStateException("A pending enrollment already exists for this class");
        }

        if (enrollmentRepository.existsByStudentAndCourseAndStatus(user, course, "APPROVED")) {
            throw new IllegalStateException("Student is already enrolled in this class");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(user);
        enrollment.setCourse(course);
        enrollment.setStatus("PENDING");

        return enrollmentRepository.save(enrollment);
    }
}
