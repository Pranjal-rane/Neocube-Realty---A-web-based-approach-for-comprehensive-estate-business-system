package com.neocube.realty.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neocube.realty.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}