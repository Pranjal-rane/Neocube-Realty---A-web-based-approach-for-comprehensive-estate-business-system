package com.neocube.realty.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.neocube.realty.entity.Lead;
import com.neocube.realty.entity.LeadStatus;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {

    List<Lead> findByStatus(LeadStatus status);

    List<Lead> findByBrokerId(Long brokerId);

    List<Lead> findByCustomerId(Long customerId);

    List<Lead> findByBrokerIdIsNull();
}