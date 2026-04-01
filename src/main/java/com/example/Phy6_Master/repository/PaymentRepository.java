package com.example.Phy6_Master.repository;

import com.example.Phy6_Master.model.Payment;
import com.example.Phy6_Master.model.Enrollment;
import com.example.Phy6_Master.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findTopByEnrollmentOrderByPaymentDateDesc(Enrollment enrollment);
    
    // For accountant pending list
    List<Payment> findByStatusOrderByPaymentDateAsc(String status);
    
    // For accountant history list
    List<Payment> findByStatusInOrderByPaymentDateDesc(List<String> statuses);

    // For student history list
    List<Payment> findByEnrollmentStudentOrderByPaymentDateDesc(User student);
}
