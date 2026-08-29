package com.unir.proyectovinilos.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.unir.proyectovinilos.entity.Comment;
import com.unir.proyectovinilos.entity.Publication;
import com.unir.proyectovinilos.entity.User;
import com.unir.proyectovinilos.repository.CommentRepository;
import com.unir.proyectovinilos.repository.PublicationRepository;
import com.unir.proyectovinilos.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final PublicationRepository publicationRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public List<Comment> getCommentsByPublication(Integer publicationId) {
        return commentRepository
            .findByPublicationIdOrderByCreatedAtAsc(publicationId);
    }

    @Transactional
    public Comment saveComment(Comment comment) {

        if (
            comment.getContent() == null ||
            comment.getContent().trim().isEmpty()
        ) {
            throw new RuntimeException("Comment content is required.");
        }

        if (
            comment.getPublication() == null ||
            comment.getPublication().getId() == null
        ) {
            throw new RuntimeException("Publication is required.");
        }

        if (
            comment.getUser() == null ||
            comment.getUser().getId() == null
        ) {
            throw new RuntimeException("User is required.");
        }

        Publication publication = publicationRepository
            .findById(comment.getPublication().getId())
            .orElseThrow(() ->
                new RuntimeException("Publication not found.")
            );

        User user = userRepository
            .findById(comment.getUser().getId())
            .orElseThrow(() ->
                new RuntimeException("User not found.")
            );

        comment.setContent(comment.getContent().trim());
        comment.setPublication(publication);
        comment.setUser(user);

        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long id) {

        if (!commentRepository.existsById(id)) {
            throw new RuntimeException(
                "Comment not found with id: " + id
            );
        }

        commentRepository.deleteById(id);
    }
}