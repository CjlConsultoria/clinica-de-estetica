package com.clinica.api.repository;

import com.clinica.api.entity.ComissaoConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ComissaoConfigRepository extends JpaRepository<ComissaoConfig, Long> {

    Optional<ComissaoConfig> findByUsuarioId(Long usuarioId);
}
