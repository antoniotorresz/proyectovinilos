package com.unir.proyectovinilos.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import static org.junit.jupiter.api.Assertions.*;

class PublicationTest {

    private Publication publication;

    @BeforeEach
    void setUp() {
        publication = new Publication();
        publication.setName("Test Publication");
        publication.setDescription("This is a test description.");
        publication.setImageUris(new String[]{"image1.jpg", "image2.jpg"});
        publication.setAlbumName("Test Album");
        publication.setArtist("Test Artist");
        publication.setGenre("Rock");
        publication.setReleaseYear(2023);
        publication.setCondition("New");
        publication.setPrice(new BigDecimal("19.99"));
    }

    @Test
    void testPublicationFields() {
        assertEquals("Test Publication", publication.getName());
        assertEquals("This is a test description.", publication.getDescription());
        assertArrayEquals(new String[]{"image1.jpg", "image2.jpg"}, publication.getImageUris());
        assertEquals("Test Album", publication.getAlbumName());
        assertEquals("Test Artist", publication.getArtist());
        assertEquals("Rock", publication.getGenre());
        assertEquals(2023, publication.getReleaseYear());
        assertEquals("New", publication.getCondition());
        assertEquals(new BigDecimal("19.99"), publication.getPrice());
    }

    @Test
    void testCreatedAtIsSetOnPrePersist() {
        publication.onCreate();
        assertEquals(LocalDate.now(), publication.getCreatedAt());
    }

    @Test
    void testToString() {
        String toString = publication.toString();
        assertTrue(toString.contains("Test Publication"));
        assertTrue(toString.contains("Test Album"));
        assertTrue(toString.contains("19.99"));
    }

    @Test
    void testNoArgsConstructor() {
        Publication emptyPublication = new Publication();
        assertNotNull(emptyPublication);
        assertNull(emptyPublication.getName());
        assertNull(emptyPublication.getDescription());
    }

    @Test
    void testAllArgsConstructor() {
        Publication fullPublication = new Publication(
                1,
                "Full Publication",
                "Full description",
                LocalDate.of(2023, 1, 1),
                new String[]{"image1.jpg", "image2.jpg"},
                "Full Album",
                "Full Artist",
                "Pop",
                2022,
                "Used",
                new BigDecimal("29.99"),
                null
        );

        assertEquals(1, fullPublication.getId());
        assertEquals("Full Publication", fullPublication.getName());
        assertEquals("Full description", fullPublication.getDescription());
        assertEquals(LocalDate.of(2023, 1, 1), fullPublication.getCreatedAt());
        assertArrayEquals(new String[]{"image1.jpg", "image2.jpg"}, fullPublication.getImageUris());
        assertEquals("Full Album", fullPublication.getAlbumName());
        assertEquals("Full Artist", fullPublication.getArtist());
        assertEquals("Pop", fullPublication.getGenre());
        assertEquals(2022, fullPublication.getReleaseYear());
        assertEquals("Used", fullPublication.getCondition());
        assertEquals(new BigDecimal("29.99"), fullPublication.getPrice());
    }
}