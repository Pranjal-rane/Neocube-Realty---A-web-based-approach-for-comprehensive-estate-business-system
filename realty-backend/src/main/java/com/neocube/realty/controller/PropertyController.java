package com.neocube.realty.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.neocube.realty.entity.Property;
import com.neocube.realty.service.PropertyService;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
    }
)
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    // =========================================================
    // GET ALL PROPERTIES
    // =========================================================

    @GetMapping
    public List<Property> getAllProperties() {
        return propertyService.getAllProperties();
    }

    // =========================================================
    // SEARCH BY LOCATION
    // =========================================================

    @GetMapping("/search")
    public List<Property> searchByLocation(
            @RequestParam String location) {

        return propertyService.searchByLocation(location);
    }

    // =========================================================
    // SEARCH BY BHK
    // =========================================================

    @GetMapping("/search/bhk")
    public List<Property> searchByBhk(
            @RequestParam Integer bhk) {

        return propertyService.searchByBhk(bhk);
    }

    // =========================================================
    // SEARCH BY PROPERTY TYPE
    // =========================================================

    @GetMapping("/search/type")
    public List<Property> searchByPropertyType(
            @RequestParam String propertyType) {

        return propertyService.searchByPropertyType(propertyType);
    }

    // =========================================================
    // SEARCH BY MAX PRICE
    // =========================================================

    @GetMapping("/search/price")
    public List<Property> searchByMaxPrice(
            @RequestParam BigDecimal maxPrice) {

        return propertyService.searchByMaxPrice(maxPrice);
    }

    // =========================================================
    // SEARCH BY STATUS
    // =========================================================

    @GetMapping("/search/status")
    public List<Property> searchByStatus(
            @RequestParam String status) {

        return propertyService.searchByStatus(status);
    }

    // =========================================================
    // MULTI FILTER
    // =========================================================

    @GetMapping("/filter")
    public List<Property> filterProperties(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer bhk,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String status) {

        return propertyService.searchProperties(
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

    @GetMapping("/{id}")
    public Property getPropertyById(
            @PathVariable Long id) {

        return propertyService.getPropertyById(id);
    }

    // =========================================================
    // CREATE PROPERTY
    // =========================================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Property createProperty(
            @RequestBody Property property) {

        return propertyService.createProperty(property);
    }

    // =========================================================
    // UPDATE PROPERTY
    // =========================================================

    @PutMapping("/{id}")
    public Property updateProperty(
            @PathVariable Long id,
            @RequestBody Property property) {

        return propertyService.updateProperty(
                id,
                property
        );
    }

    // =========================================================
    // DELETE PROPERTY
    // =========================================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProperty(
            @PathVariable Long id) {

        propertyService.deleteProperty(id);
    }

    // =========================================================
    // UPLOAD 2D BLUEPRINT
    // =========================================================

    @PostMapping(
            value = "/{id}/blueprint",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Property> uploadBlueprint(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        Property updatedProperty =
                propertyService.uploadBlueprint(
                        id,
                        file
                );

        return ResponseEntity.ok(updatedProperty);
    }

    // =========================================================
    // VIEW 2D BLUEPRINT
    // =========================================================

    @GetMapping("/{id}/blueprint/view")
    public ResponseEntity<Resource> viewBlueprint(
            @PathVariable Long id) {

        try {

            Path blueprintPath =
                    propertyService.getBlueprintFile(id);

            Resource resource =
                    new UrlResource(
                            blueprintPath.toUri()
                    );

            if (!resource.exists()
                    || !resource.isReadable()) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            String contentType =
                    Files.probeContentType(
                            blueprintPath
                    );

            if (contentType == null) {
                contentType =
                        "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(
                            MediaType.parseMediaType(
                                    contentType
                            )
                    )
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\""
                                    + blueprintPath
                                            .getFileName()
                                    + "\""
                    )
                    .body(resource);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();

        } catch (IOException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .build();
        }
    }
}