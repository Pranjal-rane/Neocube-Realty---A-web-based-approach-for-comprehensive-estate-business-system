package com.neocube.realty.repository;

import com.neocube.realty.entity.ContactRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRequestRepository
        extends JpaRepository<ContactRequest, Long> {
}