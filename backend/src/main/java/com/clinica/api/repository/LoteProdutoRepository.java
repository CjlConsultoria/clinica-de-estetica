package com.clinica.api.repository;

import com.clinica.api.entity.LoteProduto;
import com.clinica.api.enums.StatusLote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface LoteProdutoRepository extends JpaRepository<LoteProduto, Long> {

    List<LoteProduto> findByProdutoId(Long produtoId);

    List<LoteProduto> findByProdutoIdAndAtivoTrue(Long produtoId);

    @Query("SELECT l FROM LoteProduto l WHERE l.dataValidade <= :data AND l.status = 'ATIVO'")
    List<LoteProduto> findVencidosAntes(@Param("data") LocalDate data);

    @Query("SELECT l FROM LoteProduto l WHERE l.status = 'ATIVO' AND l.ativo = true AND l.quantidadeAtual > 0")
    List<LoteProduto> findEstoqueAtivo();

    @Query("SELECT l FROM LoteProduto l WHERE l.status = 'ATIVO' AND l.ativo = true AND " +
           "l.dataValidade <= :data")
    List<LoteProduto> findValidadeProxima(@Param("data") LocalDate data);

    @Query("SELECT l FROM LoteProduto l WHERE l.status = 'ATIVO' AND l.ativo = true AND " +
           "(CAST(l.quantidadeAtual AS float) / CAST(l.quantidadeTotal AS float)) <= :percentual")
    List<LoteProduto> findEstoqueBaixo(@Param("percentual") double percentual);

    List<LoteProduto> findByStatus(StatusLote status);

    List<LoteProduto> findByProduto_EmpresaIdAndAtivoTrue(Long empresaId);

    List<LoteProduto> findByProduto_EmpresaId(Long empresaId);
}
