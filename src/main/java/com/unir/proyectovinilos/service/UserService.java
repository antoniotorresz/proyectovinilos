package com.unir.proyectovinilos.service;

import com.unir.proyectovinilos.entity.AuthProvider;
import com.unir.proyectovinilos.entity.Role;
import com.unir.proyectovinilos.entity.User;
import com.unir.proyectovinilos.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email);
    }

    @Transactional
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
            .map(existing -> {
                existing.setName(updatedUser.getName());
                existing.setEmail(updatedUser.getEmail());

                return userRepository.save(existing);
            })
            .orElseThrow(
                () -> new RuntimeException(
                    "User not found with id: " + id
                )
            );
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public User registerUser(User user) {

        if (userRepository.findByEmailIgnoreCase(user.getEmail()).isPresent()) {
            throw new RuntimeException(
                "A user with this email already exists."
            );
        }

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new RuntimeException(
                "Password is required."
            );
        }

        user.setPassword(
            passwordEncoder.encode(user.getPassword())
        );

        user.setRole(Role.USER);
        user.setProvider(AuthProvider.LOCAL);

        return userRepository.save(user);
    }

    public User authenticate(String email, String password) {

        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() ->
                new RuntimeException(
                    "Correo o contraseña incorrectos."
                )
            );

        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new RuntimeException(
                "Este usuario utiliza otro método de autenticación."
            );
        }

        if (
            user.getPassword() == null ||
            !passwordEncoder.matches(
                password,
                user.getPassword()
            )
        ) {
            throw new RuntimeException(
                "Correo o contraseña incorrectos."
            );
        }

        return user;
    }

    @Transactional
    public User updateUserRole(Long id, Role role) {
        User user = userRepository.findById(id)
            .orElseThrow(() ->
                new RuntimeException(
                    "User not found with id: " + id
                )
            );

        if (user.getRole() == Role.SUPER_ADMIN) {
            throw new RuntimeException(
                "The SUPER_ADMIN role cannot be modified."
            );
        }

        if (role == Role.SUPER_ADMIN) {
            throw new RuntimeException(
                "SUPER_ADMIN cannot be assigned through this operation."
            );
        }

        user.setRole(role);

        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(
            Long id,
            String currentPassword,
            String newPassword) {

        User user = userRepository.findById(id)
            .orElseThrow(() ->
                new RuntimeException(
                    "User not found with id: " + id
                )
            );

        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new RuntimeException(
                "Password change is only available for LOCAL users."
            );
        }

        if (
            user.getPassword() == null ||
            !passwordEncoder.matches(
                currentPassword,
                user.getPassword()
            )
        ) {
            throw new RuntimeException(
                "Current password is incorrect."
            );
        }

        if (newPassword == null || newPassword.length() < 8) {
            throw new RuntimeException(
                "The new password must contain at least 8 characters."
            );
        }

        if (passwordEncoder.matches(
                newPassword,
                user.getPassword()
        )) {
            throw new RuntimeException(
                "The new password must be different from the current password."
            );
        }

        user.setPassword(
            passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);
    }
}
