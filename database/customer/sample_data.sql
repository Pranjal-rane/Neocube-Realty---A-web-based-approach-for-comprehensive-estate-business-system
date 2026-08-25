USE neocube_realty;

-- ============================================
-- INITIAL PUNE PROPERTY DATA
-- ============================================

INSERT INTO properties
(
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
)
VALUES
(
    'Premium 2 BHK Apartment',
    'Kharadi, Pune',
    6500000.00,
    'Apartment',
    2,
    2,
    1100,
    'Ready to Move',
    TRUE,
    'A modern 2 BHK apartment in Kharadi with excellent connectivity and contemporary amenities.',
    'property-1.png'
),
(
    'Luxury 3 BHK Apartment',
    'Baner, Pune',
    9500000.00,
    'Apartment',
    3,
    3,
    1650,
    'Ready to Move',
    TRUE,
    'A spacious luxury 3 BHK apartment in Baner designed for comfortable premium living.',
    'property-2.png'
),
(
    'Modern 3 BHK Villa',
    'Wakad, Pune',
    12500000.00,
    'Villa',
    3,
    3,
    2200,
    'Ready to Move',
    TRUE,
    'A contemporary villa in Wakad offering spacious interiors and convenient access to major areas of Pune.',
    'property-3.png'
),
(
    'Commercial Office Space',
    'Hinjewadi, Pune',
    8500000.00,
    'Office',
    0,
    2,
    1500,
    'Ready to Move',
    TRUE,
    'A professional commercial office space suitable for startups, IT companies and growing businesses.',
    'property-4.png'
),
(
    'Elegant 2 BHK Residence',
    'Viman Nagar, Pune',
    7200000.00,
    'Apartment',
    2,
    2,
    1150,
    'Ready to Move',
    FALSE,
    'A comfortable 2 BHK residence in Viman Nagar with convenient access to major city facilities.',
    'property-5.png'
),
(
    'Greenview 3 BHK Apartment',
    'Wagholi, Pune',
    5800000.00,
    'Apartment',
    3,
    3,
    1400,
    'Under Construction',
    FALSE,
    'A thoughtfully planned 3 BHK apartment in Wagholi with modern amenities and peaceful surroundings.',
    'property-6.png'
),
(
    'Prime Retail Shop',
    'Kothrud, Pune',
    7500000.00,
    'Shop',
    0,
    1,
    800,
    'Ready to Move',
    FALSE,
    'A strategically located retail shop suitable for customer-facing businesses in Kothrud.',
    'property-7.png'
),
(
    'Skyline 4 BHK Penthouse',
    'Kalyani Nagar, Pune',
    18500000.00,
    'Penthouse',
    4,
    4,
    2800,
    'Ready to Move',
    FALSE,
    'A premium 4 BHK penthouse offering expansive living spaces and an upscale Pune lifestyle.',
    'property-8.png'
);