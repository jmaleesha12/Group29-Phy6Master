package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.model.TuteRequest;
import com.example.Phy6_Master.service.TuteRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/tute-requests")
public class TuteRequestController {
    private final TuteRequestService service;

    public TuteRequestController(TuteRequestService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TuteRequest> create(@RequestBody TuteRequest r) {
        return ResponseEntity.ok(service.create(r));
    }

    @GetMapping
    public ResponseEntity<List<TuteRequest>> listForUser(@RequestParam Long userId) {
        return ResponseEntity.ok(service.listForUser(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TuteRequest> update(@PathVariable Long id, @RequestBody TuteRequest r) {
        return ResponseEntity.ok(service.update(id, r));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
