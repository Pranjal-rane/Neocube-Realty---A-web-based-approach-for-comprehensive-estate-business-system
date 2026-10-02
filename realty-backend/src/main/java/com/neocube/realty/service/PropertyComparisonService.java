package com.neocube.realty.service;

import com.neocube.realty.entity.PropertyComparison;
import com.neocube.realty.repository.PropertyComparisonRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PropertyComparisonService {

    private final PropertyComparisonRepository propertyComparisonRepository;

    public PropertyComparisonService(
            PropertyComparisonRepository propertyComparisonRepository) {
        this.propertyComparisonRepository = propertyComparisonRepository;
    }

    public PropertyComparison addComparison(PropertyComparison comparison) {

        return propertyComparisonRepository
                .findByCustomerIdAndPropertyId(
                        comparison.getCustomerId(),
                        comparison.getPropertyId()
                )
                .orElseGet(() ->
                        propertyComparisonRepository.save(comparison)
                );
    }

    public List<PropertyComparison> getComparisonsByCustomer(Long customerId) {
        return propertyComparisonRepository.findByCustomerId(customerId);
    }

    public void removeComparison(Long customerId, Long propertyId) {

        propertyComparisonRepository
                .findByCustomerIdAndPropertyId(customerId, propertyId)
                .ifPresent(propertyComparisonRepository::delete);
    }
}