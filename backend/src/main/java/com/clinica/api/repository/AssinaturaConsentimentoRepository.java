package com.clinica.api.repository;

import com.clinica.api.entity.AssinaturaConsentimento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssinaturaConsentimentoRepository extends JpaRepository<AssinaturaConsentimento, Long> {

    List<AssinaturaConsentimento> findByPacienteIdOrderByDataAssinaturaDesc(Long pacienteId);

    List<AssinaturaConsentimento> findAllByOrderByDataAssinaturaDesc();

    Optional<AssinaturaConsentimento> findByHashAssinatura(String hash);

    boolean existsByPacienteIdAndTermoId(Long pacienteId, Long termoId);
}
