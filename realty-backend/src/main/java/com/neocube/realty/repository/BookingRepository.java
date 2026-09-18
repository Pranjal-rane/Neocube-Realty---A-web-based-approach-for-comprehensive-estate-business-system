package com.neocube.realty.repository;

import com.neocube.realty.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerId(Long customerId);

    List<Booking> findByPropertyId(Long propertyId);

    List<Booking> findByBrokerId(Long brokerId);

    List<Booking> findByStatus(String status);

    List<Booking> findByPaymentStatus(String paymentStatus);
}