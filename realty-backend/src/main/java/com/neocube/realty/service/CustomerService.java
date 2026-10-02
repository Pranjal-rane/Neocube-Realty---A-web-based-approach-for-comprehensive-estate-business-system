package com.neocube.realty.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.neocube.realty.entity.Customer;
import com.neocube.realty.repository.CustomerRepository;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public CustomerService(CustomerRepository customerRepository,
                           PasswordEncoder passwordEncoder,
                           EmailService emailService) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer createCustomer(Customer customer) {

        // Encrypt password
        customer.setPasswordHash(
                passwordEncoder.encode(customer.getPasswordHash())
        );

        // Generate 6-digit OTP
        String otp = String.valueOf(
                ThreadLocalRandom.current().nextInt(100000, 1000000)
        );

        // Customer is not verified initially
        customer.setEmailVerified(false);

        // Store OTP
        customer.setVerificationOtp(otp);

        // OTP expires after 10 minutes
        customer.setOtpExpiresAt(
                LocalDateTime.now().plusMinutes(10)
        );

        // Save customer first
        Customer savedCustomer = customerRepository.save(customer);

        // Send OTP to customer's email
        emailService.sendVerificationOtp(
                savedCustomer.getEmail(),
                otp
        );

        return savedCustomer;
    }

    public Customer verifyOtp(String email, String otp) {

    Customer customer = customerRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("Customer not found")
            );

    // Check if already verified
    if (Boolean.TRUE.equals(customer.getEmailVerified())) {
        throw new RuntimeException("Email is already verified");
    }

    // Check OTP
    if (customer.getVerificationOtp() == null ||
        !customer.getVerificationOtp().equals(otp)) {

        throw new RuntimeException("Invalid OTP");
    }

    // Check expiry
    if (customer.getOtpExpiresAt() == null ||
        LocalDateTime.now().isAfter(customer.getOtpExpiresAt())) {

        throw new RuntimeException("OTP has expired");
    }

    // Mark email as verified
    customer.setEmailVerified(true);

    // OTP no longer needed
    customer.setVerificationOtp(null);
    customer.setOtpExpiresAt(null);

    return customerRepository.save(customer);
}

    public Optional<Customer> getCustomerById(Long customerId) {
        return customerRepository.findById(customerId);
    }

    public Customer login(String email, String password) {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        if (!passwordEncoder.matches(
                password,
                customer.getPasswordHash()
        )) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!Boolean.TRUE.equals(customer.getEmailVerified())) {
    throw new RuntimeException(
            "Please verify your email before logging in"
    );
}

        return customer;
    }
}