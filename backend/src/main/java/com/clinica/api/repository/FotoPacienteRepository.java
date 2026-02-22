package com.clinica.api.repository;

import com.clinica.api.entity.FotoPaciente;
import com.clinica.api.enums.TipoFoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FotoPacienteRepository extends JpaRepository<FotoPaciente, Long> {

    List<FotoPaciente> findByPacienteIdOrderByDataRegistroDesc(Long pacienteId);

    List<FotoPaciente> findByPacienteIdAndTipoFotoOrderByDataRegistroAsc(Long pacienteId, TipoFoto tipoFoto);
}
