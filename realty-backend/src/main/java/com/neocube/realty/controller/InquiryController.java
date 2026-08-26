package com.neocube.realty.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.neocube.realty.entity.Inquiry;
import com.neocube.realty.service.InquiryService;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {

    private final InquiryService inquiryService;

    public InquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    @GetMapping
    public List<Inquiry> getAllInquiries() {
        return inquiryService.getAllInquiries();
    }

    @GetMapping("/{id}")
    public Inquiry getInquiryById(@PathVariable Long id) {
        return inquiryService.getInquiryById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Inquiry createInquiry(@RequestBody Inquiry inquiry) {
        return inquiryService.createInquiry(inquiry);
    }

    @PutMapping("/{id}")
    public Inquiry updateInquiry(
            @PathVariable Long id,
            @RequestBody Inquiry inquiry) {
        return inquiryService.updateInquiry(id, inquiry);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInquiry(@PathVariable Long id) {
        inquiryService.deleteInquiry(id);
    }
}