package com.neocube.realty.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.neocube.realty.entity.Property;
import com.neocube.realty.repository.PropertyRepository;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    private final Path blueprintUploadDir =
            Paths.get("uploads", "blueprints")
                    .toAbsolutePath()
                    .normalize();

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;

        try {
            Files.createDirectories(blueprintUploadDir);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Unable to create blueprint upload directory", e);
        }
    }

    // =========================================================
    // GET ALL PROPERTIES
    // =========================================================

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    // =========================================================
    // SEARCH BY LOCATION
    // =========================================================

    public List<Property> searchByLocation(String location) {
        return propertyRepository
                .findByLocationContainingIgnoreCase(location);
    }

    // =========================================================
    // SEARCH BY BHK
    // =========================================================

    public List<Property> searchByBhk(Integer bhk) {
        return propertyRepository.findByBhk(bhk);
    }

    // =========================================================
    // SEARCH BY PROPERTY TYPE
    // =========================================================

    public List<Property> searchByPropertyType(
            String propertyType) {

        return propertyRepository
                .findByPropertyTypeIgnoreCase(propertyType);
    }

    // =========================================================
    // SEARCH BY MAX PRICE
    // =========================================================

    public List<Property> searchByMaxPrice(
            BigDecimal maxPrice) {

        return propertyRepository
                .findByPriceLessThanEqual(maxPrice);
    }

    // =========================================================
    // SEARCH BY STATUS
    // =========================================================

    public List<Property> searchByStatus(String status) {

        return propertyRepository
                .findByStatusIgnoreCase(status);
    }

    // =========================================================
    // MULTI FILTER SEARCH
    // =========================================================

    public List<Property> searchProperties(
            String location,
            Integer bhk,
            String propertyType,
            BigDecimal maxPrice,
            String status) {

        return propertyRepository.searchProperties(
                location,
                bhk,
                propertyType,
                maxPrice,
                status
        );
    }

    // =========================================================
    // GET PROPERTY BY ID
    // =========================================================

    public Property getPropertyById(Long id) {

        return propertyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Property not found with id: " + id));
    }

    // =========================================================
    // CREATE PROPERTY
    // =========================================================

    public Property createProperty(Property property) {
        return propertyRepository.save(property);
    }

    // =========================================================
    // UPDATE PROPERTY
    // =========================================================

    public Property updateProperty(
            Long id,
            Property propertyDetails) {

        Property property = getPropertyById(id);

        property.setPropertyName(
                propertyDetails.getPropertyName());

        property.setLocation(
                propertyDetails.getLocation());

        property.setPrice(
                propertyDetails.getPrice());

        property.setPropertyType(
                propertyDetails.getPropertyType());

        property.setBhk(
                propertyDetails.getBhk());

        property.setBathrooms(
                propertyDetails.getBathrooms());

        property.setAreaSqft(
                propertyDetails.getAreaSqft());

        property.setStatus(
                propertyDetails.getStatus());

        property.setFeatured(
                propertyDetails.getFeatured());

        property.setDescription(
                propertyDetails.getDescription());

        property.setImagePath(
                propertyDetails.getImagePath());

        if (propertyDetails.getBlueprintPath() != null) {
            property.setBlueprintPath(
                    propertyDetails.getBlueprintPath());
        }

        return propertyRepository.save(property);
    }

    // =========================================================
    // UPLOAD 2D BLUEPRINT
    // =========================================================

    public Property uploadBlueprint(
            Long propertyId,
            MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException(
                    "Blueprint file is required");
        }

        Property property =
                getPropertyById(propertyId);

        String originalFileName =
                file.getOriginalFilename();

        if (originalFileName == null
                || originalFileName.trim().isEmpty()) {

            throw new RuntimeException(
                    "Invalid blueprint file name");
        }

        String lowerName =
                originalFileName.toLowerCase();

        if (!lowerName.endsWith(".png")
                && !lowerName.endsWith(".jpg")
                && !lowerName.endsWith(".jpeg")
                && !lowerName.endsWith(".pdf")) {

            throw new RuntimeException(
                    "Only PNG, JPG, JPEG or PDF blueprint files are allowed");
        }

        String extension = "";

        int dotIndex =
                originalFileName.lastIndexOf('.');

        if (dotIndex >= 0) {
            extension =
                    originalFileName.substring(dotIndex)
                            .toLowerCase();
        }

        String fileName =
                "property-"
                        + propertyId
                        + "-blueprint"
                        + extension;

        Path targetPath =
                blueprintUploadDir
                        .resolve(fileName)
                        .normalize();

        try {

            if (!targetPath.startsWith(
                    blueprintUploadDir)) {

                throw new RuntimeException(
                        "Invalid blueprint file path");
            }

            Files.copy(
                    file.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to save blueprint file", e);
        }

        String blueprintPath =
                "/api/properties/"
                        + propertyId
                        + "/blueprint/view";

        property.setBlueprintPath(
                blueprintPath);

        return propertyRepository.save(property);
    }

    // =========================================================
    // FIND STORED BLUEPRINT FILE
    // =========================================================

    public Path getBlueprintFile(Long propertyId) {

        Property property =
                getPropertyById(propertyId);

        if (property.getBlueprintPath() == null
                || property.getBlueprintPath().trim().isEmpty()) {

            throw new RuntimeException(
                    "No blueprint uploaded for this property");
        }

        String[] extensions = {
                ".png",
                ".jpg",
                ".jpeg",
                ".pdf"
        };

        for (String extension : extensions) {

            Path candidate =
                    blueprintUploadDir.resolve(
                            "property-"
                                    + propertyId
                                    + "-blueprint"
                                    + extension);

            if (Files.exists(candidate)) {
                return candidate;
            }
        }

        throw new RuntimeException(
                "Blueprint file not found for property "
                        + propertyId);
    }

    // =========================================================
    // DELETE PROPERTY
    // =========================================================

    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }
}