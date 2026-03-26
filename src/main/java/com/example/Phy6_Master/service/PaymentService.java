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

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final EnrollmentService enrollmentService;
    private final FileStorageService fileStorageService;

    @Transactional
    public Payment processAtmTransfer(ATMTransferRequest request) {
        // 1. Create a PENDING enrollment
        Enrollment enrollment = enrollmentService.createPendingEnrollment(request.getStudentId(), request.getClassId());

        // 2. Create the SUBMITTED payment
        Payment payment = new Payment();
        payment.setEnrollment(enrollment);
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod("ATM_TRANSFER");
        payment.setStatus("SUBMITTED");
        payment.setReferenceNumber(request.getReferenceNumber());

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment processBankSlip(Long studentId, Long classId, Double amount, MultipartFile file) throws IOException {
        // 1. Store the file locally
        String filePath = fileStorageService.storeFile(file);

        // 2. Create a PENDING enrollment
        Enrollment enrollment = enrollmentService.createPendingEnrollment(studentId, classId);

        // 3. Create the SUBMITTED payment
        Payment payment = new Payment();
        payment.setEnrollment(enrollment);
        payment.setAmount(amount);
        payment.setPaymentMethod("BANK_SLIP");
        payment.setStatus("SUBMITTED");
        payment.setFilePath(filePath);

        return paymentRepository.save(payment);
    }

    public String processOnlineCheckout(Long studentId, Long classId, Double amount) {
        return "Online payment will be implemented later";
    }
}
