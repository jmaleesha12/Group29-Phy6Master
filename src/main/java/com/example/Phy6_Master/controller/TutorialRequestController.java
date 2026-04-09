package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.dto.CreateTutorialRequestDTO;
import com.example.Phy6_Master.dto.TutorialRequestResponse;
import com.example.Phy6_Master.model.TutorialRequest.PaymentStatus;
import com.example.Phy6_Master.service.TutorialRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tutorial-requests")
public class TutorialRequestController {

    @Autowired
    private TutorialRequestService tutorialRequestService;

    // Get all pending requests (for incoming queue - oldest first)
    @GetMapping("/pending")
    public ResponseEntity<List<TutorialRequestResponse>> getPendingRequests() {
        List<TutorialRequestResponse> requests = tutorialRequestService.getPendingRequests();
        return ResponseEntity.ok(requests);
    }

    // Get all active (accepted) requests
    @GetMapping("/active")
    public ResponseEntity<List<TutorialRequestResponse>> getActiveRequests() {
        List<TutorialRequestResponse> requests = tutorialRequestService.getActiveRequests();
        return ResponseEntity.ok(requests);
    }

    // Get all requests
    @GetMapping
    public ResponseEntity<List<TutorialRequestResponse>> getAllRequests() {
        List<TutorialRequestResponse> requests = tutorialRequestService.getAllRequests();
        return ResponseEntity.ok(requests);
    }

    // Get a single request by ID
    @GetMapping("/{id}")
    public ResponseEntity<TutorialRequestResponse> getRequestById(@PathVariable Long id) {
        try {
            TutorialRequestResponse request = tutorialRequestService.getRequestById(id);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new tutorial request
    @PostMapping
    public ResponseEntity<TutorialRequestResponse> createRequest(@Valid @RequestBody CreateTutorialRequestDTO dto) {
        try {
            TutorialRequestResponse request = tutorialRequestService.createRequest(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(request);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }


    // Update payment status
    @PatchMapping("/{id}/payment-status")
    public ResponseEntity<TutorialRequestResponse> updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            PaymentStatus status = PaymentStatus.valueOf(body.get("paymentStatus"));
            TutorialRequestResponse request = tutorialRequestService.updatePaymentStatus(id, status);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}