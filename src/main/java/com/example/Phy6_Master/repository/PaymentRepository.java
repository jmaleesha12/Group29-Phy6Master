package com.example.Phy6_Master.repository;

import com.example.Phy6_Master.model.Payment;
import com.example.Phy6_Master.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByEnrollment(Enrollment enrollment);
}
