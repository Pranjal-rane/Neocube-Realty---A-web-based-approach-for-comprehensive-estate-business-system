package com.neocube.realty.repository;

import com.neocube.realty.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByCustomerId(Long customerId);

    Optional<Favorite> findByCustomerIdAndPropertyId(
            Long customerId,
            Long propertyId
    );
}