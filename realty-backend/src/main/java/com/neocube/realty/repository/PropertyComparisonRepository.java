package com.neocube.realty.repository;

import com.neocube.realty.entity.PropertyComparison;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PropertyComparisonRepository
        extends JpaRepository<PropertyComparison, Long> {

    List<PropertyComparison> findByCustomerId(Long customerId);

    Optional<PropertyComparison> findByCustomerIdAndPropertyId(
            Long customerId,
            Long propertyId
    );
}