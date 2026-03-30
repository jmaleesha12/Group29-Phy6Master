package com.example.Phy6_Master.service;

import com.example.Phy6_Master.dto.NotificationResponse;
import com.example.Phy6_Master.model.Notification;
import com.example.Phy6_Master.model.Payment;
import com.example.Phy6_Master.model.User;
import com.example.Phy6_Master.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void createPaymentNotification(User student, Payment payment, String courseName, boolean isApproved) {
        String type = isApproved ? "APPROVED" : "REJECTED";

        // Prevent duplicates for the identical payment status
        if (payment != null && notificationRepository.existsByPayment_IdAndType(payment.getId(), type)) {
            return;
        }

        Notification notification = new Notification();
        notification.setStudent(student);
        notification.setPayment(payment);
        notification.setClassReference(courseName != null ? courseName : "Your Class");
        notification.setType(type);

        if (isApproved) {
            notification.setTitle("Payment Approved");
            notification.setMessage("Your payment for " + notification.getClassReference()
                    + " has been approved. Your enrollment is now confirmed.");
        } else {
            notification.setTitle("Payment Rejected");
            notification.setMessage("Your payment for " + notification.getClassReference()
                    + " has been rejected. Please resubmit your payment or contact support.");
        }

        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getStudentNotifications(Long studentId) {
        return notificationRepository.findByStudent_IdOrderByCreatedAtDesc(studentId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long notificationId, Long studentId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        if (!notification.getStudent().getId().equals(studentId)) {
            throw new IllegalArgumentException("Unauthorized to access this notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getClassReference(),
                notification.getType(),
                notification.isRead(),
                notification.getCreatedAt());
    }
}
