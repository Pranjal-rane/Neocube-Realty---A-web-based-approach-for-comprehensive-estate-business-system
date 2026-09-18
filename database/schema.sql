-- =========================================================
-- NEOCUBE REALTY
-- MASTER DATABASE SCHEMA
-- Customer + Admin + Broker
-- =========================================================

CREATE DATABASE IF NOT EXISTS neocube_realty;
USE neocube_realty;


-- =========================================================
-- 1. CUSTOMERS
-- =========================================================

CREATE TABLE customers (
    customer_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- 2. BROKERS
-- =========================================================

CREATE TABLE brokers (
    broker_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    broker_code VARCHAR(20) NOT NULL UNIQUE,

    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL UNIQUE,

    password_hash VARCHAR(255),

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- 3. PROPERTIES
-- Shared by Customer + Admin + Broker
-- =========================================================

CREATE TABLE properties (
    property_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    property_name VARCHAR(200) NOT NULL,
    location VARCHAR(255) NOT NULL,
    property_type VARCHAR(50) NOT NULL,

    bhk TINYINT UNSIGNED DEFAULT 0,
    bathrooms TINYINT UNSIGNED DEFAULT 0,

    price DECIMAL(15,2) NOT NULL,
    area_sqft DECIMAL(10,2),

    owner_name VARCHAR(100),
    owner_phone VARCHAR(15),
    owner_email VARCHAR(150),

    description TEXT,
    image_path VARCHAR(500),

    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    featured BOOLEAN DEFAULT FALSE,

    added_by BIGINT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- 4. PROPERTY PHOTOS
-- Multiple photos for each property
-- =========================================================

CREATE TABLE property_photos (
    photo_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    property_id BIGINT NOT NULL,

    photo_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_property_photo
        FOREIGN KEY (property_id)
        REFERENCES properties(property_id)
        ON DELETE CASCADE
);


-- =========================================================
-- 5. PROPERTY INQUIRIES
-- =========================================================

CREATE TABLE inquiries (
    inquiry_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    customer_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,

    budget VARCHAR(50),
    bhk_preference VARCHAR(20),
    message TEXT,

    inquiry_status VARCHAR(30) DEFAULT 'NEW',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inquiry_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_inquiry_property
        FOREIGN KEY (property_id)
        REFERENCES properties(property_id)
        ON DELETE CASCADE
);


-- =========================================================
-- 6. CUSTOMER FAVORITES
-- =========================================================

CREATE TABLE favorites (
    favorite_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    customer_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_customer_favorite
        UNIQUE (customer_id, property_id),

    CONSTRAINT fk_favorite_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_favorite_property
        FOREIGN KEY (property_id)
        REFERENCES properties(property_id)
        ON DELETE CASCADE
);


-- =========================================================
-- 7. PROPERTY COMPARISONS
-- =========================================================

CREATE TABLE property_comparisons (
    comparison_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    customer_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_customer_comparison
        UNIQUE (customer_id, property_id),

    CONSTRAINT fk_comparison_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comparison_property
        FOREIGN KEY (property_id)
        REFERENCES properties(property_id)
        ON DELETE CASCADE
);


-- =========================================================
-- 8. CONTACT REQUESTS
-- =========================================================

CREATE TABLE contact_requests (
    contact_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),

    message TEXT NOT NULL,

    status VARCHAR(30) DEFAULT 'NEW',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 9. LEADS
-- =========================================================

CREATE TABLE leads (
    lead_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    customer_id BIGINT,
    property_id BIGINT,

    interest VARCHAR(255),
    budget DECIMAL(15,2),

    status ENUM(
        'NEW',
        'CONTACT',
        'SITE_VISITS',
        'NEGOTIATION',
        'BOOKED',
        'CLOSED_WON',
        'LOST'
    ) DEFAULT 'NEW',

    broker_id BIGINT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_lead_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_lead_property
        FOREIGN KEY (property_id)
        REFERENCES properties(property_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_lead_broker
        FOREIGN KEY (broker_id)
        REFERENCES brokers(broker_id)
        ON DELETE SET NULL
);


-- =========================================================
-- 10. LEAD ASSIGNMENTS
-- Keeps assignment/reassignment history
-- =========================================================

CREATE TABLE lead_assignments (
    assignment_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    lead_id BIGINT NOT NULL,
    broker_id BIGINT NULL,

    assigned_by BIGINT,

    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_assignment_lead
        FOREIGN KEY (lead_id)
        REFERENCES leads(lead_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_assignment_broker
        FOREIGN KEY (broker_id)
        REFERENCES brokers(broker_id)
        ON DELETE SET NULL
);


-- =========================================================
-- 11. SITE VISITS
-- Shared by Customer + Admin + Broker
-- =========================================================

CREATE TABLE site_visits (
    site_visit_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    customer_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    broker_id BIGINT NULL,

    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,

    message TEXT,
    map_location VARCHAR(500),

    status VARCHAR(30) NOT NULL DEFAULT 'REQUESTED',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_visit_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_visit_property
        FOREIGN KEY (property_id)
        REFERENCES properties(property_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_visit_broker
        FOREIGN KEY (broker_id)
        REFERENCES brokers(broker_id)
        ON DELETE SET NULL
);


-- =========================================================
-- 12. BOOKINGS
-- Shared by Customer + Admin + Broker
-- =========================================================

CREATE TABLE bookings (
    booking_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    customer_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    broker_id BIGINT NULL,

    booking_date DATE,

    amount DECIMAL(15,2),
    notes TEXT,

    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_booking_property
        FOREIGN KEY (property_id)
        REFERENCES properties(property_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_booking_broker
        FOREIGN KEY (broker_id)
        REFERENCES brokers(broker_id)
        ON DELETE SET NULL
);


-- =========================================================
-- 13. PAYMENTS
-- =========================================================

CREATE TABLE payments (
    payment_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    booking_id BIGINT NOT NULL,

    amount DECIMAL(15,2) NOT NULL,
    payment_date DATE NOT NULL,

    payment_method VARCHAR(50),

    payment_status ENUM(
        'PENDING',
        'SUCCESS',
        'FAILED',
        'REFUNDED'
    ) DEFAULT 'PENDING',

    transaction_reference VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
        ON DELETE CASCADE
);


-- =========================================================
-- 14. DEALS
-- =========================================================

CREATE TABLE deals (
    deal_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    booking_id BIGINT NOT NULL UNIQUE,

    customer_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    broker_id BIGINT,

    deal_amount DECIMAL(15,2) NOT NULL,
    deal_date DATE,

    status ENUM(
        'OPEN',
        'CLOSED',
        'CANCELLED'
    ) DEFAULT 'OPEN',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_deal_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_deal_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_deal_property
        FOREIGN KEY (property_id)
        REFERENCES properties(property_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_deal_broker
        FOREIGN KEY (broker_id)
        REFERENCES brokers(broker_id)
        ON DELETE SET NULL
);


-- =========================================================
-- 15. COMMISSIONS
-- =========================================================

CREATE TABLE commissions (
    commission_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    broker_id BIGINT NOT NULL,
    deal_id BIGINT NOT NULL UNIQUE,

    commission_amount DECIMAL(15,2) NOT NULL,

    status ENUM(
        'PENDING',
        'APPROVED',
        'RELEASED'
    ) DEFAULT 'PENDING',

    approved_at TIMESTAMP NULL,
    released_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_commission_broker
        FOREIGN KEY (broker_id)
        REFERENCES brokers(broker_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_commission_deal
        FOREIGN KEY (deal_id)
        REFERENCES deals(deal_id)
        ON DELETE RESTRICT
);


-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_properties_location
    ON properties(location);

CREATE INDEX idx_properties_status
    ON properties(status);

CREATE INDEX idx_leads_status
    ON leads(status);

CREATE INDEX idx_leads_broker
    ON leads(broker_id);

CREATE INDEX idx_leads_created_at
    ON leads(created_at);

CREATE INDEX idx_site_visits_date
    ON site_visits(preferred_date);

CREATE INDEX idx_bookings_status
    ON bookings(status);

CREATE INDEX idx_deals_status
    ON deals(status);

CREATE INDEX idx_commissions_status
    ON commissions(status);