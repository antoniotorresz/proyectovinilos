package com.unir.proyectovinilos.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import static org.junit.jupiter.api.Assertions.*;

import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
class UserTest {

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setEmail("testuser@example.com");
        user.setCreatedAt(LocalDate.of(2023, 10, 1));
    }

    @Test
    void testUserFields() {
        assertEquals(1L, user.getId());
        assertEquals("Test User", user.getName());
        assertEquals("testuser@example.com", user.getEmail());
        assertEquals(LocalDate.of(2023, 10, 1), user.getCreatedAt());
    }

    @Test
    void testNoArgsConstructor() {
        User emptyUser = new User();
        assertNotNull(emptyUser);
        assertNull(emptyUser.getId());
        assertNull(emptyUser.getName());
        assertNull(emptyUser.getEmail());
        assertNull(emptyUser.getCreatedAt());
    }

    @Test
    void testAllArgsConstructor() {
        User fullUser = new User(
                2L,
                "Another User",
                "anotheruser@example.com",
                LocalDate.of(2023, 9, 15)
        );

        assertEquals(2L, fullUser.getId());
        assertEquals("Another User", fullUser.getName());
        assertEquals("anotheruser@example.com", fullUser.getEmail());
        assertEquals(LocalDate.of(2023, 9, 15), fullUser.getCreatedAt());
    }

    @Test
    void testSettersAndGetters() {
        User newUser = new User();
        newUser.setId(3L);
        newUser.setName("Setter Test User");
        newUser.setEmail("settertestuser@example.com");
        newUser.setCreatedAt(LocalDate.of(2023, 8, 20));

        assertEquals(3L, newUser.getId());
        assertEquals("Setter Test User", newUser.getName());
        assertEquals("settertestuser@example.com", newUser.getEmail());
        assertEquals(LocalDate.of(2023, 8, 20), newUser.getCreatedAt());
    }
}