USE neocube_realty;

-- ============================================================
-- NEOCUBE REALTY - CUSTOMER DATABASE OPERATIONS
-- Scope: Pune Customer Site
-- ============================================================


-- ============================================================
-- 1. CUSTOMER REGISTRATION
-- ============================================================

-- Backend will insert a new customer during registration.
-- Password must be hashed by Spring Security before insertion.

INSERT INTO customers
(
    full_name,
    email,
    phone,
    password_hash
)
VALUES
(
    'Customer Name',
    'customer@example.com',
    '9999999999',
    'HASHED_PASSWORD'
);


-- ============================================================
-- 2. FIND CUSTOMER BY EMAIL
-- ============================================================

SELECT
    customer_id,
    full_name,
    email,
    phone,
    created_at
FROM customers
WHERE email = 'customer@example.com';


-- ============================================================
-- 3. CUSTOMER LOGIN
-- ============================================================

-- Backend should retrieve the password_hash using email
-- and allow Spring Security to verify the password.

SELECT
    customer_id,
    full_name,
    email,
    phone,
    password_hash
FROM customers
WHERE email = 'customer@example.com';


-- ============================================================
-- 4. GET ALL PUNE PROPERTIES
-- ============================================================

SELECT
    property_id,
    property_name,
    location,
    price,
    property_type,
    bhk,
    bathrooms,
    area_sqft,
    status,
    featured,
    description,
    image_path
FROM properties
WHERE location LIKE '%, Pune'
ORDER BY created_at DESC;


-- ============================================================
-- 5. GET FEATURED PUNE PROPERTIES
-- ============================================================

SELECT
    property_id,
    property_name,
    location,
    price,
    property_type,
    bhk,
    bathrooms,
    area_sqft,
    status,
    description,
    image_path
FROM properties
WHERE location LIKE '%, Pune'
  AND featured = TRUE
ORDER BY property_id;


-- ============================================================
-- 6. GET PROPERTY DETAILS
-- ============================================================

SELECT
    property_id,
    property_name,
    location,
    price,
    property_type,
    bhk,
    bathrooms,
    area_sqft,
    status,
    featured,
    description,
    image_path
FROM properties
WHERE property_id = 9;


-- ============================================================
-- 7. SEARCH PROPERTIES
-- ============================================================

SELECT
    property_id,
    property_name,
    location,
    price,
    property_type,
    bhk,
    bathrooms,
    area_sqft,
    status,
    featured
FROM properties
WHERE location LIKE '%, Pune'
  AND property_name LIKE '%Apartment%'
ORDER BY price ASC;


-- ============================================================
-- 8. FILTER BY PROPERTY TYPE
-- ============================================================

SELECT
    property_id,
    property_name,
    location,
    price,
    property_type,
    bhk,
    area_sqft,
    status
FROM properties
WHERE location LIKE '%, Pune'
  AND property_type = 'Apartment'
ORDER BY price ASC;


-- ============================================================
-- 9. FILTER BY BUDGET
-- ============================================================

SELECT
    property_id,
    property_name,
    location,
    price,
    property_type,
    bhk,
    area_sqft,
    status
FROM properties
WHERE location LIKE '%, Pune'
  AND price <= 10000000
ORDER BY price ASC;


-- ============================================================
-- 10. FILTER BY BHK
-- ============================================================

SELECT
    property_id,
    property_name,
    location,
    price,
    property_type,
    bhk,
    area_sqft,
    status
FROM properties
WHERE location LIKE '%, Pune'
  AND bhk = 2
ORDER BY price ASC;


-- ============================================================
-- 11. CREATE PROPERTY INQUIRY
-- ============================================================

INSERT INTO inquiries
(
    customer_id,
    property_id,
    budget,
    bhk_preference,
    message
)
VALUES
(
    1,
    9,
    'Under 1 Cr',
    '2 BHK',
    'I am interested in this property.'
);


-- ============================================================
-- 12. GET CUSTOMER INQUIRIES
-- ============================================================

SELECT
    i.inquiry_id,
    i.customer_id,
    i.property_id,
    p.property_name,
    p.location,
    p.price,
    i.budget,
    i.bhk_preference,
    i.message,
    i.inquiry_status,
    i.created_at
FROM inquiries i
INNER JOIN properties p
    ON i.property_id = p.property_id
WHERE i.customer_id = 1
ORDER BY i.created_at DESC;


-- ============================================================
-- 13. CREATE SITE VISIT REQUEST
-- ============================================================

INSERT INTO site_visits
(
    customer_id,
    property_id,
    preferred_date,
    preferred_time,
    message
)
VALUES
(
    1,
    9,
    '2026-09-01',
    '10:00:00',
    'I would like to visit the property.'
);


-- ============================================================
-- 14. GET CUSTOMER SITE VISITS
-- ============================================================

SELECT
    sv.visit_id,
    sv.customer_id,
    sv.property_id,
    p.property_name,
    p.location,
    sv.preferred_date,
    sv.preferred_time,
    sv.message,
    sv.visit_status,
    sv.created_at
