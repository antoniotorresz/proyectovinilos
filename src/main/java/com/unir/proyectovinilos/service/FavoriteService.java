package com.unir.proyectovinilos.service;

import com.unir.proyectovinilos.dto.TopFavorite;
import com.unir.proyectovinilos.entity.Favorite;
import com.unir.proyectovinilos.entity.Publication;
import com.unir.proyectovinilos.entity.User;
import java.util.Optional;
import com.unir.proyectovinilos.repository.FavoriteRepository;
import com.unir.proyectovinilos.repository.PublicationRepository;
import com.unir.proyectovinilos.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final PublicationRepository publicationRepository;

    public Favorite addFavorite(Long userId, Integer publicationId) {
        // avoid duplicates
        if (favoriteRepository.existsByUserIdAndPublicationId(userId, publicationId)) {
            throw new IllegalStateException("User already added this publication as favorite");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new IllegalArgumentException("Publication not found"));

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setPublication(publication);

        return favoriteRepository.save(favorite);
    }

    public void removeFromFavorite(Long userId, Integer publicationId) {
        if (!favoriteRepository.existsByUserIdAndPublicationId(userId, publicationId)) {
            throw new IllegalArgumentException("This favorite does not exists");
        }
        favoriteRepository.deleteByUserIdAndPublicationId(userId, publicationId);
    }

    public List<Favorite> listUserFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId);
    }

    public List<TopFavorite> getTopNFavorites(Integer n) {
        List<Object[]> rows = favoriteRepository.getTopPublicationIdsWithCount(n);

        return rows.stream().map(row -> {
            Integer publicationId = (Integer) row[0];
            Long likeCount = ((Number) row[1]).longValue();

            Optional<Publication> publicationOptional = publicationRepository.findById(publicationId);

            if (publicationOptional.isPresent()) return new TopFavorite(likeCount, publicationOptional.get());
            else return null;

        }).filter(tf -> tf != null)
        .collect(Collectors.toList());
    }
}