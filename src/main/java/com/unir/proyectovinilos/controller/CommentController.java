package com.unir.proyectovinilos.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unir.proyectovinilos.entity.Comment;
import com.unir.proyectovinilos.service.CommentService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;

    @PostMapping("/new")
    public Comment saveComment(@RequestBody Comment comment) {
        return commentService.saveComment(comment);
    }

}
