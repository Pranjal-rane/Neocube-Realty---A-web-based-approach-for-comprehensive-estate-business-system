package com.neocube.realty.controller;

import com.neocube.realty.entity.ContactRequest;
import com.neocube.realty.service.ContactRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact-requests")
@CrossOrigin(origins = "*")
public class ContactRequestController {

    private final ContactRequestService contactRequestService;

    public ContactRequestController(ContactRequestService contactRequestService) {
        this.contactRequestService = contactRequestService;
    }

    @PostMapping
    public ResponseEntity<ContactRequest> createContactRequest(
            @RequestBody ContactRequest contactRequest) {

        return ResponseEntity.ok(
                contactRequestService.createContactRequest(contactRequest)
        );
    }

    @GetMapping
    public ResponseEntity<List<ContactRequest>> getAllContactRequests() {
        return ResponseEntity.ok(
                contactRequestService.getAllContactRequests()
        );
    }
}