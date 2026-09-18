package com.neocube.realty.repository;

import com.neocube.realty.entity.Deal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DealRepository extends JpaRepository<Deal, Long> {

    Optional<Deal> findByBookingId(Long bookingId);

    List<Deal> findByCustomerId(Long customerId);

    List<Deal> findByPropertyId(Long propertyId);

    List<Deal> findByBrokerId(Long brokerId);

    List<Deal> findByStatus(String status);
}