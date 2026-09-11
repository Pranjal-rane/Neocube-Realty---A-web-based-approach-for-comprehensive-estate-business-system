package com.neocube.realty.controller;

import com.neocube.realty.entity.Deal;
import com.neocube.realty.service.DealService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deals")
@CrossOrigin(origins = "*")
public class DealController {

    private final DealService dealService;

    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    // Create Deal
    @PostMapping
    public ResponseEntity<Deal> createDeal(
            @RequestBody Deal deal) {

        return ResponseEntity.ok(
                dealService.createDeal(deal)
        );
    }

    // Get All Deals
    @GetMapping
    public ResponseEntity<List<Deal>> getAllDeals() {

        return ResponseEntity.ok(
                dealService.getAllDeals()
        );
    }

    // Get Deal By ID
    @GetMapping("/{id}")
    public ResponseEntity<Deal> getDealById(
            @PathVariable Long id) {

        return dealService.getDealById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get Deal By Booking ID
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Deal> getDealByBookingId(
            @PathVariable Long bookingId) {

        return dealService.getDealByBookingId(bookingId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get Deals By Customer ID
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Deal>> getDealsByCustomerId(
            @PathVariable Long customerId) {

        return ResponseEntity.ok(
                dealService.getDealsByCustomerId(customerId)
        );
    }

    // Get Deals By Broker ID
    @GetMapping("/broker/{brokerId}")
    public ResponseEntity<List<Deal>> getDealsByBrokerId(
            @PathVariable Long brokerId) {

        return ResponseEntity.ok(
                dealService.getDealsByBrokerId(brokerId)
        );
    }

    // Get Deals By Property ID
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Deal>> getDealsByPropertyId(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                dealService.getDealsByPropertyId(propertyId)
        );
    }

    // Get Deals By Status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Deal>> getDealsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                dealService.getDealsByStatus(status)
        );
    }

    // Update Deal
    @PutMapping("/{id}")
    public ResponseEntity<Deal> updateDeal(
            @PathVariable Long id,
            @RequestBody Deal deal) {

        return ResponseEntity.ok(
                dealService.updateDeal(id, deal)
        );
    }

    // Delete Deal
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeal(
            @PathVariable Long id) {

        dealService.deleteDeal(id);

        return ResponseEntity.noContent().build();
    }
}