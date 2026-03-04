package com.example.Phy6_Master.service;

import com.example.Phy6_Master.model.TuteRequest;
import com.example.Phy6_Master.repository.TuteRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TuteRequestService {
    private final TuteRequestRepository repo;

    public TuteRequestService(TuteRequestRepository repo) {
        this.repo = repo;
    }

    public TuteRequest create(TuteRequest r) { return repo.save(r); }
    public List<TuteRequest> listForUser(Long userId) { return repo.findByUserId(userId); }
    public TuteRequest update(Long id, TuteRequest updated) {
        return repo.findById(id).map(existing -> {
            existing.setStatus(updated.getStatus() != null ? updated.getStatus() : existing.getStatus());
            existing.setAssignedTutorId(updated.getAssignedTutorId() != null ? updated.getAssignedTutorId() : existing.getAssignedTutorId());
            existing.setDescription(updated.getDescription() != null ? updated.getDescription() : existing.getDescription());
            return repo.save(existing);
        }).orElseThrow(() -> new IllegalArgumentException("Tute request not found"));
    }
    public void delete(Long id) { repo.deleteById(id); }
}
