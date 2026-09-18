package com.neocube.realty.service;

import com.neocube.realty.entity.SiteVisit;
import com.neocube.realty.repository.SiteVisitRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SiteVisitService {

    private final SiteVisitRepository siteVisitRepository;

    public SiteVisitService(SiteVisitRepository siteVisitRepository) {
        this.siteVisitRepository = siteVisitRepository;
    }

    // Create Site Visit
    public SiteVisit createSiteVisit(SiteVisit siteVisit) {
        return siteVisitRepository.save(siteVisit);
    }

    // Get All Site Visits
    public List<SiteVisit> getAllSiteVisits() {
        return siteVisitRepository.findAll();
    }

    // Get Site Visit By ID
    public Optional<SiteVisit> getSiteVisitById(Long id) {
        return siteVisitRepository.findById(id);
    }

    // Get Site Visits By Customer ID
    public List<SiteVisit> getSiteVisitsByCustomerId(Long customerId) {
        return siteVisitRepository.findByCustomerId(customerId);
    }

    // Get Site Visits By Property ID
    public List<SiteVisit> getSiteVisitsByPropertyId(Long propertyId) {
        return siteVisitRepository.findByPropertyId(propertyId);
    }

    // Get Site Visits By Broker ID
    public List<SiteVisit> getSiteVisitsByBrokerId(Long brokerId) {
        return siteVisitRepository.findByBrokerId(brokerId);
    }

    // Get Site Visits By Status
    public List<SiteVisit> getSiteVisitsByStatus(String status) {
        return siteVisitRepository.findByStatus(status);
    }

    // Update Site Visit
    public SiteVisit updateSiteVisit(Long id, SiteVisit updatedSiteVisit) {

        return siteVisitRepository.findById(id)
                .map(existingSiteVisit -> {

                    existingSiteVisit.setCustomerId(
                            updatedSiteVisit.getCustomerId()
                    );

                    existingSiteVisit.setPropertyId(
                            updatedSiteVisit.getPropertyId()
                    );

                    existingSiteVisit.setBrokerId(
                            updatedSiteVisit.getBrokerId()
                    );

                    existingSiteVisit.setVisitDate(
                            updatedSiteVisit.getVisitDate()
                    );

                    existingSiteVisit.setVisitTime(
                            updatedSiteVisit.getVisitTime()
                    );

                    existingSiteVisit.setStatus(
                            updatedSiteVisit.getStatus()
                    );

                    existingSiteVisit.setMapLocation(
                            updatedSiteVisit.getMapLocation()
                    );

                    return siteVisitRepository.save(existingSiteVisit);
                })
                .orElseThrow(() ->
                        new RuntimeException(
                                "Site Visit not found with ID: " + id
                        )
                );
    }

    // Delete Site Visit
    public void deleteSiteVisit(Long id) {
        siteVisitRepository.deleteById(id);
    }
}