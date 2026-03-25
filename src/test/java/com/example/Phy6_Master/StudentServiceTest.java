package com.example.Phy6_Master.service;

import com.example.Phy6_Master.model.Course;
import com.example.Phy6_Master.model.Enrollment;
import com.example.Phy6_Master.model.LearningMaterial;
import com.example.Phy6_Master.model.User;
import com.example.Phy6_Master.repository.EnrollmentRepository;
import com.example.Phy6_Master.repository.LearningMaterialRepository;
import com.example.Phy6_Master.repository.StudentRepository;
import com.example.Phy6_Master.repository.UserRepository;
import com.example.Phy6_Master.dto.StudentProfileRequest;
import com.example.Phy6_Master.model.Student;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class StudentServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private LearningMaterialRepository learningMaterialRepository;

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentService studentService;

    @Test
    public void testGetEnrolledCourses() {
        User student = new User();
        student.setId(1L);

        Course course1 = new Course(); // id 1
        course1.setTitle("Physics 101");
        
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course1);

        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(enrollmentRepository.findByStudent(student)).thenReturn(Arrays.asList(enrollment));

        List<Course> courses = studentService.getEnrolledCourses(1L);
        assertEquals(1, courses.size());
        assertEquals("Physics 101", courses.get(0).getTitle());
    }

    @Test
    public void testGetCourseMaterials() {
        Course course = new Course();
        course.setId(1L);

        LearningMaterial material = new LearningMaterial();
        material.setTitle("Lecture 1 PDF");

        when(learningMaterialRepository.findByCourseId(1L)).thenReturn(Arrays.asList(material));

        List<LearningMaterial> materials = studentService.getCourseMaterials(1L);
        assertEquals(1, materials.size());
        assertEquals("Lecture 1 PDF", materials.get(0).getTitle());
    }

    @Test
    public void testCreateAndUpdateStudentProfile() {
        User user = new User();
        user.setId(5L);
        user.setUsername("studentx");
        user.setName("Student X");
        user.setEmail("x@example.com");

        StudentProfileRequest request = new StudentProfileRequest();
        request.setSchool("High School");
        request.setGrade("A");
        request.setAddress("123 Main St");
        request.setParentName("Parent X");
        request.setParentPhoneNumber("111222333");

        when(userRepository.findById(5L)).thenReturn(Optional.of(user));
        when(studentRepository.findByUser_Id(5L)).thenReturn(Optional.empty());

        Student savedStudent = new Student();
        savedStudent.setId(10L);
        savedStudent.setStudentId("STU-ABC12345");
        savedStudent.setUser(user);
        savedStudent.setSchool("High School");
        savedStudent.setGrade("A");
        savedStudent.setAddress("123 Main St");
        savedStudent.setParentName("Parent X");
        savedStudent.setParentPhoneNumber("111222333");

        when(studentRepository.save(any(Student.class))).thenReturn(savedStudent);

        StudentResponse created = studentService.createStudentProfile(5L, request);
        assertEquals("High School", created.getSchool());
        assertEquals("Student profile created", created.getMessage());

        // prepare existing student for update
        when(studentRepository.findByStudentId(savedStudent.getStudentId())).thenReturn(Optional.of(savedStudent));

        StudentProfileRequest updateRequest = new StudentProfileRequest();
        updateRequest.setAddress("456 Elm St");

        when(studentRepository.save(any(Student.class))).thenAnswer(i -> i.getArgument(0));

        StudentResponse updated = studentService.updateStudentProfile(savedStudent.getStudentId(), updateRequest);
        assertEquals("456 Elm St", updated.getAddress());
        assertEquals("Student profile updated", updated.getMessage());
    }
}
