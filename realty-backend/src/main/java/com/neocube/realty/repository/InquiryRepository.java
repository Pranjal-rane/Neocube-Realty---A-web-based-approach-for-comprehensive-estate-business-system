package com.neocube.realty.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neocube.realty.entity.Inquiry;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
}