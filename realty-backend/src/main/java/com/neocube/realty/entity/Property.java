package com.neocube.realty.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "property_id")
    private Long propertyId;


    // =========================
    // BASIC PROPERTY DETAILS
    // =========================

    @Column(name = "property_name", nullable = false, length = 200)
    private String propertyName;

    @Column(name = "location", nullable = false, length = 255)
    private String location;

    @Column(name = "property_type", nullable = false, length = 50)
    private String propertyType;

    @Column(name = "bhk", columnDefinition = "TINYINT UNSIGNED")
    private Integer bhk;

    @Column(name = "bathrooms", columnDefinition = "TINYINT UNSIGNED")
    private Integer bathrooms;

    @Column(name = "price", nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "area_sqft", precision = 10, scale = 2)
    private BigDecimal areaSqft;


    // =========================
    // OWNER DETAILS
    // =========================

    @Column(name = "owner_name", length = 100)
    private String ownerName;

    @Column(name = "owner_phone", length = 15)
    private String ownerPhone;

    @Column(name = "owner_email", length = 150)
    private String ownerEmail;


    // =========================
    // PROPERTY INFORMATION
    // =========================

    @Column(name = "description")
    private String description;

    @Column(name = "image_path", length = 500)
    private String imagePath;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "AVAILABLE";

    @Column(name = "featured")
    private Boolean featured = false;


    // =========================
    // ADMIN / BROKER
    // =========================

    @Column(name = "added_by")
    private Long addedBy;


    // =========================
    // TIMESTAMPS
    // =========================

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
protected void onCreate() {
    LocalDateTime now = LocalDateTime.now();
    createdAt = now;
    updatedAt = now;
}

@PreUpdate
protected void onUpdate() {
    updatedAt = LocalDateTime.now();
}
}