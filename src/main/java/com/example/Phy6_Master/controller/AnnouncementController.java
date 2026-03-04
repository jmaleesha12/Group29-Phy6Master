package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.model.Announcement;
import com.example.Phy6_Master.service.AnnouncementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/announcements")
public class AnnouncementController {
    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    public ResponseEntity<List<Announcement>> getForRole(@RequestParam(defaultValue = "STUDENT") String role) {
        return ResponseEntity.ok(announcementService.getAnnouncementsForRole(role));
    }

    @PostMapping
    public ResponseEntity<Announcement> create(@RequestBody Announcement a) {
        return ResponseEntity.ok(announcementService.createAnnouncement(a));
    }
}
