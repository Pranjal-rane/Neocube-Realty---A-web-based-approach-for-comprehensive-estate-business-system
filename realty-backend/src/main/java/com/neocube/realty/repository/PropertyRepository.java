package com.neocube.realty.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neocube.realty.entity.Property;

public interface PropertyRepository extends JpaRepository<Property, Long> {
}