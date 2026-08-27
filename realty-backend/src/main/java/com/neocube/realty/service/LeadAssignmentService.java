package com.neocube.realty.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.neocube.realty.entity.Broker;
import com.neocube.realty.entity.Lead;
import com.neocube.realty.entity.LeadAssignment;
import com.neocube.realty.repository.BrokerRepository;
import com.neocube.realty.repository.LeadAssignmentRepository;
import com.neocube.realty.repository.LeadRepository;

@Service
public class LeadAssignmentService {

    private static final String ACTIVE_STATUS = "ACTIVE";

    private final BrokerRepository brokerRepository;
    private final LeadRepository leadRepository;
    private final LeadAssignmentRepository leadAssignmentRepository;

    public LeadAssignmentService(BrokerRepository brokerRepository,
                                  LeadRepository leadRepository,
                                  LeadAssignmentRepository leadAssignmentRepository) {
        this.brokerRepository = brokerRepository;
        this.leadRepository = leadRepository;
        this.leadAssignmentRepository = leadAssignmentRepository;
    }

    public void assignLeadToNextBroker(Lead lead) {
        List<Broker> activeBrokers = brokerRepository.findByStatusOrderByBrokerIdAsc(ACTIVE_STATUS);

        if (activeBrokers.isEmpty()) {
            return;
        }

        Broker chosenBroker = determineNextBroker(activeBrokers);

        lead.setBrokerId(chosenBroker.getBrokerId());
        leadRepository.save(lead);

        LeadAssignment assignment = new LeadAssignment();
        assignment.setLeadId(lead.getLeadId());
        assignment.setBrokerId(chosenBroker.getBrokerId());
        assignment.setAssignedBy(null);
        leadAssignmentRepository.save(assignment);
    }

    private Broker determineNextBroker(List<Broker> activeBrokers) {
        List<LeadAssignment> recentAssignments = leadAssignmentRepository.findAllByOrderByAssignedAtDesc();

        if (recentAssignments.isEmpty()) {
            return activeBrokers.get(0);
        }

        Long lastAssignedBrokerId = recentAssignments.get(0).getBrokerId();

        int lastIndex = -1;
        for (int i = 0; i < activeBrokers.size(); i++) {
            if (activeBrokers.get(i).getBrokerId().equals(lastAssignedBrokerId)) {
                lastIndex = i;
                break;
            }
        }

        int nextIndex = (lastIndex + 1) % activeBrokers.size();
        return activeBrokers.get(nextIndex);
    }
}