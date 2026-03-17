package com.example.Phy6_Master.service;

import com.example.Phy6_Master.dto.AnnouncementResponse;
import com.example.Phy6_Master.model.Announcement;
import com.example.Phy6_Master.model.Course;
import com.example.Phy6_Master.model.User;
import com.example.Phy6_Master.repository.AnnouncementRepository;
import com.example.Phy6_Master.repository.CourseRepository;
import com.example.Phy6_Master.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    public AnnouncementResponse createAnnouncement(Long courseId, Long teacherId, String title, String content) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        if (!course.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("Teacher can only create announcements for their own courses");
        }

        Announcement announcement = new Announcement();
        announcement.setTitle(title);
        announcement.setContent(content);
        announcement.setCourse(course);
        announcement.setTeacher(teacher);

        Announcement saved = announcementRepository.save(announcement);
        return new AnnouncementResponse(saved);
    }

    public List<AnnouncementResponse> getAnnouncementsByCourse(Long courseId) {
        return announcementRepository.findByCourseIdOrderByCreatedAtDesc(courseId)
                .stream()
                .map(AnnouncementResponse::new)
                .collect(Collectors.toList());
    }

    public List<AnnouncementResponse> getAnnouncementsByTeacher(Long teacherId) {
        return announcementRepository.findByTeacherIdOrderByCreatedAtDesc(teacherId)
                .stream()
                .map(AnnouncementResponse::new)
                .collect(Collectors.toList());
    }
    
    public List<AnnouncementResponse> getAnnouncementsForStudent(Long userId) {
        return announcementRepository.findByEnrolledCourses(userId)
                .stream()
                .map(AnnouncementResponse::new)
                .collect(Collectors.toList());
    }

    public AnnouncementResponse updateAnnouncement(Long announcementId, Long teacherId, String title, String content) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        if (!announcement.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("You can only update your own announcements");
        }

        announcement.setTitle(title);
        announcement.setContent(content);

        Announcement updated = announcementRepository.save(announcement);
        return new AnnouncementResponse(updated);
    }
  
    public void deleteAnnouncement(Long announcementId, Long teacherId) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        if (!announcement.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("You can only delete your own announcements");
        }

        announcementRepository.delete(announcement);
    }

    public AnnouncementResponse getAnnouncementById(Long announcementId) {
        return announcementRepository.findById(announcementId)
                .map(AnnouncementResponse::new)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));
    }
}
