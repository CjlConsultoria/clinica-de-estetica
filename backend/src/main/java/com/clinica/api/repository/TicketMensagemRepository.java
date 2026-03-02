package com.clinica.api.repository;

import com.clinica.api.entity.TicketMensagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketMensagemRepository extends JpaRepository<TicketMensagem, Long> {
    List<TicketMensagem> findByTicketIdOrderByCriadoEmAsc(Long ticketId);
}
