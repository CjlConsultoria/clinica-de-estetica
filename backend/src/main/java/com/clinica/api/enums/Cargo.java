package com.clinica.api.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Cargo {

    MEDICO("Médico", AreaProfissional.TECNICA),
    ENFERMEIRO("Enfermeiro", AreaProfissional.TECNICA),
    FISIOTERAPEUTA("Fisioterapeuta", AreaProfissional.TECNICA),
    NUTRICIONISTA("Nutricionista", AreaProfissional.TECNICA),
    PSICOLOGO("Psicólogo", AreaProfissional.TECNICA),
    ESTETICISTA("Esteticista", AreaProfissional.TECNICA),
    BIOMEDICO("Biomédico", AreaProfissional.TECNICA),
    DERMATOLOGO("Dermatologista", AreaProfissional.TECNICA),

    RECEPCIONISTA("Recepcionista", AreaProfissional.ADMINISTRATIVA),
    GERENTE("Gerente", AreaProfissional.ADMINISTRATIVA),
    FINANCEIRO("Financeiro", AreaProfissional.ADMINISTRATIVA),
    TI("TI", AreaProfissional.ADMINISTRATIVA),
    RH("RH", AreaProfissional.ADMINISTRATIVA);

    private final String descricao;
    private final AreaProfissional area;
}
