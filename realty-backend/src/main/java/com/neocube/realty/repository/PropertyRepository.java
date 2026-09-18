package com.neocube.realty.repository;

import java.util.List;
import java.math.BigDecimal;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neocube.realty.entity.Property;


public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByLocationContainingIgnoreCase(String location);

    List<Property> findByBhk(Integer bhk);

    List<Property> findByPropertyTypeIgnoreCase(String propertyType);

    List<Property> findByPriceLessThanEqual(BigDecimal maxPrice);

    List<Property> findByStatusIgnoreCase(String status);

    @Query("""
    SELECT p FROM Property p
    WHERE (:location IS NULL OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%')))
    AND (:bhk IS NULL OR p.bhk = :bhk)
    AND (:propertyType IS NULL OR LOWER(p.propertyType) = LOWER(:propertyType))
    AND (:maxPrice IS NULL OR p.price <= :maxPrice)
    AND (:status IS NULL OR LOWER(p.status) = LOWER(:status))
    """)
    List<Property> searchProperties(
        @Param("location") String location,
        @Param("bhk") Integer bhk,
        @Param("propertyType") String propertyType,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("status") String status
);

}