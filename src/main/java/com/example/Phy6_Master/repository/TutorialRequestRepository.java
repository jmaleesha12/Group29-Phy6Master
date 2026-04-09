package com.example.Phy6_Master.repository;

import com.example.Phy6_Master.model.TutorialRequest;
import com.example.Phy6_Master.model.TutorialRequest.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TutorialRequestRepository extends JpaRepository<TutorialRequest, Long> {

    // Find all requests with a specific status
    List<TutorialRequest> findByRequestStatus(RequestStatus status);

    // Find all requests ordered by creation date (oldest first for pending queue)
    List<TutorialRequest> findAllByOrderByCreatedAtAsc();

    // Find pending requests ordered by creation date (oldest first)
    List<TutorialRequest> findByRequestStatusOrderByCreatedAtAsc(RequestStatus status);

    // Find active (accepted) requests
    List<TutorialRequest> findByRequestStatusOrderByUpdatedAtDesc(RequestStatus status);

    // Find requests by student
    List<TutorialRequest> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    // Find unnotified requests for a student (for notification display)
    List<TutorialRequest> findByStudentIdAndStudentNotifiedFalseAndRequestStatusNot(Long studentId, RequestStatus status);
}
