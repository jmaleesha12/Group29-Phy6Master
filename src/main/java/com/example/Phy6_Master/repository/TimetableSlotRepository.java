package com.example.Phy6_Master.repository;

import com.example.Phy6_Master.model.TimetableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for TimetableSlot.
 * Provides CRUD and a custom query to fetch slots by course.
 */
@Repository
public interface TimetableSlotRepository extends JpaRepository<TimetableSlot, Long> {

    /**
     * Fetch all timetable slots for a given course.
     *
     * @param courseId the ID of the course
     * @return list of timetable slots
     */
    List<TimetableSlot> findByCourseId(Long courseId);

    /**
     * Fetch all slots ordered by day then start time.
     */
    List<TimetableSlot> findAllByOrderByDayOfWeekAscStartTimeAsc();
}
