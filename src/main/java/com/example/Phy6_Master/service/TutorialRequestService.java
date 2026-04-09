package com.example.Phy6_Master.service;

import com.example.Phy6_Master.dto.CreateTutorialRequestDTO;
import com.example.Phy6_Master.dto.TutorialRequestResponse;
import com.example.Phy6_Master.model.TutorialRequest;
import com.example.Phy6_Master.model.Student;
import com.example.Phy6_Master.model.TutorialRequest.RequestStatus;
import com.example.Phy6_Master.repository.StudentRepository;
import com.example.Phy6_Master.repository.TutorialRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TutorialRequestService {

    @Autowired
    private TutorialRequestRepository tutorialRequestRepository;

    private TutorialRequestResponse toResponse(TutorialRequest request) {
        TutorialRequestResponse response = new TutorialRequestResponse();
        response.setId(request.getId());
        response.setStudentId(request.getStudent().getId());
        response.setStudentName(request.getStudent().getUser().getName());
        response.setStudentIdNumber(request.getStudent().getStudentId());
        response.setSubject(request.getSubject());
        response.setCourse(request.getCourse());
        response.setRequiredTutorial(request.getRequiredTutorial());
        response.setPaymentStatus(request.getPaymentStatus());
        response.setRequestStatus(request.getRequestStatus());
        response.setStudentNotified(request.getStudentNotified());
        response.setCreatedAt(request.getCreatedAt());
        response.setUpdatedAt(request.getUpdatedAt());
        return response;
    }

    public List<TutorialRequestResponse> getPendingRequests() {
        return tutorialRequestRepository
                .findByRequestStatusOrderByCreatedAtAsc(RequestStatus.PENDING)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }


    public List<TutorialRequestResponse> getActiveRequests() {
        return tutorialRequestRepository
                .findByRequestStatusOrderByUpdatedAtDesc(RequestStatus.ACCEPTED)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }


    public List<TutorialRequestResponse> getAllRequests() {
        return tutorialRequestRepository
                .findAllByOrderByCreatedAtAsc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }


    public TutorialRequestResponse getRequestById(Long id) {
        TutorialRequest request = tutorialRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tutorial request not found with id: " + id));
        return toResponse(request);
    }

    // Create a new tutorial request
    @Transactional
    public TutorialRequestResponse createRequest(CreateTutorialRequestDTO dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + dto.getStudentId()));

        TutorialRequest request = new TutorialRequest();
        request.setStudent(student);
        request.setSubject(dto.getSubject());
        request.setCourse(dto.getCourse());
        request.setRequiredTutorial(dto.getRequiredTutorial());
        request.setPaymentStatus(dto.getPaymentStatus());
        request.setRequestStatus(RequestStatus.PENDING);
        request.setStudentNotified(false);

        TutorialRequest saved = tutorialRequestRepository.save(request);
        return toResponse(saved);
    }


    // Update payment status
    @Transactional
    public TutorialRequestResponse updatePaymentStatus(Long id, TutorialRequest.PaymentStatus paymentStatus) {
        TutorialRequest request = tutorialRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tutorial request not found with id: " + id));

        request.setPaymentStatus(paymentStatus);
        TutorialRequest saved = tutorialRequestRepository.save(request);
        return toResponse(saved);
    }
}
