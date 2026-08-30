package com.unir.proyectovinilos.controller;

import com.unir.proyectovinilos.entity.Favorite;
import com.unir.proyectovinilos.dto.TopFavorite;
import com.unir.proyectovinilos.service.FavoriteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    // Add favorite
    @PostMapping
    public ResponseEntity<Favorite> addFavorite(
            @RequestParam Long userId,
            @RequestParam Integer publicationId) {
        Favorite favorite = favoriteService.addFavorite(userId, publicationId);
        return ResponseEntity.status(HttpStatus.CREATED).body(favorite);
    }

    // Remove favorite
    @DeleteMapping
    public ResponseEntity<Void> removeFromFavorite(
            @RequestParam Long userId,
            @RequestParam Integer publicationId) {
        favoriteService.removeFromFavorite(userId, publicationId);
        return ResponseEntity.noContent().build();
    }

    // List user's favorites
    @GetMapping("/{userId}")
    public ResponseEntity<List<Favorite>> listUserFavorites(@PathVariable Long userId) {
        return ResponseEntity.ok(favoriteService.listUserFavorites(userId));
    }

    @GetMapping("/top")
    public ResponseEntity<List<TopFavorite>> getTopNFavorites(@RequestParam Integer n) {
        return ResponseEntity.ok(favoriteService.getTopNFavorites(n));
    }
}