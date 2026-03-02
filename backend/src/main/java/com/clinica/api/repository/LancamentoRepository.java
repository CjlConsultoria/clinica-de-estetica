package com.clinica.api.repository;

import com.clinica.api.entity.Lancamento;
import com.clinica.api.enums.StatusPagamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface LancamentoRepository extends JpaRepository<Lancamento, Long> {

    Page<Lancamento> findByPacienteId(Long pacienteId, Pageable pageable);

    Page<Lancamento> findByStatus(StatusPagamento status, Pageable pageable);

    @Query("SELECT l FROM Lancamento l WHERE l.dataVencimento BETWEEN :inicio AND :fim")
    Page<Lancamento> findByPeriodoVencimento(
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim,
            Pageable pageable
    );

    @Query("SELECT l FROM Lancamento l WHERE l.dataPagamento BETWEEN :inicio AND :fim")
    Page<Lancamento> findByPeriodoPagamento(
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(l.valor - l.valorDesconto), 0) FROM Lancamento l " +
           "WHERE l.status = 'PAGO' AND l.dataPagamento BETWEEN :inicio AND :fim")
    BigDecimal somarReceitasPorPeriodo(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("SELECT COALESCE(SUM(l.valor - l.valorDesconto), 0) FROM Lancamento l " +
           "WHERE l.status = 'PENDENTE'")
    BigDecimal somarPendentes();

    long countByStatus(StatusPagamento status);

    List<Lancamento> findByStatusAndDataVencimentoBefore(StatusPagamento status, LocalDate data);

    Page<Lancamento> findByEmpresaId(Long empresaId, Pageable pageable);
}
