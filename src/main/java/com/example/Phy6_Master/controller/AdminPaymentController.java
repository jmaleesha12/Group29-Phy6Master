package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
public class AdminPaymentController {

    private final PaymentService paymentService;

    @PostMapping("/{paymentId}/approve")
    public ResponseEntity<?> approvePayment(@PathVariable Long paymentId) {
        try {
            paymentService.approvePayment(paymentId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Payment approved successfully"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", ex.getMessage()));
        }
    }

    @PostMapping("/{paymentId}/reject")
    public ResponseEntity<?> rejectPayment(@PathVariable Long paymentId) {
        try {
            paymentService.rejectPayment(paymentId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Payment rejected successfully"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", ex.getMessage()));
        }
    }
}
