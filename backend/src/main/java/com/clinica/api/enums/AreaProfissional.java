package com.clinica.api.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AreaProfissional {

    TECNICA("Área Técnica"),
    ADMINISTRATIVA("Área Administrativa");

    private final String descricao;
}
