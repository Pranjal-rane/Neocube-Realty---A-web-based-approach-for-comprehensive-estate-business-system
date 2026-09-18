package com.neocube.realty.service;

import com.neocube.realty.entity.Booking;
import com.neocube.realty.repository.BookingRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // Create Booking
    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    // Get All Bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get Booking By ID
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    // Get By Customer ID
    public List<Booking> getBookingsByCustomerId(Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    // Get By Property ID
    public List<Booking> getBookingsByPropertyId(Long propertyId) {
        return bookingRepository.findByPropertyId(propertyId);
    }

    // Get By Broker ID
    public List<Booking> getBookingsByBrokerId(Long brokerId) {
        return bookingRepository.findByBrokerId(brokerId);
    }

    // Get By Status
    public List<Booking> getBookingsByStatus(String status) {
        return bookingRepository.findByStatus(status);
    }

    // Get By Payment Status
    public List<Booking> getBookingsByPaymentStatus(String paymentStatus) {
        return bookingRepository.findByPaymentStatus(paymentStatus);
    }

    // Update Booking
    public Booking updateBooking(Long id, Booking updatedBooking) {

        return bookingRepository.findById(id)
                .map(existingBooking -> {

                    existingBooking.setCustomerId(
                            updatedBooking.getCustomerId()
                    );

                    existingBooking.setPropertyId(
                            updatedBooking.getPropertyId()
                    );

                    existingBooking.setBrokerId(
                            updatedBooking.getBrokerId()
                    );

                    existingBooking.setAmount(
                            updatedBooking.getAmount()
                    );

                    existingBooking.setPaymentStatus(
                            updatedBooking.getPaymentStatus()
                    );

                    existingBooking.setStatus(
                            updatedBooking.getStatus()
                    );

                    existingBooking.setBookingDate(
                            updatedBooking.getBookingDate()
                    );

                    return bookingRepository.save(existingBooking);
                })
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found with ID: " + id
                        )
                );
    }

    // Delete Booking
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}