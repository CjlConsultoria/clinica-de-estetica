package com.clinica.api.repository;

import com.clinica.api.entity.Agendamento;
import com.clinica.api.enums.StatusAgendamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    Page<Agendamento> findByPacienteId(Long pacienteId, Pageable pageable);

    Page<Agendamento> findByMedicoId(Long medicoId, Pageable pageable);

    Page<Agendamento> findByStatus(StatusAgendamento status, Pageable pageable);

    @Query("SELECT a FROM Agendamento a WHERE a.medico.id = :medicoId " +
           "AND a.dataHora BETWEEN :inicio AND :fim " +
           "AND a.status NOT IN ('CANCELADO')")
    List<Agendamento> findConflitosAgenda(
            @Param("medicoId") Long medicoId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim
    );

    @Query("SELECT a FROM Agendamento a WHERE a.dataHora BETWEEN :inicio AND :fim")
    Page<Agendamento> findByPeriodo(
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim,
            Pageable pageable
    );

    @Query("SELECT a FROM Agendamento a WHERE a.medico.id = :medicoId " +
           "AND a.dataHora BETWEEN :inicio AND :fim")
    List<Agendamento> findByMedicoIdAndPeriodo(
            @Param("medicoId") Long medicoId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim
    );

    long countByStatus(StatusAgendamento status);

    long countByDataHoraBetween(LocalDateTime inicio, LocalDateTime fim);

    long countByEmpresaIdAndStatus(Long empresaId, StatusAgendamento status);

    long countByEmpresaIdAndDataHoraBetween(Long empresaId, LocalDateTime inicio, LocalDateTime fim);

    long countByMedicoId(Long medicoId);

    Page<Agendamento> findByEmpresaId(Long empresaId, Pageable pageable);

    Page<Agendamento> findByEmpresaIdAndStatus(Long empresaId, StatusAgendamento status, Pageable pageable);

    Page<Agendamento> findByEmpresaIdAndPacienteId(Long empresaId, Long pacienteId, Pageable pageable);

    Page<Agendamento> findByEmpresaIdAndMedicoId(Long empresaId, Long medicoId, Pageable pageable);

    List<Agendamento> findByEmpresaIdAndMedicoIdAndDataHoraBetween(Long empresaId, Long medicoId, LocalDateTime inicio, LocalDateTime fim);
}
