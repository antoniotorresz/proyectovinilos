package com.unir.proyectovinilos.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
class CommentTest {

    private Comment comment;
    private User user;
    private Publication publication;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setName("Test User");

        publication = new Publication();
        publication.setId(1);
        publication.setName("Test Publication");

        comment = new Comment();
        comment.setId(1L);
        comment.setContent("This is a test comment.");
        comment.setCreatedAt(LocalDate.of(2023, 10, 1));
        comment.setUser(user);
        comment.setPublication(publication);
    }

    @Test
    void testCommentFields() {
        assertEquals(1L, comment.getId());
        assertEquals("This is a test comment.", comment.getContent());
        assertEquals(LocalDate.of(2023, 10, 1), comment.getCreatedAt());
        assertEquals(user, comment.getUser());
        assertEquals(publication, comment.getPublication());
    }

    @Test
    void testNoArgsConstructor() {
        Comment emptyComment = new Comment();
        assertNotNull(emptyComment);
        assertNull(emptyComment.getId());
        assertNull(emptyComment.getContent());
        assertNull(emptyComment.getCreatedAt());
        assertNull(emptyComment.getUser());
        assertNull(emptyComment.getPublication());
    }

    @Test
    void testAllArgsConstructor() {
        Comment fullComment = new Comment(
                2L,
                "Another test comment.",
                LocalDate.of(2023, 9, 15),
                user,
                publication
        );

        assertEquals(2L, fullComment.getId());
        assertEquals("Another test comment.", fullComment.getContent());
        assertEquals(LocalDate.of(2023, 9, 15), fullComment.getCreatedAt());
        assertEquals(user, fullComment.getUser());
        assertEquals(publication, fullComment.getPublication());
    }

    @Test
    void testSettersAndGetters() {
        Comment newComment = new Comment();
        newComment.setId(3L);
        newComment.setContent("Setter test comment.");
        newComment.setCreatedAt(LocalDate.of(2023, 8, 20));
        newComment.setUser(user);
        newComment.setPublication(publication);

        assertEquals(3L, newComment.getId());
        assertEquals("Setter test comment.", newComment.getContent());
        assertEquals(LocalDate.of(2023, 8, 20), newComment.getCreatedAt());
        assertEquals(user, newComment.getUser());
        assertEquals(publication, newComment.getPublication());
    }
}