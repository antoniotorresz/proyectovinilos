package com.unir.proyectovinilos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.unir.proyectovinilos.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long>{
    
}