FROM site_visits sv
INNER JOIN properties p
    ON sv.property_id = p.property_id
WHERE sv.customer_id = 1
ORDER BY sv.preferred_date ASC, sv.preferred_time ASC;


-- ============================================================
-- 15. ADD PROPERTY TO FAVORITES
-- ============================================================

INSERT INTO favorites
(
    customer_id,
    property_id
)
VALUES
(
    1,
    9
);


-- ============================================================
-- 16. GET CUSTOMER FAVORITES
-- ============================================================

SELECT
    f.favorite_id,
    f.property_id,
    p.property_name,
    p.location,
    p.price,
    p.property_type,
    p.bhk,
    p.area_sqft,
    p.status
FROM favorites f
INNER JOIN properties p
    ON f.property_id = p.property_id
WHERE f.customer_id = 1
ORDER BY f.created_at DESC;


-- ============================================================
-- 17. REMOVE PROPERTY FROM FAVORITES
-- ============================================================

DELETE FROM favorites
WHERE customer_id = 1
  AND property_id = 9;


-- ============================================================
-- 18. ADD PROPERTY TO COMPARISON
-- ============================================================

INSERT INTO property_comparisons
(
    customer_id,
    property_id
)
VALUES
(
    1,
    9
);


-- ============================================================
-- 19. GET CUSTOMER COMPARISON PROPERTIES
-- ============================================================

SELECT
    pc.comparison_id,
    pc.property_id,
    p.property_name,
    p.location,
    p.price,
    p.property_type,
    p.bhk,
    p.bathrooms,
    p.area_sqft,
    p.status
FROM property_comparisons pc
INNER JOIN properties p
    ON pc.property_id = p.property_id
WHERE pc.customer_id = 1
ORDER BY pc.created_at DESC;


-- ============================================================
-- 20. REMOVE PROPERTY FROM COMPARISON
-- ============================================================

DELETE FROM property_comparisons
WHERE customer_id = 1
  AND property_id = 9;


-- ============================================================
-- 21. GET CUSTOMER BOOKINGS / DEALS
-- ============================================================

SELECT
    b.booking_id,
    b.property_id,
    p.property_name,
    p.location,
    p.price,
    b.booking_date,
    b.booking_status,
    b.deal_amount,
    b.notes,
    b.created_at
FROM bookings b
INNER JOIN properties p
    ON b.property_id = p.property_id
WHERE b.customer_id = 1
ORDER BY b.created_at DESC;


-- ============================================================
-- 22. CREATE CONTACT REQUEST
-- ============================================================

INSERT INTO contact_requests
(
    customer_name,
    email,
    phone,
    message
)
VALUES
(
    'Customer Name',
    'customer@example.com',
    '9999999999',
    'I would like more information about NeoCube Realty.'
);


-- ============================================================
-- 23. CUSTOMER DASHBOARD SUMMARY
-- ============================================================

SELECT
    (SELECT COUNT(*)
     FROM inquiries
     WHERE customer_id = 1) AS total_inquiries,

    (SELECT COUNT(*)
     FROM site_visits
     WHERE customer_id = 1) AS total_site_visits,

    (SELECT COUNT(*)
     FROM favorites
     WHERE customer_id = 1) AS total_favorites,

    (SELECT COUNT(*)
     FROM property_comparisons
     WHERE customer_id = 1) AS total_comparisons,

    (SELECT COUNT(*)
     FROM bookings
     WHERE customer_id = 1) AS total_bookings;


-- ============================================================
-- 24. DATABASE VERIFICATION
-- ============================================================

SELECT
    'customers' AS table_name,
    COUNT(*) AS record_count
FROM customers

UNION ALL

SELECT
    'properties',
    COUNT(*)
FROM properties

UNION ALL

SELECT
    'inquiries',
    COUNT(*)
FROM inquiries

UNION ALL

SELECT
    'site_visits',
    COUNT(*)
FROM site_visits

UNION ALL

SELECT
    'favorites',
    COUNT(*)
FROM favorites

UNION ALL

SELECT
    'property_comparisons',
    COUNT(*)
FROM property_comparisons

UNION ALL

SELECT
    'bookings',
    COUNT(*)
FROM bookings

UNION ALL

SELECT
    'contact_requests',
    COUNT(*)
FROM contact_requests;


-- ============================================================
-- 25. IMPORTANT DATABASE INDEXES
-- ============================================================

CREATE INDEX idx_properties_location
ON properties(location);

CREATE INDEX idx_properties_type
ON properties(property_type);

CREATE INDEX idx_properties_price
ON properties(price);

CREATE INDEX idx_properties_bhk
ON properties(bhk);

CREATE INDEX idx_properties_status
ON properties(status);

CREATE INDEX idx_inquiries_customer
ON inquiries(customer_id);

CREATE INDEX idx_site_visits_customer
ON site_visits(customer_id);

CREATE INDEX idx_favorites_customer
ON favorites(customer_id);

CREATE INDEX idx_comparisons_customer
ON property_comparisons(customer_id);

CREATE INDEX idx_bookings_customer
ON bookings(customer_id);