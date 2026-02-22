package com.clinica.api.dto.response;

import com.clinica.api.enums.TipoFoto;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class FotoPacienteResponse {
    private Long id;
    private Long pacienteId;
    private String pacienteNome;
    private Long agendamentoId;
    private TipoFoto tipoFoto;
    private String descricao;
    private String nomeArquivo;
    private String urlArquivo;
    private LocalDate dataRegistro;
    private LocalDateTime criadoEm;
}
