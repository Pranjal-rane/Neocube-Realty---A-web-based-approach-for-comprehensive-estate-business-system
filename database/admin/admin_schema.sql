-- =========================================================
-- NEOCUBE REALTY
-- ADMIN PANEL DATABASE SCHEMA
-- =========================================================

USE neocube_realty;


-- =========================================================
-- 1. PROPERTIES
-- Admin: Properties Management
-- =========================================================

CREATE TABLE properties (
    property_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    property_title VARCHAR(200) NOT NULL,
    location VARCHAR(255) NOT NULL,

    bhk INT NOT NULL,

    property_type ENUM(
        'APARTMENT',
        'VILLA',
        'PENTHOUSE'
    ) NOT NULL,

    price DECIMAL(15,2) NOT NULL,
    area_sqft DECIMAL(10,2) NOT NULL,

    owner_name VARCHAR(100),
    owner_phone VARCHAR(15),
    owner_email VARCHAR(150),

    description TEXT,

    status ENUM(
        'AVAILABLE',
        'BOOKED',
        'SOLD',
        'INACTIVE'
    ) DEFAULT 'AVAILABLE',

    added_by BIGINT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- 2. BROKERS
-- Admin: Broker Management
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
-- 3. LEADS
-- Admin: Lead Management
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
-- 4. LEAD ASSIGNMENTS
-- Admin: Reassign Lead
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
-- 5. SITE VISITS
-- Admin: Site Visit Management
-- =========================================================

CREATE TABLE site_visits (
    site_visit_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    customer_id BIGINT NOT NULL,

    property_id BIGINT NOT NULL,

    broker_id BIGINT,

    visit_date DATE NOT NULL,
    visit_time TIME NOT NULL,

    status ENUM(
        'SCHEDULED',
        'COMPLETED',
        'CANCELLED',
        'RESCHEDULED'
    ) DEFAULT 'SCHEDULED',

    map_location VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

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
-- 6. BOOKINGS
-- Admin: Booking Management
-- =========================================================

CREATE TABLE bookings (
    booking_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    customer_id BIGINT NOT NULL,

    property_id BIGINT NOT NULL,

    broker_id BIGINT,

    amount DECIMAL(15,2) NOT NULL,

    payment_status ENUM(
        'PENDING',
        'PARTIAL',
        'PAID',
        'FAILED'
    ) DEFAULT 'PENDING',

    status ENUM(
        'PENDING',
        'CONFIRMED',
        'CANCELLED',
        'COMPLETED'
    ) DEFAULT 'PENDING',

    booking_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

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
-- 7. PAYMENTS
-- Admin: Payment information
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
-- 8. DEALS
-- Admin Dashboard: Deal Closed
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
-- 9. COMMISSIONS
-- Admin: Commission Management
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
-- For faster searching and reports
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
ON site_visits(visit_date);

CREATE INDEX idx_bookings_status
ON bookings(status);

CREATE INDEX idx_deals_status
ON deals(status);

CREATE INDEX idx_commissions_status
ON commissions(status);