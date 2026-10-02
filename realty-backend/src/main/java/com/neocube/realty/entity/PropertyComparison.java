package com.neocube.realty.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "property_comparisons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyComparison {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comparison_id")
    private Long comparisonId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "property_id", nullable = false)
    private Long propertyId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}