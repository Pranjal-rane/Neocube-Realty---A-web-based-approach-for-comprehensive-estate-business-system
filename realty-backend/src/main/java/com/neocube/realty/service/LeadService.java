package com.neocube.realty.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.neocube.realty.entity.Lead;
import com.neocube.realty.entity.LeadStatus;
import com.neocube.realty.repository.LeadRepository;

@Service
public class LeadService {

    private final LeadRepository leadRepository;
    private final LeadAssignmentService leadAssignmentService;

    public LeadService(LeadRepository leadRepository, LeadAssignmentService leadAssignmentService) {
        this.leadRepository = leadRepository;
        this.leadAssignmentService = leadAssignmentService;
    }

    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    public Optional<Lead> getLeadById(Long id) {
        return leadRepository.findById(id);
    }

    public List<Lead> getLeadsByStatus(LeadStatus status) {
        return leadRepository.findByStatus(status);
    }

    public List<Lead> getLeadsByBrokerId(Long brokerId) {
        return leadRepository.findByBrokerId(brokerId);
    }

    public List<Lead> getLeadsByCustomerId(Long customerId) {
        return leadRepository.findByCustomerId(customerId);
    }

    public List<Lead> getUnassignedLeads() {
        return leadRepository.findByBrokerIdIsNull();
    }

    public Lead saveLead(Lead lead) {
        Lead savedLead = leadRepository.save(lead);
        if (savedLead.getBrokerId() == null) {
            leadAssignmentService.assignLeadToNextBroker(savedLead);
        }
        return savedLead;
    }

    public Lead updateLead(Lead lead) {
        return leadRepository.save(lead);
    }

    public void deleteLead(Long id) {
        leadRepository.deleteById(id);
    }
}