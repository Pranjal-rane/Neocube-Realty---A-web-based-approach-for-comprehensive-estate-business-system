package com.neocube.realty.controller;

import com.neocube.realty.entity.Favorite;
import com.neocube.realty.service.FavoriteService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    // Add Favorite
    @PostMapping
    public ResponseEntity<Favorite> addFavorite(
            @RequestBody Favorite favorite) {

        return ResponseEntity.ok(
                favoriteService.addFavorite(favorite)
        );
    }

    // Get Customer Favorites
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Favorite>> getCustomerFavorites(
            @PathVariable Long customerId) {

        return ResponseEntity.ok(
                favoriteService.getFavoritesByCustomerId(customerId)
        );
    }

    // Remove Favorite
    @DeleteMapping("/customer/{customerId}/property/{propertyId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable Long customerId,
            @PathVariable Long propertyId) {

        favoriteService.removeFavorite(customerId, propertyId);

        return ResponseEntity.noContent().build();
    }
}