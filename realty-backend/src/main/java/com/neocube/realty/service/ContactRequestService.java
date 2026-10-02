package com.neocube.realty.service;

import com.neocube.realty.entity.ContactRequest;
import com.neocube.realty.repository.ContactRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactRequestService {

    private final ContactRequestRepository contactRequestRepository;

    public ContactRequestService(ContactRequestRepository contactRequestRepository) {
        this.contactRequestRepository = contactRequestRepository;
    }

    public ContactRequest createContactRequest(ContactRequest contactRequest) {
        return contactRequestRepository.save(contactRequest);
    }

    public List<ContactRequest> getAllContactRequests() {
        return contactRequestRepository.findAll();
    }
}