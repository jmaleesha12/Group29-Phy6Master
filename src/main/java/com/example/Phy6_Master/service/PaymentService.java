package com.example.Phy6_Master.service;

import com.example.Phy6_Master.model.Invoice;
import com.example.Phy6_Master.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaymentService {
    private final InvoiceRepository invoiceRepository;

    public PaymentService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public List<Invoice> getInvoicesForUser(Long userId) {
        return invoiceRepository.findByUserId(userId);
    }

    public Map<String, Object> getPaymentStatus(Long userId) {
        List<Invoice> inv = getInvoicesForUser(userId);
        double due = inv.stream().filter(i -> "DUE".equals(i.getStatus()) || "OVERDUE".equals(i.getStatus())).mapToDouble(Invoice::getAmount).sum();
        Map<String, Object> status = new HashMap<>();
        status.put("plan", inv.isEmpty() ? "Free" : "Standard");
        status.put("nextDue", inv.stream().filter(i -> "DUE".equals(i.getStatus())).findFirst().map(Invoice::getDueDate).orElse(null));
        status.put("amount", due);
        status.put("currency", inv.isEmpty() ? "USD" : inv.get(0).getCurrency());
        status.put("status", due > 0 ? "due" : "paid");
        return status;
    }
}
