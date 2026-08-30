package com.unir.proyectovinilos.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.RequiredArgsConstructor;
import lombok.AllArgsConstructor;

import com.unir.proyectovinilos.entity.Publication;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
public class TopFavorite {
    private Long likeCount;
    private Publication publication;
}
