package com.clinica.api.repository;

import com.clinica.api.entity.FaturaAssinatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FaturaAssinaturaRepository extends JpaRepository<FaturaAssinatura, Long> {
    List<FaturaAssinatura> findAllByOrderByCriadoEmDesc();
    List<FaturaAssinatura> findByEmpresaId(Long empresaId);
}
