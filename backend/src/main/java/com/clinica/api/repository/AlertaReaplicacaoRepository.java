package com.clinica.api.repository;

import com.clinica.api.entity.AlertaReaplicacao;
import com.clinica.api.enums.StatusAlerta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertaReaplicacaoRepository extends JpaRepository<AlertaReaplicacao, Long> {

    List<AlertaReaplicacao> findByPacienteIdOrderByCriadoEmDesc(Long pacienteId);

    List<AlertaReaplicacao> findByStatus(StatusAlerta status);

    List<AlertaReaplicacao> findByLidoFalseOrderByCriadoEmDesc();

    boolean existsByAplicacaoIdAndLidoFalse(Long aplicacaoId);
}
