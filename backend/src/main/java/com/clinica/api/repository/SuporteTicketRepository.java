package com.clinica.api.repository;

import com.clinica.api.entity.SuporteTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SuporteTicketRepository extends JpaRepository<SuporteTicket, Long> {
    List<SuporteTicket> findAllByOrderByCriadoEmDesc();
    List<SuporteTicket> findByCriadoPorOrderByCriadoEmDesc(Long criadoPor);
    List<SuporteTicket> findByEmpresaIdOrderByCriadoEmDesc(Long empresaId);
}
