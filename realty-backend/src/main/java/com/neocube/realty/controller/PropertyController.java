package com.neocube.realty.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;

import com.neocube.realty.entity.Property;
import com.neocube.realty.service.PropertyService;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public List<Property> getAllProperties() {
        return propertyService.getAllProperties();
    }

    @GetMapping("/search")
    public List<Property> searchByLocation(@RequestParam String location) {
        return propertyService.searchByLocation(location);
    }

    @GetMapping("/search/bhk")
    public List<Property> searchByBhk(@RequestParam Integer bhk) {
        return propertyService.searchByBhk(bhk);
    }

    @GetMapping("/search/type")
    public List<Property> searchByPropertyType(@RequestParam String propertyType) {
        return propertyService.searchByPropertyType(propertyType);
    }

    @GetMapping("/search/price")
    public List<Property> searchByMaxPrice(@RequestParam BigDecimal maxPrice) {
        return propertyService.searchByMaxPrice(maxPrice);
    }

    @GetMapping("/search/status")
    public List<Property> searchByStatus(@RequestParam String status) {
        return propertyService.searchByStatus(status);
    }

    @GetMapping("/filter")
    public List<Property> filterProperties(
        @RequestParam(required = false) String location,
        @RequestParam(required = false) Integer bhk,
        @RequestParam(required = false) String propertyType,
        @RequestParam(required = false) BigDecimal maxPrice,
        @RequestParam(required = false) String status) {

    return propertyService.searchProperties(
            location,
            bhk,
            propertyType,
            maxPrice,
            status
    );
}

    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable Long id) {
        return propertyService.getPropertyById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Property createProperty(@RequestBody Property property) {
        return propertyService.createProperty(property);
    }

    @PutMapping("/{id}")
    public Property updateProperty(
            @PathVariable Long id,
            @RequestBody Property property) {
        return propertyService.updateProperty(id, property);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);

        
    }
}