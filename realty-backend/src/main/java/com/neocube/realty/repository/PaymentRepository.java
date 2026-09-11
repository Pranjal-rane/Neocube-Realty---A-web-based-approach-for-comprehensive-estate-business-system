package com.neocube.realty.repository;

import com.neocube.realty.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByBookingId(Long bookingId);

    List<Payment> findByPaymentStatus(String paymentStatus);

    List<Payment> findByTransactionReference(String transactionReference);
}