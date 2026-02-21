package com.clinica.api.repository;

import com.clinica.api.entity.AlertaEstoque;
import com.clinica.api.enums.TipoAlertaEstoque;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertaEstoqueRepository extends JpaRepository<AlertaEstoque, Long> {

    List<AlertaEstoque> findByLidoFalse();

    List<AlertaEstoque> findByTipo(TipoAlertaEstoque tipo);

    List<AlertaEstoque> findByLoteId(Long loteId);

    boolean existsByLoteIdAndTipoAndLidoFalse(Long loteId, TipoAlertaEstoque tipo);
}
