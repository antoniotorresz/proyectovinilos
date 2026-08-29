package com.unir.proyectovinilos.service;

import com.unir.proyectovinilos.entity.Comment;
import com.unir.proyectovinilos.entity.Publication;
import com.unir.proyectovinilos.entity.User;
import com.unir.proyectovinilos.repository.CommentRepository;
import com.unir.proyectovinilos.repository.PublicationRepository;
import com.unir.proyectovinilos.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;





class CommentServiceTest {

    @Mock
    private PublicationRepository publicationRepository;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CommentService commentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveCommentSuccess() {
        Publication publication = new Publication();
        publication.setId(1);

        User user = new User();
        user.setId(1L);

        Comment comment = new Comment();
        comment.setContent("Comentario de prueba");
        comment.setPublication(publication);
        comment.setUser(user);

        when(publicationRepository.findById(1)).thenReturn(Optional.of(publication));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(commentRepository.save(comment)).thenReturn(comment);

        Comment result = commentService.saveComment(comment);

        assertNotNull(result);
        verify(publicationRepository, times(1)).findById(1);
        verify(userRepository, times(1)).findById(1L);
        verify(commentRepository, times(1)).save(comment);
    }

    @Test
    void testSaveCommentPublicationNotFound() {
        User user = new User();
        user.setId(1L);

        Comment comment = new Comment();
        comment.setContent("Comentario de prueba");
        comment.setPublication(new Publication());
        comment.getPublication().setId(1);
        comment.setUser(user);

        when(publicationRepository.findById(1)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> commentService.saveComment(comment));

        assertEquals("Publication not found.", exception.getMessage());
        verify(publicationRepository, times(1)).findById(1);
        verify(userRepository, never()).findById(anyLong());
        verify(commentRepository, never()).save(any(Comment.class));
    }

    @Test
    void testSaveCommentUserNotFound() {
        Publication publication = new Publication();
        publication.setId(1);

        Comment comment = new Comment();
        comment.setContent("Comentario de prueba");
        comment.setPublication(publication);
        comment.setUser(new User());
        comment.getUser().setId(1L);

        when(publicationRepository.findById(1)).thenReturn(Optional.of(publication));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> commentService.saveComment(comment));

        assertEquals("User not found.", exception.getMessage());
        verify(publicationRepository, times(1)).findById(1);
        verify(userRepository, times(1)).findById(1L);
        verify(commentRepository, never()).save(any(Comment.class));
    }
}