package com.clinica.api.dto.response;

import com.clinica.api.enums.AreaProfissional;
import com.clinica.api.enums.Cargo;
import com.clinica.api.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponse {

    private Long id;
    private String nome;
    private String email;
    private Role role;
    private Cargo cargo;
    private String cargoDescricao;
    private AreaProfissional areaProfissional;
    private String areaDescricao;
    private String telefone;
    private String especialidade;
    private String registro;
    private String observacoes;
    private long atendimentos;
    private boolean ativo;
    private LocalDateTime criadoEm;
}
