package com.clinica.api.repository;

import com.clinica.api.entity.ComunicadoLeitura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface ComunicadoLeituraRepository extends JpaRepository<ComunicadoLeitura, Long> {

    boolean existsByComunicadoIdAndUsuarioId(Long comunicadoId, Long usuarioId);

    @Query("SELECT cl.comunicadoId FROM ComunicadoLeitura cl WHERE cl.usuarioId = :usuarioId")
    Set<Long> findComunicadoIdsByUsuarioId(@Param("usuarioId") Long usuarioId);
}
