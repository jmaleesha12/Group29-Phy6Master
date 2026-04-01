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
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    private Double amount;

    private String paymentMethod; // ATM_TRANSFER, BANK_SLIP, ONLINE

    private String status; // SUBMITTED

    private String filePath; // For bank slips

    private String referenceNumber; // For ATM transfers

    private LocalDateTime paymentDate;

    @Column(length = 1000)
    private String rejectionReason;

    private LocalDateTime verifiedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by_id")
    private User verifiedBy;

    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.List<Notification> notifications;

    @PrePersist
    protected void onCreate() {
        paymentDate = LocalDateTime.now();
    }
}
