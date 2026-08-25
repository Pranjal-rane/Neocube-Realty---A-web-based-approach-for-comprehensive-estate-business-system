package com.neocube.realty.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.neocube.realty.entity.Property;
import com.neocube.realty.repository.PropertyRepository;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));
    }

    public Property createProperty(Property property) {
        return propertyRepository.save(property);
    }

    public Property updateProperty(Long id, Property propertyDetails) {
        Property property = getPropertyById(id);

        property.setPropertyName(propertyDetails.getPropertyName());
        property.setLocation(propertyDetails.getLocation());
        property.setPrice(propertyDetails.getPrice());
        property.setPropertyType(propertyDetails.getPropertyType());
        property.setBhk(propertyDetails.getBhk());
        property.setBathrooms(propertyDetails.getBathrooms());
        property.setAreaSqft(propertyDetails.getAreaSqft());
        property.setStatus(propertyDetails.getStatus());
        property.setFeatured(propertyDetails.getFeatured());
        property.setDescription(propertyDetails.getDescription());
        property.setImagePath(propertyDetails.getImagePath());

        return propertyRepository.save(property);
    }

    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }
}