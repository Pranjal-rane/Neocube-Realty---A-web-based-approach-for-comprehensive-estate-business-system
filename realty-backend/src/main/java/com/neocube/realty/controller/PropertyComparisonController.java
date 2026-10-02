package com.neocube.realty.controller;

import com.neocube.realty.entity.PropertyComparison;
import com.neocube.realty.service.PropertyComparisonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comparisons")
@CrossOrigin(origins = "*")
public class PropertyComparisonController {

    private final PropertyComparisonService propertyComparisonService;

    public PropertyComparisonController(
            PropertyComparisonService propertyComparisonService) {
        this.propertyComparisonService = propertyComparisonService;
    }

    @PostMapping
    public ResponseEntity<PropertyComparison> addComparison(
            @RequestBody PropertyComparison comparison) {

        return ResponseEntity.ok(
                propertyComparisonService.addComparison(comparison)
        );
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<PropertyComparison>> getCustomerComparisons(
            @PathVariable Long customerId) {

        return ResponseEntity.ok(
                propertyComparisonService.getComparisonsByCustomer(customerId)
        );
    }

    @DeleteMapping("/customer/{customerId}/property/{propertyId}")
    public ResponseEntity<Void> removeComparison(
            @PathVariable Long customerId,
            @PathVariable Long propertyId) {

        propertyComparisonService.removeComparison(customerId, propertyId);

        return ResponseEntity.noContent().build();
    }
}