package com.example.Phy6_Master.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // student user id
    private String description;
    private Double amount;
    private String currency = "USD";
    private LocalDate dueDate;
    private String status; // PAID, DUE, OVERDUE
}
