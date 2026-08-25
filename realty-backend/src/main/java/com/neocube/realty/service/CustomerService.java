package com.neocube.realty.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.neocube.realty.entity.Customer;
import com.neocube.realty.repository.CustomerRepository;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerService(
            CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder) {

        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer createCustomer(Customer customer) {

        if (customer.getPasswordHash() != null
                && !customer.getPasswordHash().isBlank()) {

            customer.setPasswordHash(
                    passwordEncoder.encode(customer.getPasswordHash())
            );
        }

        return customerRepository.save(customer);
    }

    public Customer login(String email, String password) {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, customer.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        return customer;
    }
}