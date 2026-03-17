package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.dto.AnnouncementResponse;
import com.example.Phy6_Master.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    // Create announcement
    @PostMapping
    public ResponseEntity<?> createAnnouncement(@RequestBody Map<String, Object> request) {
        try {
            Long courseId = ((Number) request.get("courseId")).longValue();
            Long teacherId = ((Number) request.get("teacherId")).longValue();
            String title = (String) request.get("title");
            String content = (String) request.get("content");

            AnnouncementResponse response = announcementService.createAnnouncement(courseId, teacherId, title, content);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Get announcements for a specific course
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<AnnouncementResponse>> getAnnouncementsByCourse(@PathVariable Long courseId) {
        List<AnnouncementResponse> announcements = announcementService.getAnnouncementsByCourse(courseId);
        return ResponseEntity.ok(announcements);
    }

    // Get announcements for teacher's courses
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<AnnouncementResponse>> getAnnouncementsByTeacher(@PathVariable Long teacherId) {
        List<AnnouncementResponse> announcements = announcementService.getAnnouncementsByTeacher(teacherId);
        return ResponseEntity.ok(announcements);
    }

    // Get announcements for student's enrolled courses
    @GetMapping("/student/{userId}")
    public ResponseEntity<List<AnnouncementResponse>> getAnnouncementsForStudent(@PathVariable Long userId) {
        List<AnnouncementResponse> announcements = announcementService.getAnnouncementsForStudent(userId);
        return ResponseEntity.ok(announcements);
    }

    // Get single announcement
    @GetMapping("/{id}")
    public ResponseEntity<?> getAnnouncementById(@PathVariable Long id) {
        try {
            AnnouncementResponse announcement = announcementService.getAnnouncementById(id);
            return ResponseEntity.ok(announcement);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    // Update announcement
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAnnouncement(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Long teacherId = ((Number) request.get("teacherId")).longValue();
            String title = (String) request.get("title");
            String content = (String) request.get("content");

            AnnouncementResponse response = announcementService.updateAnnouncement(id, teacherId, title, content);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Delete announcement
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id, @RequestParam Long teacherId) {
        try {
            announcementService.deleteAnnouncement(id, teacherId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
