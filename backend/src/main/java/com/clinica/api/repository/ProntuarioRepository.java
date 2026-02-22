package com.clinica.api.repository;

import com.clinica.api.entity.Prontuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {

    Page<Prontuario> findByPacienteId(Long pacienteId, Pageable pageable);

    Page<Prontuario> findByMedicoId(Long medicoId, Pageable pageable);

    Optional<Prontuario> findByAgendamentoId(Long agendamentoId);
}
