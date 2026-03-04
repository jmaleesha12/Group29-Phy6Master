package com.example.Phy6_Master.repository;

import com.example.Phy6_Master.model.ChatConversation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatConversationRepository extends JpaRepository<ChatConversation, Long> {
}
