package com.neocube.realty.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neocube.realty.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByEmail(String email);
}