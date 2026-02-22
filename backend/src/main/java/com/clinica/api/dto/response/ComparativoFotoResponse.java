package com.clinica.api.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ComparativoFotoResponse {
    private Long pacienteId;
    private String pacienteNome;
    private List<FotoPacienteResponse> fotosBefore;
    private List<FotoPacienteResponse> fotosAfter;
    private List<FotoPacienteResponse> fotosEvolucao;
}
