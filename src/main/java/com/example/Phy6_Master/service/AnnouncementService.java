package com.example.Phy6_Master.service;

import com.example.Phy6_Master.model.Announcement;
import com.example.Phy6_Master.repository.AnnouncementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnouncementService {
    private final AnnouncementRepository announcementRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    public List<Announcement> getAnnouncementsForRole(String role) {
        // include ALL and specific role
        return announcementRepository.findByAudienceIn(List.of("ALL", role));
    }

    public Announcement createAnnouncement(Announcement a) {
        return announcementRepository.save(a);
    }
}
