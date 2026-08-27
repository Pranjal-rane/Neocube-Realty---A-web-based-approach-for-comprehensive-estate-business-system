package com.neocube.realty.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neocube.realty.entity.LeadAssignment;

public interface LeadAssignmentRepository extends JpaRepository<LeadAssignment, Long> {

    List<LeadAssignment> findAllByOrderByAssignedAtDesc();

    List<LeadAssignment> findByLeadId(Long leadId);

    List<LeadAssignment> findByBrokerId(Long brokerId);
}