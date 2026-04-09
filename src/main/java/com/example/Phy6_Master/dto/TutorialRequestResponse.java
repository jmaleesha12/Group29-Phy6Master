package com.example.Phy6_Master.dto;

import com.example.Phy6_Master.model.TutorialRequest.PaymentStatus;
import com.example.Phy6_Master.model.TutorialRequest.RequestStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TutorialRequestResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentIdNumber; // The student's ID number (e.g., enrollment number)
    private String subject;
    private String course;
    private String requiredTutorial;
    private PaymentStatus paymentStatus;
    private RequestStatus requestStatus;
    private Boolean studentNotified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
