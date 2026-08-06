package com.unir.proyectovinilos.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.unir.proyectovinilos.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
}
