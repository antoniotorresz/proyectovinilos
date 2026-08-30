package com.unir.proyectovinilos.repository;

import com.unir.proyectovinilos.entity.Favorite;
import com.unir.proyectovinilos.dto.TopFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Optional<Favorite> findByUserIdAndPublicationId(Long userId, Integer publicationId);

    List<Favorite> findByUserId(Long userId);

    void deleteByUserIdAndPublicationId(Long userId, Integer publicationId);

    boolean existsByUserIdAndPublicationId(Long userId, Integer publicationId);

    @Query(value = """
            SELECT f.publication_id AS publicationId, COUNT(f.id) AS likeCount
            FROM favorites f
            GROUP BY f.publication_id
            ORDER BY likeCount DESC
            LIMIT :n
            """, nativeQuery = true)
    List<Object[]> getTopPublicationIdsWithCount(@Param("n") Integer n);
}