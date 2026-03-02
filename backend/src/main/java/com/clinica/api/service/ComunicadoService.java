package com.clinica.api.service;

import com.clinica.api.dto.request.ComunicadoRequest;
import com.clinica.api.dto.response.ComunicadoResponse;
import com.clinica.api.entity.Comunicado;
import com.clinica.api.entity.Usuario;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.ComunicadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComunicadoService {

    private final ComunicadoRepository comunicadoRepository;

    public List<ComunicadoResponse> listarTodos() {
        return comunicadoRepository.findByAtivoTrueOrderByCriadoEmDesc()
                .stream().map(this::toResponse).toList();
    }

    public List<ComunicadoResponse> listarAdmin() {
        return comunicadoRepository.findAllByOrderByCriadoEmDesc()
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public ComunicadoResponse criar(ComunicadoRequest request) {
        Usuario usuario = getUsuarioLogado();
        Comunicado comunicado = Comunicado.builder()
                .titulo(request.getTitulo())
                .conteudo(request.getConteudo())
                .tipo(request.getTipo() != null ? request.getTipo() : "info")
                .status(request.getStatus() != null ? request.getStatus() : "enviado")
                .destinatariosJson(request.getDestinatariosJson() != null ? request.getDestinatariosJson() : "todas")
                .dataAgendamento(request.getDataAgendamento())
                .ativo(true)
                .criadoPor(usuario.getId())
                .nomeAutor(usuario.getNome())
                .build();
        return toResponse(comunicadoRepository.save(comunicado));
    }

    @Transactional
    public ComunicadoResponse atualizar(Long id, ComunicadoRequest request) {
        Comunicado comunicado = findById(id);
        comunicado.setTitulo(request.getTitulo());
        comunicado.setConteudo(request.getConteudo());
        if (request.getTipo() != null) comunicado.setTipo(request.getTipo());
        if (request.getStatus() != null) comunicado.setStatus(request.getStatus());
        if (request.getDestinatariosJson() != null) comunicado.setDestinatariosJson(request.getDestinatariosJson());
        comunicado.setDataAgendamento(request.getDataAgendamento());
        return toResponse(comunicadoRepository.save(comunicado));
    }

    @Transactional
    public void inativar(Long id) {
        Comunicado comunicado = findById(id);
        comunicado.setAtivo(false);
        comunicadoRepository.save(comunicado);
    }

    private Comunicado findById(Long id) {
        return comunicadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comunicado", id));
    }

    private Usuario getUsuarioLogado() {
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private ComunicadoResponse toResponse(Comunicado c) {
        return ComunicadoResponse.builder()
                .id(c.getId()).titulo(c.getTitulo()).conteudo(c.getConteudo())
                .tipo(c.getTipo()).ativo(c.getAtivo()).criadoPor(c.getCriadoPor())
                .nomeAutor(c.getNomeAutor()).status(c.getStatus())
                .destinatariosJson(c.getDestinatariosJson()).dataAgendamento(c.getDataAgendamento())
                .criadoEm(c.getCriadoEm()).atualizadoEm(c.getAtualizadoEm()).build();
    }
}
