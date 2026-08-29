package com.unir.proyectovinilos.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unir.proyectovinilos.entity.Comment;
import com.unir.proyectovinilos.service.CommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/publication/{publicationId}")
    public ResponseEntity<List<Comment>> getCommentsByPublication(
            @PathVariable Integer publicationId) {

        return ResponseEntity.ok(
            commentService.getCommentsByPublication(publicationId)
        );
    }

    @PostMapping
    public ResponseEntity<Comment> saveComment(
            @RequestBody Comment comment) {

        return ResponseEntity.ok(
            commentService.saveComment(comment)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id) {

        commentService.deleteComment(id);

        return ResponseEntity.noContent().build();
    }
}
