package com.neocube.realty.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.neocube.realty.entity.Inquiry;
import com.neocube.realty.repository.InquiryRepository;

@Service
public class InquiryService {

    private final InquiryRepository inquiryRepository;

    public InquiryService(InquiryRepository inquiryRepository) {
        this.inquiryRepository = inquiryRepository;
    }

    public List<Inquiry> getAllInquiries() {
        return inquiryRepository.findAll();
    }

    public Inquiry getInquiryById(Long id) {
        return inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inquiry not found with id: " + id));
    }

    public Inquiry createInquiry(Inquiry inquiry) {
        return inquiryRepository.save(inquiry);
    }

    public Inquiry updateInquiry(Long id, Inquiry inquiryDetails) {
        Inquiry inquiry = getInquiryById(id);

        inquiry.setCustomerId(inquiryDetails.getCustomerId());
        inquiry.setPropertyId(inquiryDetails.getPropertyId());
        inquiry.setBudget(inquiryDetails.getBudget());
        inquiry.setBhkPreference(inquiryDetails.getBhkPreference());
        inquiry.setMessage(inquiryDetails.getMessage());
        inquiry.setInquiryStatus(inquiryDetails.getInquiryStatus());

        return inquiryRepository.save(inquiry);
    }

    public void deleteInquiry(Long id) {
        inquiryRepository.deleteById(id);
    }
}