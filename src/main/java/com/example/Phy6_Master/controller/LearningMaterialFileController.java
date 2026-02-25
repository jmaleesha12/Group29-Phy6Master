package com.example.Phy6_Master.controller;

import com.example.Phy6_Master.model.LearningMaterial;
import com.example.Phy6_Master.model.Lesson;
import com.example.Phy6_Master.repository.LearningMaterialRepository;
import com.example.Phy6_Master.repository.LessonRepository;
import com.example.Phy6_Master.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class LearningMaterialFileController {

    private final FileStorageService fileStorageService;
    private final LessonRepository lessonRepository;
    private final LearningMaterialRepository learningMaterialRepository;

    public LearningMaterialFileController(FileStorageService fileStorageService,
                                          LessonRepository lessonRepository,
                                          LearningMaterialRepository learningMaterialRepository) {
        this.fileStorageService = fileStorageService;
        this.lessonRepository = lessonRepository;
        this.learningMaterialRepository = learningMaterialRepository;
    }

    @PostMapping(value = "/lessons/{lessonId}/materials/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<LearningMaterial> uploadMaterial(
            @PathVariable Long lessonId,
            @RequestParam("title") String title,
            @RequestParam("type") LearningMaterial.MaterialType type,
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        // choose folder based on type
        String folder = switch (type) {
            case PDF -> "pdf";
            case VIDEO -> "video";
            case NOTE -> "note";
            default -> "other";
        };

        // basic validation (you can improve)
        if (type == LearningMaterial.MaterialType.PDF && !"application/pdf".equalsIgnoreCase(file.getContentType())) {
            throw new RuntimeException("Only PDF allowed for type=PDF");
        }

        String storedPath = fileStorageService.save(file, folder); // e.g. pdf/uuid.pdf

        LearningMaterial material = new LearningMaterial();
        material.setTitle(title);
        material.setType(type);
        material.setUrl(storedPath); // IMPORTANT: store relative path
        material.setLesson(lesson);

        return ResponseEntity.ok(learningMaterialRepository.save(material));
    }

    @GetMapping("/materials/{materialId}/download")
    public ResponseEntity<Resource> download(@PathVariable Long materialId) throws Exception {
        LearningMaterial material = learningMaterialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        Resource resource = fileStorageService.loadAsResource(material.getUrl());

        String filename = resource.getFilename() != null ? resource.getFilename() : "file";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}

