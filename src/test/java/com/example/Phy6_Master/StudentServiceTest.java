package com.example.Phy6_Master.service;

import com.example.Phy6_Master.model.Course;
import com.example.Phy6_Master.model.Enrollment;
import com.example.Phy6_Master.model.LearningMaterial;
import com.example.Phy6_Master.model.User;
import com.example.Phy6_Master.repository.EnrollmentRepository;
import com.example.Phy6_Master.repository.LearningMaterialRepository;
import com.example.Phy6_Master.repository.UserRepository;
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
        
        // Mocking behavior: when finding by any course (or specific if equals implemented), return list
        when(learningMaterialRepository.findByCourse(any(Course.class))).thenReturn(Arrays.asList(material));

        List<LearningMaterial> materials = studentService.getCourseMaterials(1L);
        assertEquals(1, materials.size());
        assertEquals("Lecture 1 PDF", materials.get(0).getTitle());
    }
}
