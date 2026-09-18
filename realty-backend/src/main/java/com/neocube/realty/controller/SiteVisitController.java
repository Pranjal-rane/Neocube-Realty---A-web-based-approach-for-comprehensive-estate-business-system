
package com.neocube.realty.controller;

import com.neocube.realty.entity.SiteVisit;
import com.neocube.realty.service.SiteVisitService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/site-visits")
@CrossOrigin(origins = "*")
public class SiteVisitController {

    private final SiteVisitService siteVisitService;

    public SiteVisitController(SiteVisitService siteVisitService) {
        this.siteVisitService = siteVisitService;
    }

    // Create Site Visit
    @PostMapping
    public ResponseEntity<SiteVisit> createSiteVisit(
            @RequestBody SiteVisit siteVisit) {

        return ResponseEntity.ok(
                siteVisitService.createSiteVisit(siteVisit)
        );
    }

    // Get All Site Visits
    @GetMapping
    public ResponseEntity<List<SiteVisit>> getAllSiteVisits() {

        return ResponseEntity.ok(
                siteVisitService.getAllSiteVisits()
        );
    }

    // Get Site Visit By ID
    @GetMapping("/{id}")
    public ResponseEntity<SiteVisit> getSiteVisitById(
            @PathVariable Long id) {

        return siteVisitService.getSiteVisitById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get By Customer ID
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<SiteVisit>> getByCustomerId(
            @PathVariable Long customerId) {

        return ResponseEntity.ok(
                siteVisitService.getSiteVisitsByCustomerId(customerId)
        );
    }

    // Get By Property ID
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<SiteVisit>> getByPropertyId(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                siteVisitService.getSiteVisitsByPropertyId(propertyId)
        );
    }

    // Get By Broker ID
    @GetMapping("/broker/{brokerId}")
    public ResponseEntity<List<SiteVisit>> getByBrokerId(
            @PathVariable Long brokerId) {

        return ResponseEntity.ok(
                siteVisitService.getSiteVisitsByBrokerId(brokerId)
        );
    }

    // Get By Status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<SiteVisit>> getByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                siteVisitService.getSiteVisitsByStatus(status)
        );
    }

    // Update Site Visit
    @PutMapping("/{id}")
    public ResponseEntity<SiteVisit> updateSiteVisit(
            @PathVariable Long id,
            @RequestBody SiteVisit siteVisit) {

        return ResponseEntity.ok(
                siteVisitService.updateSiteVisit(id, siteVisit)
        );
    }

    // Delete Site Visit
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSiteVisit(
            @PathVariable Long id) {

        siteVisitService.deleteSiteVisit(id);

        return ResponseEntity.noContent().build();
    }
}