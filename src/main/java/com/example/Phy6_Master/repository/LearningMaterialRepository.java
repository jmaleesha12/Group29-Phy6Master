package com.example.Phy6_Master.repository;

import com.example.Phy6_Master.model.LearningMaterial;
import com.example.Phy6_Master.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LearningMaterialRepository extends JpaRepository<LearningMaterial, Long> {
    List<LearningMaterial> findByCourse(Course course);
}
