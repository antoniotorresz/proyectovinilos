package com.unir.proyectovinilos.service;

import com.unir.proyectovinilos.entity.Publication;
import com.unir.proyectovinilos.repository.PublicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicationService {
    
    private final PublicationRepository publicationRepository;
    
    public List<Publication> getAllPublications() {
        return publicationRepository.findAll();
    }
    
    public Optional<Publication> getPublicationById(Integer id) {
        return publicationRepository.findById(id);
    }
    
    @Transactional
    public Publication createPublication(Publication publication) {
        return publicationRepository.save(publication);
    }
    
    @Transactional
    public Publication updatePublication(Integer id, Publication updatedPublication) {
        return publicationRepository.findById(id)
            .map(existing -> {
                existing.setName(updatedPublication.getName());
                existing.setDescription(updatedPublication.getDescription());
                existing.setAlbumName(updatedPublication.getAlbumName());
                existing.setArtist(updatedPublication.getArtist());
                existing.setGenre(updatedPublication.getGenre());
                existing.setReleaseYear(updatedPublication.getReleaseYear());
                existing.setCondition(updatedPublication.getCondition());
                existing.setPrice(updatedPublication.getPrice());
                existing.setImageUris(updatedPublication.getImageUris());
                
                existing.setUser(updatedPublication.getUser());
                return publicationRepository.save(existing);
            })
            .orElseThrow(() -> new RuntimeException("Publication not found with id: " + id));
    }
    
    @Transactional
    public void deletePublication(Integer id) {
        publicationRepository.deleteById(id);
    }
    
    public List<Publication> findByArtist(String artist) {
        return publicationRepository.findByArtistContainingIgnoreCase(artist);
    }
    
    public List<Publication> findByGenre(String genre) {
        return publicationRepository.findByGenreIgnoreCase(genre);
    }
    
}