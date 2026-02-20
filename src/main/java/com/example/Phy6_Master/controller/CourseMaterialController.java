package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.model.LearningMaterial;
import com.example.Phy6_Master.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CourseMaterialController {

    @Autowired
    private StudentService studentService;

    /**
     * Get all learning materials for a course
     * @param courseId the course ID (must be greater than 0)
     * @return list of learning materials
     */
    @GetMapping("/courses/{courseId}/materials")
    public ResponseEntity<List<LearningMaterial>> getCourseMaterials(
            @PathVariable(name = "courseId") Long courseId) {
        if (courseId == null || courseId <= 0) {
            return ResponseEntity.badRequest().build();
        }
        List<LearningMaterial> materials = studentService.getCourseMaterials(courseId);
        return ResponseEntity.ok(materials);
    }

    /**
     * Get download link for a learning material
     * @param materialId the material ID (must be greater than 0)
     * @return download link
     */
    @GetMapping("/materials/{materialId}/download")
    public ResponseEntity<String> downloadMaterial(
            @PathVariable(name = "materialId") Long materialId) {
        if (materialId == null || materialId <= 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok("Download link for material " + materialId);
    }
}
