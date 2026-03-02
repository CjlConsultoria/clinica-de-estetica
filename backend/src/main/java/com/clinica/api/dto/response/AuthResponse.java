package com.clinica.api.dto.response;

import com.clinica.api.enums.AreaProfissional;
import com.clinica.api.enums.Cargo;
import com.clinica.api.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String tipo;
    private Long usuarioId;
    private String nome;
    private String email;
    private Role role;
    private Cargo cargo;
    private AreaProfissional areaProfissional;
    private Long empresaId;
}
