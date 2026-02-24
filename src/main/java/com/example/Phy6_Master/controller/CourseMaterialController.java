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

    @GetMapping("/courses/{courseId}/materials")
    public ResponseEntity<List<LearningMaterial>> getCourseMaterials(@PathVariable Long courseId) {
        List<LearningMaterial> materials = studentService.getCourseMaterials(courseId);
        return ResponseEntity.ok(materials);
    }

    
}
