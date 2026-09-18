package com.neocube.realty.service;

import com.neocube.realty.entity.Deal;
import com.neocube.realty.repository.DealRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DealService {

    private final DealRepository dealRepository;

    public DealService(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    // Create Deal
    public Deal createDeal(Deal deal) {
        return dealRepository.save(deal);
    }

    // Get All Deals
    public List<Deal> getAllDeals() {
        return dealRepository.findAll();
    }

    // Get Deal By ID
    public Optional<Deal> getDealById(Long id) {
        return dealRepository.findById(id);
    }

    // Get Deal By Booking ID
    public Optional<Deal> getDealByBookingId(Long bookingId) {
        return dealRepository.findByBookingId(bookingId);
    }

    // Get Deals By Customer ID
    public List<Deal> getDealsByCustomerId(Long customerId) {
        return dealRepository.findByCustomerId(customerId);
    }

    // Get Deals By Broker ID
    public List<Deal> getDealsByBrokerId(Long brokerId) {
        return dealRepository.findByBrokerId(brokerId);
    }

    // Get Deals By Property ID
    public List<Deal> getDealsByPropertyId(Long propertyId) {
        return dealRepository.findByPropertyId(propertyId);
    }

    // Get Deals By Status
    public List<Deal> getDealsByStatus(String status) {
        return dealRepository.findByStatus(status);
    }

    // Update Deal
    public Deal updateDeal(Long id, Deal updatedDeal) {

        return dealRepository.findById(id)
                .map(existingDeal -> {

                    existingDeal.setBookingId(
                            updatedDeal.getBookingId()
                    );

                    existingDeal.setCustomerId(
                            updatedDeal.getCustomerId()
                    );

                    existingDeal.setPropertyId(
                            updatedDeal.getPropertyId()
                    );

                    existingDeal.setBrokerId(
                            updatedDeal.getBrokerId()
                    );

                    existingDeal.setDealAmount(
                            updatedDeal.getDealAmount()
                    );

                    existingDeal.setDealDate(
                            updatedDeal.getDealDate()
                    );

                    existingDeal.setStatus(
                            updatedDeal.getStatus()
                    );

                    return dealRepository.save(existingDeal);
                })
                .orElseThrow(() ->
                        new RuntimeException(
                                "Deal not found with ID: " + id
                        )
                );
    }

    // Delete Deal
    public void deleteDeal(Long id) {
        dealRepository.deleteById(id);
    }
}