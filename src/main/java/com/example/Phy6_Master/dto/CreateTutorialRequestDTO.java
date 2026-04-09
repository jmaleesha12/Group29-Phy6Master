package com.example.Phy6_Master.dto;

import com.example.Phy6_Master.model.TutorialRequest.PaymentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTutorialRequestDTO {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Course is required")
    private String course;

    @NotBlank(message = "Required tutorial is required")
    private String requiredTutorial;

    private PaymentStatus paymentStatus = PaymentStatus.NOT_PAID;
}
