package com.unir.proyectovinilos.repository;

import com.unir.proyectovinilos.entity.Publication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, Integer> {

    Page<Publication> findByArtistContainingIgnoreCase(String artist, Pageable pageable);

    Page<Publication> findByGenre(String genre, Pageable pageable);

    Page<Publication> findByReleaseYear(Integer year, Pageable pageable);

    Page<Publication> findByGenreIgnoreCase(String genre, Pageable pageable);

    Page<Publication> findByUserId(Long userId, Pageable pageable);

    Page<Publication> findByNameContainingIgnoreCaseOrAlbumNameContainingIgnoreCaseOrArtistContainingIgnoreCase(
            String name,
            String albumName,
            String artist,
            Pageable pageable);

    @Query("""
            SELECT p
            FROM Publication p
            WHERE
                (:q IS NULL OR :q = '' OR
                    LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) OR
                    LOWER(p.albumName) LIKE LOWER(CONCAT('%', :q, '%')) OR
                    LOWER(p.artist) LIKE LOWER(CONCAT('%', :q, '%')))
            AND (:genre IS NULL OR :genre = '' OR LOWER(p.genre) = LOWER(:genre))
            AND (:format IS NULL OR :format = '' OR LOWER(p.format) = LOWER(:format))
            AND (:condition IS NULL OR :condition = '' OR p.condition = :condition)
            AND (:minPrice IS NULL OR p.price >= :minPrice)
            AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            """)
    Page<Publication> filterPublications(
            @Param("q") String q,
            @Param("genre") String genre,
            @Param("format") String format,
            @Param("condition") String condition,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);
}