package com.neocube.realty.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.neocube.realty.entity.Customer;
import com.neocube.realty.repository.CustomerRepository;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Optional<Customer> getCustomerById(Long customerId) {
        return customerRepository.findById(customerId);
    }

    public Customer login(String email, String password) {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!password.equals(customer.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        return customer;
    }
}