package com.clinica.api.service;

import com.clinica.api.dto.request.SuporteTicketRequest;
import com.clinica.api.dto.response.SuporteTicketResponse;
import com.clinica.api.entity.SuporteTicket;
import com.clinica.api.entity.Usuario;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.SuporteTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SuporteService {

    private final SuporteTicketRepository suporteTicketRepository;

    public List<SuporteTicketResponse> listarTodos() {
        return suporteTicketRepository.findAllByOrderByCriadoEmDesc()
                .stream().map(this::toResponse).toList();
    }

    public List<SuporteTicketResponse> listarPorUsuario(Long usuarioId) {
        return suporteTicketRepository.findByCriadoPorOrderByCriadoEmDesc(usuarioId)
                .stream().map(this::toResponse).toList();
    }

    public List<SuporteTicketResponse> listarPorEmpresa(Long empresaId) {
        return suporteTicketRepository.findByEmpresaIdOrderByCriadoEmDesc(empresaId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public SuporteTicketResponse criar(SuporteTicketRequest request) {
        Usuario usuario = getUsuarioLogado();
        SuporteTicket ticket = SuporteTicket.builder()
                .titulo(request.getTitulo())
                .descricao(request.getDescricao())
                .categoria(request.getCategoria() != null ? request.getCategoria() : "operacional")
                .prioridade(request.getPrioridade() != null ? request.getPrioridade() : "media")
                .status("aberto")
                .criadoPor(usuario.getId())
                .nomeAutor(usuario.getNome())
                .empresaId(request.getEmpresaId())
                .empresaNome(request.getEmpresaNome())
                .build();
        return toResponse(suporteTicketRepository.save(ticket));
    }

    @Transactional
    public SuporteTicketResponse atualizarStatus(Long id, String status) {
        SuporteTicket ticket = findById(id);
        ticket.setStatus(status);
        return toResponse(suporteTicketRepository.save(ticket));
    }

    private SuporteTicket findById(Long id) {
        return suporteTicketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", id));
    }

    private Usuario getUsuarioLogado() {
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private SuporteTicketResponse toResponse(SuporteTicket t) {
        return SuporteTicketResponse.builder()
                .id(t.getId()).titulo(t.getTitulo()).descricao(t.getDescricao())
                .categoria(t.getCategoria()).status(t.getStatus()).prioridade(t.getPrioridade())
                .criadoPor(t.getCriadoPor()).nomeAutor(t.getNomeAutor())
                .empresaId(t.getEmpresaId()).empresaNome(t.getEmpresaNome())
                .criadoEm(t.getCriadoEm()).atualizadoEm(t.getAtualizadoEm()).build();
    }
}
