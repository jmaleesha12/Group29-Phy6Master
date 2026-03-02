package com.example.Phy6_Master.service;

import com.example.Phy6_Master.dto.TimetableSlotDTO;
import com.example.Phy6_Master.model.Course;
import com.example.Phy6_Master.model.TimetableSlot;
import com.example.Phy6_Master.repository.CourseRepository;
import com.example.Phy6_Master.repository.TimetableSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

/**
 * Service layer for Timetable Scheduling.
 * Handles all business logic for creating, reading, updating, and
 * deleting timetable slots for the teacher's courses.
 */
@Service
public class TimetableService {

    @Autowired
    private TimetableSlotRepository timetableSlotRepository;

    @Autowired
    private CourseRepository courseRepository;

    // ── Create ────────────────────────────────────────────────────────────────

    /**
     * Create a new timetable slot.
     *
     * @param dto DTO containing slot data
     * @return the saved TimetableSlot entity
     */
    public TimetableSlot createSlot(TimetableSlotDTO dto) {
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException(
                        "Course not found with id: " + dto.getCourseId()));

        validateTimes(dto.getStartTime(), dto.getEndTime());

        TimetableSlot slot = new TimetableSlot(
                course,
                parseDayOfWeek(dto.getDayOfWeek()),
                LocalTime.parse(dto.getStartTime()),
                LocalTime.parse(dto.getEndTime()),
                dto.getLocation(),
                dto.getNotes());

        return timetableSlotRepository.save(slot);
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    /**
     * Get all timetable slots, ordered by day and start time.
     */
    public List<TimetableSlot> getAllSlots() {
        return timetableSlotRepository.findAllByOrderByDayOfWeekAscStartTimeAsc();
    }

    /**
     * Get all timetable slots for a specific course.
     *
     * @param courseId the course ID
     * @return list of slots for that course
     */
    public List<TimetableSlot> getSlotsByCourse(Long courseId) {
        // Validate course exists
        if (!courseRepository.existsById(courseId)) {
            throw new RuntimeException("Course not found with id: " + courseId);
        }
        return timetableSlotRepository.findByCourseId(courseId);
    }

    /**
     * Get a single slot by its ID.
     */
    public Optional<TimetableSlot> getSlotById(Long id) {
        return timetableSlotRepository.findById(id);
    }

    // ── Update ────────────────────────────────────────────────────────────────

    /**
     * Update an existing timetable slot.
     *
     * @param id  the slot ID to update
     * @param dto DTO with updated values
     * @return the updated TimetableSlot entity
     */
    public TimetableSlot updateSlot(Long id, TimetableSlotDTO dto) {
        TimetableSlot slot = timetableSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Timetable slot not found with id: " + id));

        // Update course if changed
        if (dto.getCourseId() != null) {
            Course course = courseRepository.findById(dto.getCourseId())
                    .orElseThrow(() -> new RuntimeException(
                            "Course not found with id: " + dto.getCourseId()));
            slot.setCourse(course);
        }

        if (dto.getDayOfWeek() != null) {
            slot.setDayOfWeek(parseDayOfWeek(dto.getDayOfWeek()));
        }

        if (dto.getStartTime() != null && dto.getEndTime() != null) {
            validateTimes(dto.getStartTime(), dto.getEndTime());
            slot.setStartTime(LocalTime.parse(dto.getStartTime()));
            slot.setEndTime(LocalTime.parse(dto.getEndTime()));
        } else if (dto.getStartTime() != null) {
            slot.setStartTime(LocalTime.parse(dto.getStartTime()));
        } else if (dto.getEndTime() != null) {
            slot.setEndTime(LocalTime.parse(dto.getEndTime()));
        }

        if (dto.getLocation() != null) {
            slot.setLocation(dto.getLocation());
        }

        if (dto.getNotes() != null) {
            slot.setNotes(dto.getNotes());
        }

        return timetableSlotRepository.save(slot);
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    /**
     * Delete a timetable slot by ID.
     *
     * @param id the slot ID
     */
    public void deleteSlot(Long id) {
        TimetableSlot slot = timetableSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Timetable slot not found with id: " + id));
        timetableSlotRepository.delete(slot);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Validate that start time is before end time.
     */
    private void validateTimes(String startTime, String endTime) {
        try {
            LocalTime start = LocalTime.parse(startTime);
            LocalTime end = LocalTime.parse(endTime);
            if (!start.isBefore(end)) {
                throw new IllegalArgumentException(
                        "Start time must be before end time.");
            }
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException(
                    "Invalid time format. Use HH:mm (e.g. 09:00).");
        }
    }

    /**
     * Parse a day-of-week string to the DayOfWeek enum.
     */
    private DayOfWeek parseDayOfWeek(String day) {
        try {
            return DayOfWeek.valueOf(day.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Invalid day: " + day +
                            ". Use one of: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY");
        }
    }
}
