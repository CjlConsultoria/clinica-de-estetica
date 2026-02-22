package com.clinica.api.repository;

import com.clinica.api.entity.Procedimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProcedimentoRepository extends JpaRepository<Procedimento, Long> {

    List<Procedimento> findByAtivoTrueOrderByNomeAsc();

    List<Procedimento> findByCategoriaAndAtivoTrue(String categoria);

    Optional<Procedimento> findByCodigo(String codigo);

    boolean existsByCodigo(String codigo);
}
