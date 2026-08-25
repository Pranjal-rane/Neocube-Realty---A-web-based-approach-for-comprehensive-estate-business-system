package com.neocube.realty.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "inquiries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inquiry_id")
    private Long inquiryId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "property_id", nullable = false)
    private Long propertyId;

    @Column(name = "budget", length = 50)
    private String budget;

    @Column(name = "bhk_preference", length = 20)
    private String bhkPreference;

    @Column(name = "message")
    private String message;

    @Column(name = "inquiry_status", length = 30)
    private String inquiryStatus = "NEW";

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}