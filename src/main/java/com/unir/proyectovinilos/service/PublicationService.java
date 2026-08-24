package com.unir.proyectovinilos.service;

import com.unir.proyectovinilos.entity.Publication;
import com.unir.proyectovinilos.repository.PublicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import com.unir.proyectovinilos.entity.User;
import com.unir.proyectovinilos.repository.UserRepository;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicationService {
    
    private final PublicationRepository publicationRepository;

    private final UserRepository userRepository;
    
    public List<Publication> getAllPublications() {
        return publicationRepository.findAll();
    }
    
    public Optional<Publication> getPublicationById(Integer id) {
        return publicationRepository.findById(id);
    }
    
    @Transactional
    public Publication createPublication(Publication publication) {
        if (publication.getUser() != null && publication.getUser().getId() != null) {
            User user = userRepository.findById(publication.getUser().getId())
                .orElseThrow(() -> new RuntimeException(
                    "User not found with id: " + publication.getUser().getId()
                ));

            publication.setUser(user);
        }

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
                existing.setFormat(updatedPublication.getFormat()); 
                if (updatedPublication.getUser() != null && updatedPublication.getUser().getId() != null) {
                    User user = userRepository.findById(updatedPublication.getUser().getId())
                        .orElseThrow(() -> new RuntimeException(
                            "User not found with id: " + updatedPublication.getUser().getId()
                        ));

                    existing.setUser(user);
                }
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

    public List<Publication> findByUser(Long userId) {
        return publicationRepository.findByUserId(userId);
    }

    public List<Publication> search(String query) {
        return publicationRepository
            .findByNameContainingIgnoreCaseOrAlbumNameContainingIgnoreCaseOrArtistContainingIgnoreCase(
                query,
                query,
                query
            );
    }
    
    public List<Publication> filterPublications(
            String q,
            String genre,
            String format,
            String condition,
            BigDecimal minPrice,
            BigDecimal maxPrice) {

        return publicationRepository.filterPublications(
            q,
            genre,
            format,
            condition,
            minPrice,
            maxPrice
        );
    }
}