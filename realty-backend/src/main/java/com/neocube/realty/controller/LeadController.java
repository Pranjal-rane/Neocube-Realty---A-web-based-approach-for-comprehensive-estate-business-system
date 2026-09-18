package com.neocube.realty.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neocube.realty.entity.Lead;
import com.neocube.realty.entity.LeadStatus;
import com.neocube.realty.service.LeadService;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping
    public List<Lead> getAllLeads() {
        return leadService.getAllLeads();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lead> getLeadById(
            @PathVariable Long id) {

        return leadService.getLeadById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public List<Lead> getLeadsByStatus(
            @PathVariable LeadStatus status) {

        return leadService.getLeadsByStatus(status);
    }

    @GetMapping("/broker/{brokerId}")
    public List<Lead> getLeadsByBrokerId(
            @PathVariable Long brokerId) {

        return leadService.getLeadsByBrokerId(brokerId);
    }

    @GetMapping("/customer/{customerId}")
    public List<Lead> getLeadsByCustomerId(
            @PathVariable Long customerId) {

        return leadService.getLeadsByCustomerId(customerId);
    }

    @GetMapping("/unassigned")
    public List<Lead> getUnassignedLeads() {
        return leadService.getUnassignedLeads();
    }

    @PostMapping
    public Lead createLead(
            @RequestBody Lead lead) {

        return leadService.saveLead(lead);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lead> updateLead(
            @PathVariable Long id,
            @RequestBody Lead lead) {

        if (leadService.getLeadById(id).isPresent()) {
            lead.setLeadId(id);
            return ResponseEntity.ok(leadService.updateLead(lead));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(
            @PathVariable Long id) {

        if (leadService.getLeadById(id).isPresent()) {
            leadService.deleteLead(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}