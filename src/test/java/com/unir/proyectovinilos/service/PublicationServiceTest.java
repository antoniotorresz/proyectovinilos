package com.unir.proyectovinilos.service;

import com.unir.proyectovinilos.entity.Publication;
import com.unir.proyectovinilos.repository.PublicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class PublicationServiceTest {

    @Mock
    private PublicationRepository publicationRepository;

    @InjectMocks
    private PublicationService publicationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllPublications() {
        Publication publication1 = new Publication();
        publication1.setId(1);
        Publication publication2 = new Publication();
        publication2.setId(2);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Publication> mockPage = new PageImpl<>(
                Arrays.asList(publication1, publication2), pageable, 2);

        when(publicationRepository.findAll(pageable)).thenReturn(mockPage);

        Page<Publication> publications = publicationService.getAllPublications(pageable);

        assertEquals(2, publications.getTotalElements());
        verify(publicationRepository, times(1)).findAll(pageable);
    }

    @Test
    void testGetPublicationById() {
        Publication publication = new Publication();
        publication.setId(1);

        when(publicationRepository.findById(1)).thenReturn(Optional.of(publication));

        Optional<Publication> result = publicationService.getPublicationById(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getId());
        verify(publicationRepository, times(1)).findById(1);
    }

    @Test
    void testCreatePublication() {
        Publication publication = new Publication();
        publication.setId(1);

        when(publicationRepository.save(publication)).thenReturn(publication);

        Publication result = publicationService.createPublication(publication);

        assertNotNull(result);
        assertEquals(1, result.getId());
        verify(publicationRepository, times(1)).save(publication);
    }

    @Test
    void testUpdatePublication() {
        Publication existingPublication = new Publication();
        existingPublication.setId(1);
        existingPublication.setName("Old Name");

        Publication updatedPublication = new Publication();
        updatedPublication.setName("New Name");

        when(publicationRepository.findById(1)).thenReturn(Optional.of(existingPublication));
        when(publicationRepository.save(existingPublication)).thenReturn(existingPublication);

        Publication result = publicationService.updatePublication(1, updatedPublication);

        assertNotNull(result);
        assertEquals("New Name", result.getName());
        verify(publicationRepository, times(1)).findById(1);
        verify(publicationRepository, times(1)).save(existingPublication);
    }

    @Test
    void testDeletePublication() {
        doNothing().when(publicationRepository).deleteById(1);

        publicationService.deletePublication(1);

        verify(publicationRepository, times(1)).deleteById(1);
    }

    @Test
    void testFindByArtist() {
        Publication publication = new Publication();
        publication.setArtist("Test Artist");

        Pageable pageable = PageRequest.of(0, 10);
        Page<Publication> mockPage = new PageImpl<>(List.of(publication), pageable, 1);

        when(publicationRepository.findByArtistContainingIgnoreCase(eq("Test Artist"), any(Pageable.class)))
                .thenReturn(mockPage);

        Page<Publication> result = publicationService.findByArtist("Test Artist", pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals("Test Artist", result.getContent().get(0).getArtist());
        verify(publicationRepository, times(1))
                .findByArtistContainingIgnoreCase(eq("Test Artist"), any(Pageable.class));
    }

    @Test
    void testFindByGenre() {
        Publication publication = new Publication();
        publication.setGenre("Rock");

        Pageable pageable = PageRequest.of(0, 10);
        Page<Publication> mockPage = new PageImpl<>(List.of(publication), pageable, 1);

        when(publicationRepository.findByGenreIgnoreCase(eq("Rock"), any(Pageable.class)))
                .thenReturn(mockPage);

        Page<Publication> result = publicationService.findByGenre("Rock", pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals("Rock", result.getContent().get(0).getGenre());
        verify(publicationRepository, times(1))
                .findByGenreIgnoreCase(eq("Rock"), any(Pageable.class));
    }
}