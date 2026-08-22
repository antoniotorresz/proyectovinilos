package com.unir.proyectovinilos.controller;

import com.unir.proyectovinilos.entity.Publication;
import com.unir.proyectovinilos.service.PublicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow requests from your React frontend
public class PublicationController {
    
    private final PublicationService publicationService;
    
    // GET /api/publications - Get all publications
    @GetMapping
    public ResponseEntity<List<Publication>> getAllPublications() {
        return ResponseEntity.ok(publicationService.getAllPublications());
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
    public ResponseEntity<List<Publication>> searchByArtist(@RequestParam String name) {
        return ResponseEntity.ok(publicationService.findByArtist(name));
    }
    
    // GET /api/publications/search/genre?name=Rock - Search by genre
    @GetMapping("/search/genre")
    public ResponseEntity<List<Publication>> searchByGenre(@RequestParam String name) {
        return ResponseEntity.ok(publicationService.findByGenre(name));
    }

    // GET /api/publications/user/1 - Search by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Publication>> getPublicationsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(publicationService.findByUser(userId));
    }
    
}