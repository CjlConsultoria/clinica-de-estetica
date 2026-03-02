package com.clinica.api.service;

import com.clinica.api.dto.request.TicketMensagemRequest;
import com.clinica.api.dto.response.TicketMensagemResponse;
import com.clinica.api.entity.SuporteTicket;
import com.clinica.api.entity.TicketMensagem;
import com.clinica.api.entity.Usuario;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.SuporteTicketRepository;
import com.clinica.api.repository.TicketMensagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketMensagemService {

    private final TicketMensagemRepository mensagemRepository;
    private final SuporteTicketRepository ticketRepository;

    public List<TicketMensagemResponse> listarPorTicket(Long ticketId) {
        return mensagemRepository.findByTicketIdOrderByCriadoEmAsc(ticketId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public TicketMensagemResponse criar(Long ticketId, TicketMensagemRequest request) {
        SuporteTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", ticketId));

        Usuario usuario = getUsuarioLogado();
        TicketMensagem msg = TicketMensagem.builder()
                .ticket(ticket)
                .autor(usuario.getNome())
                .fromSupport(request.getFromSupport() != null ? request.getFromSupport() : false)
                .texto(request.getTexto())
                .build();
        return toResponse(mensagemRepository.save(msg));
    }

    private Usuario getUsuarioLogado() {
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private TicketMensagemResponse toResponse(TicketMensagem m) {
        return TicketMensagemResponse.builder()
                .id(m.getId())
                .ticketId(m.getTicket().getId())
                .autor(m.getAutor())
                .fromSupport(m.getFromSupport())
                .texto(m.getTexto())
                .criadoEm(m.getCriadoEm())
                .build();
    }
}
