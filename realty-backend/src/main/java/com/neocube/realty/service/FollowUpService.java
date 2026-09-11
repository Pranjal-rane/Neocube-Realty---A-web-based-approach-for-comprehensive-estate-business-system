package com.neocube.realty.service;

import com.neocube.realty.entity.FollowUp;
import com.neocube.realty.repository.FollowUpRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FollowUpService {

    private final FollowUpRepository followUpRepository;

    public FollowUpService(FollowUpRepository followUpRepository) {
        this.followUpRepository = followUpRepository;
    }

    // Create Follow-Up
    public FollowUp createFollowUp(FollowUp followUp) {
        return followUpRepository.save(followUp);
    }

    // Get All Follow-Ups
    public List<FollowUp> getAllFollowUps() {
        return followUpRepository.findAll();
    }

    // Get Follow-Up By ID
    public Optional<FollowUp> getFollowUpById(Long id) {
        return followUpRepository.findById(id);
    }

    // Get Follow-Ups By Lead ID
    public List<FollowUp> getFollowUpsByLeadId(Long leadId) {
        return followUpRepository.findByLeadId(leadId);
    }

    // Get Follow-Ups By Broker ID
    public List<FollowUp> getFollowUpsByBrokerId(Long brokerId) {
        return followUpRepository.findByBrokerId(brokerId);
    }

    // Update Follow-Up
    public FollowUp updateFollowUp(Long id, FollowUp followUpDetails) {

        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Follow-up not found"));

        followUp.setLeadId(followUpDetails.getLeadId());
        followUp.setBrokerId(followUpDetails.getBrokerId());
        followUp.setFollowUpDate(followUpDetails.getFollowUpDate());
        followUp.setRemarks(followUpDetails.getRemarks());
        followUp.setStatus(followUpDetails.getStatus());

        return followUpRepository.save(followUp);
    }

    // Delete Follow-Up
    public void deleteFollowUp(Long id) {

        if (!followUpRepository.existsById(id)) {
            throw new RuntimeException("Follow-up not found");
        }

        followUpRepository.deleteById(id);
    }
}