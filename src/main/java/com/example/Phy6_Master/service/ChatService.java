package com.example.Phy6_Master.service;

import com.example.Phy6_Master.model.ChatConversation;
import com.example.Phy6_Master.model.ChatMessage;
import com.example.Phy6_Master.repository.ChatConversationRepository;
import com.example.Phy6_Master.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {
    private final ChatConversationRepository convRepo;
    private final ChatMessageRepository msgRepo;

    public ChatService(ChatConversationRepository convRepo, ChatMessageRepository msgRepo) {
        this.convRepo = convRepo;
        this.msgRepo = msgRepo;
    }

    public ChatConversation createConversation(ChatConversation c) { return convRepo.save(c); }
    public List<ChatConversation> listConversations() { return convRepo.findAll(); }

    public ChatMessage sendMessage(ChatMessage m) { return msgRepo.save(m); }
    public List<ChatMessage> getMessages(Long conversationId) { return msgRepo.findByConversationId(conversationId); }
}
