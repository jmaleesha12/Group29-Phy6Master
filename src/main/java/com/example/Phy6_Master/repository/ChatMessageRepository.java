package com.example.Phy6_Master.repository;

import com.example.Phy6_Master.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByConversationId(Long conversationId);
}
