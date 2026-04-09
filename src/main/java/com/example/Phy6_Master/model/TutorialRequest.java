package com.example.Phy6_Master.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tutorial_requests")
public class TutorialRequest {

    public enum RequestStatus {
        PENDING,
        ACCEPTED,
        DECLINED,
        DELIVERED
    }

    public enum PaymentStatus {
        PAID,
        NOT_PAID
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String course;

    @Column(nullable = false)
    private String requiredTutorial;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.NOT_PAID;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus requestStatus = RequestStatus.PENDING;

    // Track if student has been notified about status change
    private Boolean studentNotified = false;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.paymentStatus == null) {
            this.paymentStatus = PaymentStatus.NOT_PAID;
        }
        if (this.requestStatus == null) {
            this.requestStatus = RequestStatus.PENDING;
        }
        if (this.studentNotified == null) {
            this.studentNotified = false;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
