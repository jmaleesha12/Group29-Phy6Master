package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.dto.ATMTransferRequest;
import com.example.Phy6_Master.dto.PaymentResponseDTO;
import com.example.Phy6_Master.model.Payment;
import com.example.Phy6_Master.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/student/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/atm-transfer")
    public ResponseEntity<PaymentResponseDTO> submitAtmTransfer(@RequestBody ATMTransferRequest request) {
        try {
            if (request.getClassId() == null || request.getStudentId() == null || request.getAmount() == null) {
                return ResponseEntity.badRequest()
                        .body(new PaymentResponseDTO(false, "Required fields missing", null, null));
            }

            Payment payment = paymentService.processAtmTransfer(request);
            return ResponseEntity.ok(new PaymentResponseDTO(true, "ATM Transfer submitted successfully",
                    payment.getId(), payment.getEnrollment().getId()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new PaymentResponseDTO(false, e.getMessage(), null, null));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new PaymentResponseDTO(false,
                            "A payment request already exists for this class. Please wait for verification.", null,
                            null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new PaymentResponseDTO(false, e.getMessage(), null, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new PaymentResponseDTO(false, "An error occurred", null, null));
        }
    }

    @PostMapping("/bank-slip")
    public ResponseEntity<PaymentResponseDTO> submitBankSlip(
            @RequestParam("classId") Long classId,
            @RequestParam("studentId") Long studentId,
            @RequestParam("amount") Double amount,
            @RequestParam("file") MultipartFile file) {
        try {
            if (classId == null || studentId == null || amount == null || file == null || file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new PaymentResponseDTO(false, "Required fields missing or file invalid", null, null));
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !(contentType.equals("image/jpeg") || contentType.equals("image/png")
                    || contentType.equals("application/pdf"))) {
                return ResponseEntity.badRequest().body(new PaymentResponseDTO(false,
                        "Invalid file format. Only JPG, PNG, or PDF allowed.", null, null));
            }

            // Validate file size (Max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(new PaymentResponseDTO(false, "File too large. Max 5MB allowed.", null, null));
            }

            Payment payment = paymentService.processBankSlip(studentId, classId, amount, file);
            return ResponseEntity.ok(new PaymentResponseDTO(true, "Bank slip uploaded successfully", payment.getId(),
                    payment.getEnrollment().getId()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new PaymentResponseDTO(false, e.getMessage(), null, null));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new PaymentResponseDTO(false,
                            "A payment request already exists for this class. Please wait for verification.", null,
                            null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new PaymentResponseDTO(false, e.getMessage(), null, null));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new PaymentResponseDTO(false, "Failed to store file", null, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new PaymentResponseDTO(false, "An error occurred", null, null));
        }
    }

    @PostMapping("/online/checkout")
    public ResponseEntity<PaymentResponseDTO> submitOnlinePayment(
            @RequestParam("classId") Long classId,
            @RequestParam("studentId") Long studentId,
            @RequestParam("amount") Double amount) {

        String message = paymentService.processOnlineCheckout(studentId, classId, amount);
        return ResponseEntity.ok(new PaymentResponseDTO(true, message, null, null));
    }

    @GetMapping("/history/{studentId}")
    public ResponseEntity<java.util.List<com.example.Phy6_Master.dto.PaymentHistoryResponseDTO>> getPaymentHistory(@PathVariable Long studentId) {
        return ResponseEntity.ok(paymentService.getPaymentHistory(studentId));
    }
}
