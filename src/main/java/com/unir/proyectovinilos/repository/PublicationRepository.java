package com.unir.proyectovinilos.repository;

import com.unir.proyectovinilos.entity.Publication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, Integer> {
    
    
    List<Publication> findByArtistContainingIgnoreCase(String artist);
    List<Publication> findByGenre(String genre);
    
    List<Publication> findByReleaseYear(Integer year);
    List<Publication> findByGenreIgnoreCase(String genre);
    List<Publication> findByUserId(Long userId);
}