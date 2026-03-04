package com.example.Phy6_Master.repository;

import com.example.Phy6_Master.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByAudienceIn(List<String> audiences);
}
