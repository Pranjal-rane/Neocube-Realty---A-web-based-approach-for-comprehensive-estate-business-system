package com.neocube.realty.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neocube.realty.entity.LeadAssignment;
import com.neocube.realty.service.LeadAssignmentService;

@RestController
@RequestMapping("/api/lead-assignments")
public class LeadAssignmentController {

    private final LeadAssignmentService leadAssignmentService;

    public LeadAssignmentController(
            LeadAssignmentService leadAssignmentService) {
        this.leadAssignmentService = leadAssignmentService;
    }

    @PostMapping
    public ResponseEntity<LeadAssignment> assignLeadToBroker(
            @RequestBody AssignmentRequest request) {

        LeadAssignment assignment =
                leadAssignmentService.assignLeadToBroker(
                        request.getLeadId(),
                        request.getBrokerId(),
                        request.getAssignedBy()
                );

        return ResponseEntity.ok(assignment);
    }

    @GetMapping("/lead/{leadId}")
    public List<LeadAssignment> getAssignmentsByLead(
            @PathVariable Long leadId) {

        return leadAssignmentService
                .getAssignmentsByLeadId(leadId);
    }

    @GetMapping("/broker/{brokerId}")
    public List<LeadAssignment> getAssignmentsByBroker(
            @PathVariable Long brokerId) {

        return leadAssignmentService
                .getAssignmentsByBrokerId(brokerId);
    }

    public static class AssignmentRequest {

        private Long leadId;
        private Long brokerId;
        private Long assignedBy;

        public Long getLeadId() {
            return leadId;
        }

        public void setLeadId(Long leadId) {
            this.leadId = leadId;
        }

        public Long getBrokerId() {
            return brokerId;
        }

        public void setBrokerId(Long brokerId) {
            this.brokerId = brokerId;
        }

        public Long getAssignedBy() {
            return assignedBy;
        }

        public void setAssignedBy(Long assignedBy) {
            this.assignedBy = assignedBy;
        }
    }
}