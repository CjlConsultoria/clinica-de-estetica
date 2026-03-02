package com.clinica.api.repository;

import com.clinica.api.entity.TermoConsentimento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TermoConsentimentoRepository extends JpaRepository<TermoConsentimento, Long> {

    List<TermoConsentimento> findByAtivoTrue();

    List<TermoConsentimento> findByEmpresaIdAndAtivoTrue(Long empresaId);

    List<TermoConsentimento> findByEmpresaId(Long empresaId);
}
