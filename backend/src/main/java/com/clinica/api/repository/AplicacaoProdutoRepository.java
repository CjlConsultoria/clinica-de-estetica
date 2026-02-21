package com.clinica.api.repository;

import com.clinica.api.entity.AplicacaoProduto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AplicacaoProdutoRepository extends JpaRepository<AplicacaoProduto, Long> {

    List<AplicacaoProduto> findByPacienteIdOrderByDataAplicacaoDesc(Long pacienteId);

    @Query("SELECT a FROM AplicacaoProduto a WHERE a.dataProximaAplicacao <= :limite " +
           "AND a.dataProximaAplicacao >= :hoje")
    List<AplicacaoProduto> findAplicacoesVencendoEm(
            @Param("hoje") LocalDate hoje,
            @Param("limite") LocalDate limite);

    @Query("SELECT a FROM AplicacaoProduto a WHERE a.paciente.id = :pacienteId " +
           "AND a.dataProximaAplicacao <= :limite AND a.dataProximaAplicacao >= :hoje")
    List<AplicacaoProduto> findVencendoEmPorPaciente(
            @Param("pacienteId") Long pacienteId,
            @Param("hoje") LocalDate hoje,
            @Param("limite") LocalDate limite);

    @Query("SELECT COALESCE(SUM(a.quantidade), 0) FROM AplicacaoProduto a " +
           "WHERE a.lote.produto.id = :produtoId AND a.dataAplicacao >= :desde")
    Integer somarQuantidadePorProduto(
            @Param("produtoId") Long produtoId,
            @Param("desde") LocalDate desde);
}
