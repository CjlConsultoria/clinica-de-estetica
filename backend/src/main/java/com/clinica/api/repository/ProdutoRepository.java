package com.clinica.api.repository;

import com.clinica.api.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByAtivoTrue();

    Optional<Produto> findByRegistroAnvisa(String registroAnvisa);

    @Query("SELECT p FROM Produto p WHERE p.ativo = true AND " +
           "(LOWER(p.nome) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
           "LOWER(p.fabricante) LIKE LOWER(CONCAT('%', :busca, '%')))")
    List<Produto> buscar(@Param("busca") String busca);
}
