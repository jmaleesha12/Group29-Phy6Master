package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.dto.TimetableSlotDTO;
import com.example.Phy6_Master.model.TimetableSlot;
import com.example.Phy6_Master.service.TimetableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for the Teacher's Timetable Scheduling.
 *
 * Base URL: /api/timetable
 *
 * Endpoints:
 * POST /api/timetable – Create a new slot
 * GET /api/timetable – Get all slots (ordered by day & time)
 * GET /api/timetable/{id} – Get a single slot
 * GET /api/timetable/course/{courseId} – Get all slots for a course
 * PUT /api/timetable/{id} – Update a slot
 * DELETE /api/timetable/{id} – Delete a slot
 */
@RestController
@RequestMapping("/api/timetable")
public class TimetableController {

    @Autowired
    private TimetableService timetableService;

    // ── POST /api/timetable ───────────────────────────────────────────────────

    /**
     * Create a new timetable slot for a course.
     *
     * Request body example:
     * {
     * "courseId": 1,
     * "dayOfWeek": "MONDAY",
     * "startTime": "09:00",
     * "endTime": "11:00",
     * "location": "Room 101",
     * "notes": "Theory class"
     * }
     */
    @PostMapping
    public ResponseEntity<?> createSlot(@RequestBody TimetableSlotDTO dto) {
        try {
            TimetableSlot created = timetableService.createSlot(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── GET /api/timetable ────────────────────────────────────────────────────

    /**
     * Get the full timetable (all slots, sorted by day then start time).
     */
    @GetMapping
    public ResponseEntity<List<TimetableSlot>> getAllSlots() {
        return ResponseEntity.ok(timetableService.getAllSlots());
    }

    // ── GET /api/timetable/{id} ───────────────────────────────────────────────

    /**
     * Get a single timetable slot by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getSlotById(@PathVariable Long id) {
        return timetableService.getSlotById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Timetable slot not found with id: " + id));
    }

    // ── GET /api/timetable/course/{courseId} ──────────────────────────────────

    /**
     * Get all timetable slots for a specific course.
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getSlotsByCourse(@PathVariable Long courseId) {
        try {
            List<TimetableSlot> slots = timetableService.getSlotsByCourse(courseId);
            return ResponseEntity.ok(slots);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // ── PUT /api/timetable/{id} ───────────────────────────────────────────────

    /**
     * Update an existing timetable slot.
     * Only the fields provided in the body will be updated.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSlot(@PathVariable Long id,
            @RequestBody TimetableSlotDTO dto) {
        try {
            TimetableSlot updated = timetableService.updateSlot(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── DELETE /api/timetable/{id} ────────────────────────────────────────────

    /**
     * Delete a timetable slot.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long id) {
        try {
            timetableService.deleteSlot(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
