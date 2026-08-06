package com.unir.proyectovinilos.service;

import com.unir.proyectovinilos.repository.PublicationRepository;
import com.unir.proyectovinilos.repository.UserRepository;

import org.springframework.stereotype.Service;

import com.unir.proyectovinilos.entity.Comment;
import com.unir.proyectovinilos.repository.CommentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final PublicationRepository publicationRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public Comment saveComment(Comment comment) {
        publicationRepository.findById(comment.getPublication().getId()).orElseThrow(() -> new RuntimeException("Publication not found"));
        userRepository.findById(comment.getUser().getId()).orElseThrow(() -> new RuntimeException("User not found"));
        return commentRepository.save(comment);
    }
}
