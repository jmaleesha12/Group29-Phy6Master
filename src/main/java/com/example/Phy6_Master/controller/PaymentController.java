package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.model.Invoice;
import com.example.Phy6_Master.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/status/{userId}")
    public ResponseEntity<Map<String, Object>> status(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(userId));
    }

    @GetMapping("/invoices/{userId}")
    public ResponseEntity<List<Invoice>> invoices(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getInvoicesForUser(userId));
    }
}
