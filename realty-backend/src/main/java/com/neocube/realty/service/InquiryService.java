package com.neocube.realty.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.neocube.realty.entity.Inquiry;
import com.neocube.realty.entity.Lead;
import com.neocube.realty.entity.LeadStatus;
import com.neocube.realty.repository.InquiryRepository;
import com.neocube.realty.repository.LeadRepository;

@Service
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final LeadRepository leadRepository;
    private final LeadAssignmentService leadAssignmentService;

    private static final Pattern NUMBER_PATTERN = Pattern.compile("([0-9]+(\\.[0-9]+)?)");

    public InquiryService(InquiryRepository inquiryRepository,
                           LeadRepository leadRepository,
                           LeadAssignmentService leadAssignmentService) {
        this.inquiryRepository = inquiryRepository;
        this.leadRepository = leadRepository;
        this.leadAssignmentService = leadAssignmentService;
    }

    public List<Inquiry> getAllInquiries() {
        return inquiryRepository.findAll();
    }

    public Inquiry getInquiryById(Long id) {
        return inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inquiry not found with id: " + id));
    }

    public Inquiry createInquiry(Inquiry inquiry) {
        Inquiry savedInquiry = inquiryRepository.save(inquiry);
        createLeadFromInquiry(savedInquiry);
        return savedInquiry;
    }

    private void createLeadFromInquiry(Inquiry inquiry) {
        Lead lead = new Lead();
        lead.setCustomerId(inquiry.getCustomerId());
        lead.setPropertyId(inquiry.getPropertyId());
        lead.setInterest(inquiry.getBhkPreference() != null ? inquiry.getBhkPreference() : inquiry.getMessage());
        lead.setBudget(parseBudget(inquiry.getBudget()));
        lead.setStatus(LeadStatus.NEW);
        lead.setBrokerId(null);

        Lead savedLead = leadRepository.save(lead);
        leadAssignmentService.assignLeadToNextBroker(savedLead);
    }

    private BigDecimal parseBudget(String budgetText) {
        if (budgetText == null || budgetText.isBlank()) {
            return null;
        }

        String lowerText = budgetText.toLowerCase();

        Matcher matcher = NUMBER_PATTERN.matcher(lowerText);
        if (!matcher.find()) {
            return null;
        }

        BigDecimal number;
        try {
            number = new BigDecimal(matcher.group(1));
        } catch (NumberFormatException e) {
            return null;
        }

        if (lowerText.contains("crore") || lowerText.contains("cr")) {
            return number.multiply(BigDecimal.valueOf(10000000));
        } else if (lowerText.contains("lakh") || lowerText.contains("lac")) {
            return number.multiply(BigDecimal.valueOf(100000));
        } else if (lowerText.contains("thousand") || lowerText.contains("k")) {
            return number.multiply(BigDecimal.valueOf(1000));
        }

        return number;
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