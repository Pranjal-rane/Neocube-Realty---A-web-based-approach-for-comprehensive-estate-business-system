package com.neocube.realty.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "contact_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contact_id")
    private Long contactId;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "message", nullable = false)
    private String message;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = "NEW";
        }

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}