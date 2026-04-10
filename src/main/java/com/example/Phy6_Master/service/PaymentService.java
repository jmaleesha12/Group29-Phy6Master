package com.example.Phy6_Master.service;

import com.example.Phy6_Master.dto.ATMTransferRequest;
import com.example.Phy6_Master.model.Enrollment;
import com.example.Phy6_Master.model.Payment;
import com.example.Phy6_Master.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final EnrollmentService enrollmentService;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;

    @Transactional
    public Payment processAtmTransfer(ATMTransferRequest request) {
        // 1. Fetch or Create Enrollment
        Enrollment enrollment = enrollmentService.createPendingEnrollment(request.getStudentId(), request.getClassId());
        
        if ("ACTIVE".equalsIgnoreCase(enrollment.getStatus()) || "APPROVED".equalsIgnoreCase(enrollment.getStatus())) {
            throw new IllegalStateException("Duplicate prevented: You already have an active enrollment for this class.");
        }
        
        Optional<Payment> existingPendingPayment = paymentRepository.findTopByEnrollmentOrderByPaymentDateDesc(enrollment);
        if (existingPendingPayment.isPresent() && "SUBMITTED".equalsIgnoreCase(existingPendingPayment.get().getStatus())) {
            throw new IllegalStateException("Duplicate prevented: You already have a pending payment waiting for verification.");
        }

        // Set status to PAYMENT_SUBMITTED indicating payment is undergoing verification
        enrollment.setStatus("PAYMENT_SUBMITTED");

        // Reuse the same payment row for this enrollment when it already exists
        // (schema may enforce unique enrollment_id in payments).
        Payment payment = existingPendingPayment.orElseGet(Payment::new);
        payment.setEnrollment(enrollment);
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod("ATM_TRANSFER");
        payment.setStatus("SUBMITTED");
        payment.setReferenceNumber(request.getReferenceNumber());
        payment.setFilePath(null);
        payment.setRejectionReason(null);
        payment.setVerifiedAt(null);
        payment.setVerifiedBy(null);
        payment.setPaymentDate(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment processBankSlip(Long studentId, Long classId, Double amount, MultipartFile file) throws IOException {
        // 1. Fetch or Create Enrollment
        Enrollment enrollment = enrollmentService.createPendingEnrollment(studentId, classId);

        if ("ACTIVE".equalsIgnoreCase(enrollment.getStatus()) || "APPROVED".equalsIgnoreCase(enrollment.getStatus())) {
            throw new IllegalStateException("Duplicate prevented: You already have an active enrollment for this class.");
        }
        
        Optional<Payment> existingPendingPayment = paymentRepository.findTopByEnrollmentOrderByPaymentDateDesc(enrollment);
        if (existingPendingPayment.isPresent() && "SUBMITTED".equalsIgnoreCase(existingPendingPayment.get().getStatus())) {
            throw new IllegalStateException("Duplicate prevented: You already have a pending payment waiting for verification.");
        }

        // Set status to PAYMENT_SUBMITTED indicating payment is undergoing verification
        enrollment.setStatus("PAYMENT_SUBMITTED");

        // 2. Store the file locally
        String filePath = fileStorageService.storeFile(file);

        // Reuse the same payment row for this enrollment when it already exists
        // (schema may enforce unique enrollment_id in payments).
        Payment payment = existingPendingPayment.orElseGet(Payment::new);
        payment.setEnrollment(enrollment);
        payment.setAmount(amount);
        payment.setPaymentMethod("BANK_SLIP_UPLOAD");
        payment.setStatus("SUBMITTED");
        payment.setFilePath(filePath);
        payment.setReferenceNumber(null);
        payment.setRejectionReason(null);
        payment.setVerifiedAt(null);
        payment.setVerifiedBy(null);
        payment.setPaymentDate(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    public String processOnlineCheckout(Long studentId, Long classId, Double amount) {
        return "Online payment will be implemented later";
    }

    @Transactional
    public Payment approvePayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        payment.setStatus("APPROVED");
        payment.setVerifiedAt(LocalDateTime.now());
        
        Enrollment enrollment = payment.getEnrollment();
        if (enrollment != null) {
            enrollment.setStatus("ACTIVE"); // Change from APPROVED to ACTIVE for consistency
            if (enrollment.getStudent() != null) {
                notificationService.createPaymentNotification(
                        enrollment.getStudent(),
                        payment,
                        enrollment.getCourse() != null ? enrollment.getCourse().getTitle() : "Your Class",
                        true);
            }
        }
        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment rejectPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        payment.setStatus("REJECTED");
        
        Enrollment enrollment = payment.getEnrollment();
        if (enrollment != null) {
            enrollment.setStatus("REJECTED");
            if (enrollment.getStudent() != null) {
                notificationService.createPaymentNotification(
                        enrollment.getStudent(),
                        payment,
                        enrollment.getCourse() != null ? enrollment.getCourse().getTitle() : "Your Class",
                        false);
            }
        }
        return paymentRepository.save(payment);
    }

    public java.util.List<com.example.Phy6_Master.dto.PaymentHistoryResponseDTO> getPaymentHistory(Long studentId) {
        com.example.Phy6_Master.model.User student = new com.example.Phy6_Master.model.User();
        student.setId(studentId);
        
        return paymentRepository.findByEnrollmentStudentOrderByPaymentDateDesc(student)
                .stream()
                .map(p -> new com.example.Phy6_Master.dto.PaymentHistoryResponseDTO(
                        p.getId(),
                        p.getEnrollment() != null && p.getEnrollment().getCourse() != null ? p.getEnrollment().getCourse().getId() : null,
                        p.getEnrollment() != null && p.getEnrollment().getCourse() != null ? p.getEnrollment().getCourse().getTitle() : "Unknown",
                        p.getAmount(),
                        p.getPaymentMethod(),
                        p.getStatus(),
                        p.getPaymentDate(),
                        p.getVerifiedAt(),
                        p.getRejectionReason()
                )).collect(java.util.stream.Collectors.toList());
    }
}
