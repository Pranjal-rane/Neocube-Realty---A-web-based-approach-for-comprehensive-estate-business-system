USE neocube_realty;

-- Update lead statuses for Broker Panel
ALTER TABLE leads
MODIFY COLUMN status ENUM(
    'NEW',
    'CONTACT',
    'SITE_VISITS',
    'NEGOTIATION',
    'BOOKED',
    'CLOSED_WON',
    'LOST'
) DEFAULT 'NEW';


-- Add Broker listing information to existing properties table
ALTER TABLE properties
ADD COLUMN owner_name VARCHAR(100),
ADD COLUMN owner_phone VARCHAR(15),
ADD COLUMN owner_email VARCHAR(150),
ADD COLUMN description TEXT;


-- Store multiple photos for a property
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