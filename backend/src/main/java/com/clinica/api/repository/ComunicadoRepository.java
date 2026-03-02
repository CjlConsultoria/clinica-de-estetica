package com.clinica.api.repository;

import com.clinica.api.entity.Comunicado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComunicadoRepository extends JpaRepository<Comunicado, Long> {
    List<Comunicado> findByAtivoTrueOrderByCriadoEmDesc();
    List<Comunicado> findAllByOrderByCriadoEmDesc();
}
