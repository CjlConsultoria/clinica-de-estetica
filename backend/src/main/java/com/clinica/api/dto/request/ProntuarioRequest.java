package com.clinica.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProntuarioRequest {

    @NotNull(message = "Paciente é obrigatório")
    private Long pacienteId;

    @NotNull(message = "Médico é obrigatório")
    private Long medicoId;

    private Long agendamentoId;

    @NotBlank(message = "Anamnese é obrigatória")
    private String anamnese;

    private String exameFisico;

    private String diagnostico;

    private String cid10;

    private String prescricao;

    private String examesSolicitados;

    private String observacoes;
}
