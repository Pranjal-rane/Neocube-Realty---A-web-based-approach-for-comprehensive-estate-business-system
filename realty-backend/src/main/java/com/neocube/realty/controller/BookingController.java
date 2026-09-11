package com.neocube.realty.controller;

import com.neocube.realty.entity.Booking;
import com.neocube.realty.service.BookingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Create Booking
    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody Booking booking) {

        return ResponseEntity.ok(
                bookingService.createBooking(booking)
        );
    }

    // Get All Bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {

        return ResponseEntity.ok(
                bookingService.getAllBookings()
        );
    }

    // Get Booking By ID
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(
            @PathVariable Long id) {

        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get Bookings By Customer ID
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Booking>> getBookingsByCustomerId(
            @PathVariable Long customerId) {

        return ResponseEntity.ok(
                bookingService.getBookingsByCustomerId(customerId)
        );
    }

    // Get Bookings By Property ID
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Booking>> getBookingsByPropertyId(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                bookingService.getBookingsByPropertyId(propertyId)
        );
    }

    // Get Bookings By Broker ID
    @GetMapping("/broker/{brokerId}")
    public ResponseEntity<List<Booking>> getBookingsByBrokerId(
            @PathVariable Long brokerId) {

        return ResponseEntity.ok(
                bookingService.getBookingsByBrokerId(brokerId)
        );
    }

    // Get Bookings By Status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Booking>> getBookingsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                bookingService.getBookingsByStatus(status)
        );
    }

    // Get Bookings By Payment Status
    @GetMapping("/payment-status/{paymentStatus}")
    public ResponseEntity<List<Booking>> getBookingsByPaymentStatus(
            @PathVariable String paymentStatus) {

        return ResponseEntity.ok(
                bookingService.getBookingsByPaymentStatus(paymentStatus)
        );
    }

    // Update Booking
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(
            @PathVariable Long id,
            @RequestBody Booking booking) {

        return ResponseEntity.ok(
                bookingService.updateBooking(id, booking)
        );
    }

    // Delete Booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(
            @PathVariable Long id) {

        bookingService.deleteBooking(id);

        return ResponseEntity.noContent().build();
    }
}