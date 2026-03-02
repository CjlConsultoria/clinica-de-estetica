package com.clinica.api.repository;

import com.clinica.api.entity.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {
    List<Notificacao> findAllByOrderByCriadoEmDesc();
    long countByLidaFalse();

    @Modifying
    @Query("UPDATE Notificacao n SET n.lida = true")
    void marcarTodasComoLidas();

    @Modifying
    @Query("DELETE FROM Notificacao n WHERE n.lida = true")
    void deletarTodasLidas();
}
