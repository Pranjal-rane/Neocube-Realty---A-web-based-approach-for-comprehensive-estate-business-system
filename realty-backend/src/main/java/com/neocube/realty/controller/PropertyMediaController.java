package com.neocube.realty.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.neocube.realty.entity.Property;
import com.neocube.realty.service.PropertyService;

@RestController
@RequestMapping("/api/properties")
public class PropertyMediaController {

    private final PropertyService propertyService;

    private final Path uploadDirectory =
            Paths.get("uploads", "properties")
                    .toAbsolutePath()
                    .normalize();

    public PropertyMediaController(
            PropertyService propertyService) {

        this.propertyService = propertyService;
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<Property> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Property property =
                    propertyService.getPropertyById(id);

            Files.createDirectories(uploadDirectory);

            String originalName =
                    file.getOriginalFilename();

            String extension = "";

            if (originalName != null
                    && originalName.contains(".")) {

                extension =
                        originalName.substring(
                                originalName.lastIndexOf(".")
                        );
            }

            String fileName =
                    "property-"
                    + id
                    + "-image-"
                    + UUID.randomUUID()
                    + extension;

            Path target =
                    uploadDirectory.resolve(fileName)
                            .normalize();

            if (!target.startsWith(uploadDirectory)) {
                return ResponseEntity.badRequest().build();
            }

            Files.copy(
                    file.getInputStream(),
                    target,
                    StandardCopyOption.REPLACE_EXISTING
            );

            property.setImagePath(
                    "/uploads/properties/" + fileName
            );

            Property saved =
                    propertyService.updateProperty(
                            id,
                            property
                    );

            return ResponseEntity.ok(saved);

        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @PostMapping("/{id}/video")
    public ResponseEntity<Property> uploadVideo(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Property property =
                    propertyService.getPropertyById(id);

            Files.createDirectories(uploadDirectory);

            String originalName =
                    file.getOriginalFilename();

            String extension = "";

            if (originalName != null
                    && originalName.contains(".")) {

                extension =
                        originalName.substring(
                                originalName.lastIndexOf(".")
                        );
            }

            String fileName =
                    "property-"
                    + id
                    + "-video-"
                    + UUID.randomUUID()
                    + extension;

            Path target =
                    uploadDirectory.resolve(fileName)
                            .normalize();

            if (!target.startsWith(uploadDirectory)) {
                return ResponseEntity.badRequest().build();
            }

            Files.copy(
                    file.getInputStream(),
                    target,
                    StandardCopyOption.REPLACE_EXISTING
            );

            property.setVideoPath(
                    "/uploads/properties/" + fileName
            );

            Property saved =
                    propertyService.updateProperty(
                            id,
                            property
                    );

            return ResponseEntity.ok(saved);

        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }
}