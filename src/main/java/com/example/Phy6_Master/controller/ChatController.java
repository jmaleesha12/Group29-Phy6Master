package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.model.ChatConversation;
import com.example.Phy6_Master.model.ChatMessage;
import com.example.Phy6_Master.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/conversations")
    public ResponseEntity<ChatConversation> createConversation(@RequestBody ChatConversation c) {
        return ResponseEntity.ok(chatService.createConversation(c));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ChatConversation>> list() {
        return ResponseEntity.ok(chatService.listConversations());
    }

    @PostMapping("/messages")
    public ResponseEntity<ChatMessage> send(@RequestBody ChatMessage m) {
        return ResponseEntity.ok(chatService.sendMessage(m));
    }

    @GetMapping("/messages/{conversationId}")
    public ResponseEntity<List<ChatMessage>> messages(@PathVariable Long conversationId) {
        return ResponseEntity.ok(chatService.getMessages(conversationId));
    }
}
