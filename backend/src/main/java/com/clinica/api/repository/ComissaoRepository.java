package com.clinica.api.repository;

import com.clinica.api.entity.Comissao;
import com.clinica.api.enums.StatusComissao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ComissaoRepository extends JpaRepository<Comissao, Long> {

    List<Comissao> findByUsuarioIdOrderByCriadoEmDesc(Long usuarioId);

    List<Comissao> findByStatus(StatusComissao status);

    @Query("SELECT c FROM Comissao c WHERE c.usuario.id = :usuarioId " +
           "AND CAST(c.criadoEm AS date) BETWEEN :inicio AND :fim")
    List<Comissao> findByUsuarioIdEPeriodo(
            @Param("usuarioId") Long usuarioId,
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim);

    @Query("SELECT COALESCE(SUM(c.valorComissao), 0) FROM Comissao c " +
           "WHERE c.usuario.id = :usuarioId AND c.status = 'PENDENTE'")
    BigDecimal somarPendentesPorUsuario(@Param("usuarioId") Long usuarioId);

    boolean existsByLancamentoId(Long lancamentoId);
}
