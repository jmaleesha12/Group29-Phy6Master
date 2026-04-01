package com.example.Phy6_Master.service;

import com.example.Phy6_Master.dto.AccountantPaymentDetailResponseDTO;
import com.example.Phy6_Master.dto.PaymentPendingListResponseDTO;
import com.example.Phy6_Master.model.Enrollment;
import com.example.Phy6_Master.model.Payment;
import com.example.Phy6_Master.repository.PaymentRepository;
import com.example.Phy6_Master.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountantPaymentService {

    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public List<PaymentPendingListResponseDTO> getPendingPayments() {
        return paymentRepository.findByStatusOrderByPaymentDateAsc("SUBMITTED")
                .stream()
                .map(payment -> {
                    String studentName = payment.getEnrollment() != null && payment.getEnrollment().getStudent() != null
                            ? payment.getEnrollment().getStudent().getName()
                            : "Unknown";
                    String courseName = payment.getEnrollment() != null && payment.getEnrollment().getCourse() != null
                            ? payment.getEnrollment().getCourse().getTitle()
                            : "Unknown";

                    return new PaymentPendingListResponseDTO(
                            payment.getId(),
                            studentName,
                            courseName,
                            payment.getPaymentMethod(),
                            payment.getPaymentDate());
                }).collect(Collectors.toList());
    }

    public AccountantPaymentDetailResponseDTO getPaymentDetail(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        AccountantPaymentDetailResponseDTO dto = new AccountantPaymentDetailResponseDTO();
        dto.setId(payment.getId());
        dto.setAmount(payment.getAmount());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setReferenceNumber(payment.getReferenceNumber());
        dto.setSubmissionDate(payment.getPaymentDate());
        dto.setProofFilePath(payment.getFilePath());
        dto.setHasProof(payment.getFilePath() != null && !payment.getFilePath().trim().isEmpty());

        Enrollment enrollment = payment.getEnrollment();
        if (enrollment != null) {
            if (enrollment.getStudent() != null) {
                dto.setStudentName(enrollment.getStudent().getName());
                dto.setStudentEmail(enrollment.getStudent().getEmail());
            }
            if (enrollment.getCourse() != null) {
                dto.setCourseName(enrollment.getCourse().getTitle());
            }
        }
        return dto;
    }

    @Transactional
    public void approvePayment(Long paymentId, Long accountantId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        if (!"SUBMITTED".equals(payment.getStatus())) {
            throw new IllegalStateException("Payment has already been actioned");
        }

        payment.setStatus("APPROVED");
        payment.setVerifiedAt(LocalDateTime.now());

        if (accountantId != null) {
            userRepository.findById(accountantId).ifPresent(payment::setVerifiedBy);
        }

        Enrollment enrollment = payment.getEnrollment();
        if (enrollment != null) {
            enrollment.setStatus("APPROVED");
            if (enrollment.getStudent() != null) {
                notificationService.createPaymentNotification(
                        enrollment.getStudent(),
                        payment,
                        enrollment.getCourse() != null ? enrollment.getCourse().getTitle() : "Your Class",
                        true);
            }
        }
        paymentRepository.save(payment);
    }

    @Transactional
    public void rejectPayment(Long paymentId, String rejectionReason, Long accountantId) {
        if (rejectionReason == null || rejectionReason.trim().isEmpty()) {
            throw new IllegalArgumentException("Rejection reason is required");
        }

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        if (!"SUBMITTED".equals(payment.getStatus())) {
            throw new IllegalStateException("Payment has already been actioned");
        }

        payment.setStatus("REJECTED");
        payment.setRejectionReason(rejectionReason);
        payment.setVerifiedAt(LocalDateTime.now());

        if (accountantId != null) {
            userRepository.findById(accountantId).ifPresent(payment::setVerifiedBy);
        }

        Enrollment enrollment = payment.getEnrollment();
        if (enrollment != null) {
            // Keep enrollment pending or reject it. Convention: REJECTED so they must
            // request again.
            enrollment.setStatus("REJECTED");
            if (enrollment.getStudent() != null) {
                notificationService.createPaymentNotification(
                        enrollment.getStudent(),
                        payment,
                        enrollment.getCourse() != null ? enrollment.getCourse().getTitle() : "Your Class",
                        false);
            }
        }
        paymentRepository.save(payment);
    }

    public List<com.example.Phy6_Master.dto.AccountantPaymentHistoryResponseDTO> searchPayments(String status, String keyword) {
        List<Payment> all;
        if (status != null && !status.isEmpty()) {
            all = paymentRepository.findByStatusOrderByPaymentDateAsc(status);
        } else {
            all = paymentRepository.findAll(); // simplified for now
        }
        
        return all.stream()
            .filter(p -> {
                if (keyword == null || keyword.isEmpty()) return true;
                String lower = keyword.toLowerCase();
                String sName = (p.getEnrollment() != null && p.getEnrollment().getStudent() != null) ? p.getEnrollment().getStudent().getName().toLowerCase() : "";
                String cName = (p.getEnrollment() != null && p.getEnrollment().getCourse() != null) ? p.getEnrollment().getCourse().getTitle().toLowerCase() : "";
                String ref = p.getReferenceNumber() != null ? p.getReferenceNumber().toLowerCase() : "";
                return sName.contains(lower) || cName.contains(lower) || ref.contains(lower);
            })
            .sorted((p1, p2) -> p2.getPaymentDate().compareTo(p1.getPaymentDate()))
            .map(p -> new com.example.Phy6_Master.dto.AccountantPaymentHistoryResponseDTO(
                    p.getId(),
                    p.getEnrollment() != null && p.getEnrollment().getStudent() != null ? p.getEnrollment().getStudent().getId() : null,
                    p.getEnrollment() != null && p.getEnrollment().getStudent() != null ? p.getEnrollment().getStudent().getName() : "Unknown",
                    p.getEnrollment() != null && p.getEnrollment().getCourse() != null ? p.getEnrollment().getCourse().getId() : null,
                    p.getEnrollment() != null && p.getEnrollment().getCourse() != null ? p.getEnrollment().getCourse().getTitle() : "Unknown",
                    p.getAmount(),
                    p.getPaymentMethod(),
                    p.getReferenceNumber(),
                    p.getStatus(),
                    p.getVerifiedBy() != null ? p.getVerifiedBy().getName() : null,
                    p.getPaymentDate(),
                    p.getVerifiedAt(),
                    p.getRejectionReason()
            )).collect(Collectors.toList());
    }
}
