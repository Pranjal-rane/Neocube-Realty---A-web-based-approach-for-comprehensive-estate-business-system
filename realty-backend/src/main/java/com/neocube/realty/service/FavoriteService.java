package com.neocube.realty.service;

import com.neocube.realty.entity.Favorite;
import com.neocube.realty.repository.FavoriteRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    public FavoriteService(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    // Add Favorite
    public Favorite addFavorite(Favorite favorite) {

        return favoriteRepository
                .findByCustomerIdAndPropertyId(
                        favorite.getCustomerId(),
                        favorite.getPropertyId()
                )
                .orElseGet(() -> favoriteRepository.save(favorite));
    }

    // Get Customer Favorites
    public List<Favorite> getFavoritesByCustomerId(Long customerId) {
        return favoriteRepository.findByCustomerId(customerId);
    }

    // Remove Favorite
    public void removeFavorite(Long customerId, Long propertyId) {

        favoriteRepository
                .findByCustomerIdAndPropertyId(customerId, propertyId)
                .ifPresent(favoriteRepository::delete);
    }
}