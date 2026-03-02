package com.example.Phy6_Master.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path baseDir;

    public FileStorageService(@Value("${app.upload.dir}") String uploadDir) {
        this.baseDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        // create root directory if it doesn't exist
        try {
            Files.createDirectories(this.baseDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public String save(MultipartFile file, String subFolder) throws IOException {
        if (file == null || file.isEmpty()) throw new IOException("Empty file");

        Path targetDir = baseDir.resolve(subFolder).normalize();
        Files.createDirectories(targetDir);

        String original = StringUtils.cleanPath(file.getOriginalFilename());
        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0) ext = original.substring(dot);

        String storedName = UUID.randomUUID() + ext;
        Path target = targetDir.resolve(storedName).normalize();

        // security: ensure it stays inside targetDir
        if (!target.startsWith(targetDir)) throw new IOException("Invalid path");

        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        // store a relative path in DB
        return subFolder + "/" + storedName; // e.g. "pdf/abc-123.pdf"
    }

    public Resource loadAsResource(String relativePath) throws MalformedURLException {
        Path filePath = baseDir.resolve(relativePath).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            throw new RuntimeException("File not found: " + relativePath);
        }
        return resource;
    }
}