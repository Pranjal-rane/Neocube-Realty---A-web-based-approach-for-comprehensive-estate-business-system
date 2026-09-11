package com.neocube.realty.controller;

import com.neocube.realty.entity.FollowUp;
import com.neocube.realty.service.FollowUpService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follow-ups")
@CrossOrigin(origins = "*")
public class FollowUpController {

    private final FollowUpService followUpService;

    public FollowUpController(FollowUpService followUpService) {
        this.followUpService = followUpService;
    }

    // Create Follow-Up
    @PostMapping
    public ResponseEntity<FollowUp> createFollowUp(
            @RequestBody FollowUp followUp) {

        FollowUp createdFollowUp =
                followUpService.createFollowUp(followUp);

        return ResponseEntity.ok(createdFollowUp);
    }

    // Get All Follow-Ups
    @GetMapping
    public ResponseEntity<List<FollowUp>> getAllFollowUps() {

        return ResponseEntity.ok(
                followUpService.getAllFollowUps()
        );
    }

    // Get Follow-Up By ID
    @GetMapping("/{id}")
    public ResponseEntity<FollowUp> getFollowUpById(
            @PathVariable Long id) {

        return followUpService.getFollowUpById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get Follow-Ups By Lead ID
    @GetMapping("/lead/{leadId}")
    public ResponseEntity<List<FollowUp>> getFollowUpsByLeadId(
            @PathVariable Long leadId) {

        return ResponseEntity.ok(
                followUpService.getFollowUpsByLeadId(leadId)
        );
    }

    // Get Follow-Ups By Broker ID
    @GetMapping("/broker/{brokerId}")
    public ResponseEntity<List<FollowUp>> getFollowUpsByBrokerId(
            @PathVariable Long brokerId) {

        return ResponseEntity.ok(
                followUpService.getFollowUpsByBrokerId(brokerId)
        );
    }

    // Update Follow-Up
    @PutMapping("/{id}")
    public ResponseEntity<FollowUp> updateFollowUp(
            @PathVariable Long id,
            @RequestBody FollowUp followUp) {

        return ResponseEntity.ok(
                followUpService.updateFollowUp(id, followUp)
        );
    }

    // Delete Follow-Up
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFollowUp(
            @PathVariable Long id) {

        followUpService.deleteFollowUp(id);

        return ResponseEntity.noContent().build();
    }
}