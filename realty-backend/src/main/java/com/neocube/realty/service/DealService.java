package com.neocube.realty.service;

import com.neocube.realty.entity.Commission;
import com.neocube.realty.entity.Deal;
import com.neocube.realty.entity.Property;
import com.neocube.realty.repository.CommissionRepository;
import com.neocube.realty.repository.DealRepository;
import com.neocube.realty.repository.PropertyRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class DealService {

    private final DealRepository dealRepository;
    private final CommissionRepository commissionRepository;
    private final PropertyRepository propertyRepository;

    public DealService(
            DealRepository dealRepository,
            CommissionRepository commissionRepository,
            PropertyRepository propertyRepository) {

        this.dealRepository = dealRepository;
        this.commissionRepository = commissionRepository;
        this.propertyRepository = propertyRepository;
    }

    // Create Deal
    public Deal createDeal(Deal deal) {
        Deal savedDeal = dealRepository.save(deal);

        if ("CLOSED_WON".equalsIgnoreCase(savedDeal.getStatus())) {
            createCommissionIfNeeded(savedDeal);
        }

        return savedDeal;
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

                    Deal savedDeal = dealRepository.save(existingDeal);

                    if ("CLOSED_WON".equalsIgnoreCase(savedDeal.getStatus())) {
                        createCommissionIfNeeded(savedDeal);
                    }

                    return savedDeal;
                })
                .orElseThrow(() ->
                        new RuntimeException(
                                "Deal not found with ID: " + id
                        )
                );
    }

    // Create commission only once for a closed deal
    private void createCommissionIfNeeded(Deal deal) {

        if (deal.getBrokerId() == null ||
            deal.getPropertyId() == null) {
            return;
        }

        Optional<Commission> existingCommission =
                commissionRepository.findByDealId(deal.getDealId());

        if (existingCommission.isPresent()) {
            return;
        }

        Optional<Property> property =
                propertyRepository.findById(deal.getPropertyId());

        if (property.isEmpty() || property.get().getPrice() == null) {
            return;
        }

        BigDecimal propertyPrice = property.get().getPrice();

        BigDecimal commissionRate = BigDecimal.valueOf(2.00);

        BigDecimal commissionAmount =
                propertyPrice
                        .multiply(commissionRate)
                        .divide(BigDecimal.valueOf(100));

        Commission commission = new Commission();

        commission.setDealId(deal.getDealId());
        commission.setBrokerId(deal.getBrokerId());
        commission.setPropertyId(deal.getPropertyId());
        commission.setDealAmount(deal.getDealAmount());
        commission.setCommissionRate(commissionRate);
        commission.setCommissionAmount(commissionAmount);
        commission.setStatus("PENDING");

        commissionRepository.save(commission);
    }

    // Delete Deal
    public void deleteDeal(Long id) {
        dealRepository.deleteById(id);
    }
}
