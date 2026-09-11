package com.neocube.realty.service;

import com.neocube.realty.entity.Payment;
import com.neocube.realty.repository.PaymentRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    // Create Payment
    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    // Get All Payments
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Get Payment By ID
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    // Get Payments By Booking ID
    public List<Payment> getPaymentsByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }

    // Get Payments By Payment Status
    public List<Payment> getPaymentsByPaymentStatus(String paymentStatus) {
        return paymentRepository.findByPaymentStatus(paymentStatus);
    }

    // Get Payments By Transaction Reference
    public List<Payment> getPaymentsByTransactionReference(
            String transactionReference) {

        return paymentRepository.findByTransactionReference(
                transactionReference
        );
    }

    // Update Payment
    public Payment updatePayment(
            Long id,
            Payment updatedPayment) {

        return paymentRepository.findById(id)
                .map(existingPayment -> {

                    existingPayment.setBookingId(
                            updatedPayment.getBookingId()
                    );

                    existingPayment.setAmount(
                            updatedPayment.getAmount()
                    );

                    existingPayment.setPaymentDate(
                            updatedPayment.getPaymentDate()
                    );

                    existingPayment.setPaymentMethod(
                            updatedPayment.getPaymentMethod()
                    );

                    existingPayment.setPaymentStatus(
                            updatedPayment.getPaymentStatus()
                    );

                    existingPayment.setTransactionReference(
                            updatedPayment.getTransactionReference()
                    );

                    return paymentRepository.save(existingPayment);
                })
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found with ID: " + id
                        )
                );
    }

    // Delete Payment
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}