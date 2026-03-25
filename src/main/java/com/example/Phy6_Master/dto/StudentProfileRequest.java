package com.example.Phy6_Master.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StudentProfileRequest {
    @NotBlank
    private String school;

    private String grade;

    private String address;

    private String parentName;

    private String parentPhoneNumber;

    private String batch;

    private String enrollmentNumber;
}