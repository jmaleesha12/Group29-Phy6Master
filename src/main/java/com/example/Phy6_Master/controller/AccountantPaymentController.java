package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.dto.AccountantPaymentDetailResponseDTO;
import com.example.Phy6_Master.dto.PaymentPendingListResponseDTO;
import com.example.Phy6_Master.dto.PaymentRejectionRequestDTO;
import com.example.Phy6_Master.service.AccountantPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accountant/payments")
@RequiredArgsConstructor
public class AccountantPaymentController {

    private final AccountantPaymentService accountantPaymentService;

    @GetMapping("/pending")
    public ResponseEntity<List<PaymentPendingListResponseDTO>> getPendingPayments() {
        return ResponseEntity.ok(accountantPaymentService.getPendingPayments());
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<AccountantPaymentDetailResponseDTO> getPaymentDetail(@PathVariable Long paymentId) {
        return ResponseEntity.ok(accountantPaymentService.getPaymentDetail(paymentId));
    }

    @PostMapping("/{paymentId}/approve")
    public ResponseEntity<?> approvePayment(@PathVariable Long paymentId,
            @RequestParam(required = false) Long accountantId) {
        try {
            accountantPaymentService.approvePayment(paymentId, accountantId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Payment approved successfully"));
        } catch (IllegalStateException | IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", ex.getMessage()));
        }
    }

    @PostMapping("/{paymentId}/reject")
    public ResponseEntity<Void> rejectPayment(
            @PathVariable Long paymentId,
            @RequestBody PaymentRejectionRequestDTO requestDTO) {
        accountantPaymentService.rejectPayment(paymentId, requestDTO.getRejectionReason(), null);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/history")
    public ResponseEntity<java.util.List<com.example.Phy6_Master.dto.AccountantPaymentHistoryResponseDTO>> getPaymentHistory() {
        return ResponseEntity.ok(accountantPaymentService.searchPayments(null, null));
    }

    @GetMapping("/search")
    public ResponseEntity<java.util.List<com.example.Phy6_Master.dto.AccountantPaymentHistoryResponseDTO>> searchPayments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(accountantPaymentService.searchPayments(status, keyword));
    }
}
