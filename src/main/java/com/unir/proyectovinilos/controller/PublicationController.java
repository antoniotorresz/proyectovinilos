package com.unir.proyectovinilos.controller;

import com.unir.proyectovinilos.entity.Publication;
import com.unir.proyectovinilos.service.PublicationService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/publications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow requests from your React frontend
public class PublicationController {

    private final PublicationService publicationService;

    // GET /api/publications - Get all publications
    @GetMapping
    public ResponseEntity<Page<Publication>> getAllPublications(
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(publicationService.getAllPublications(pageable));
    }

    // GET /api/publications/{id} - Get a publication by ID
    @GetMapping("/{id}")
    public ResponseEntity<Publication> getPublicationById(@PathVariable Integer id) {
        return publicationService.getPublicationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/publications - Create new publication
    @PostMapping
    public ResponseEntity<Publication> createPublication(@RequestBody Publication publication) {
        Publication created = publicationService.createPublication(publication);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT /api/publications/{id} - Update existing publication
    @PutMapping("/{id}")
    public ResponseEntity<Publication> updatePublication(
            @PathVariable Integer id,
            @RequestBody Publication publication) {
        try {
            Publication updated = publicationService.updatePublication(id, publication);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/publications/{id} - Delete publication
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePublication(@PathVariable Integer id) {
        publicationService.deletePublication(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/publications/search/artist?name=Beatles - Search by artist
    @GetMapping("/search/artist")
    public ResponseEntity<Page<Publication>> searchByArtist(
            @RequestParam String name,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(publicationService.findByArtist(name, pageable));
    }

    // GET /api/publications/search/genre?name=Rock - Search by genre
    public ResponseEntity<Page<Publication>> searchByGenre(
            @RequestParam String name,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(publicationService.findByGenre(name, pageable));
    }

    // GET /api/publications/user/1 - Search by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Publication>> getPublicationsByUser(
            @PathVariable Long userId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(publicationService.findByUser(userId, pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Publication>> search(
            @RequestParam String q,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(publicationService.search(q, pageable));
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<Publication>> filterPublications(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String format,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @PageableDefault(size = 10) Pageable pageable) {

        return ResponseEntity.ok(
                publicationService.filterPublications(
                        q, genre, format, condition, minPrice, maxPrice, pageable));
    }

}