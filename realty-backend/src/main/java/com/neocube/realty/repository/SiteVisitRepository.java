package com.neocube.realty.repository;

import com.neocube.realty.entity.SiteVisit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SiteVisitRepository extends JpaRepository<SiteVisit, Long> {

    List<SiteVisit> findByCustomerId(Long customerId);

    List<SiteVisit> findByPropertyId(Long propertyId);

    List<SiteVisit> findByBrokerId(Long brokerId);

    List<SiteVisit> findByStatus(String status);
}