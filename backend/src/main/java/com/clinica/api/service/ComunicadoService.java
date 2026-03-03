package com.clinica.api.service;

import com.clinica.api.dto.request.ComunicadoRequest;
import com.clinica.api.dto.response.ComunicadoResponse;
import com.clinica.api.entity.Comunicado;
import com.clinica.api.entity.Usuario;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.ComunicadoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComunicadoService {

    private final ComunicadoRepository comunicadoRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

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
        String destJson = request.getDestinatariosJson() != null ? request.getDestinatariosJson() : "todas";
        int total = calcularTotal(destJson);
        Comunicado comunicado = Comunicado.builder()
                .titulo(request.getTitulo())
                .conteudo(request.getConteudo())
                .tipo(request.getTipo() != null ? request.getTipo() : "info")
                .status(request.getStatus() != null ? request.getStatus() : "enviado")
                .destinatariosJson(destJson)
                .dataAgendamento(request.getDataAgendamento())
                .ativo(true)
                .criadoPor(usuario.getId())
                .nomeAutor(usuario.getNome())
                .lidasCount(0)
                .totalDestinatarios(total)
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
        if (request.getDestinatariosJson() != null) {
            comunicado.setDestinatariosJson(request.getDestinatariosJson());
            comunicado.setTotalDestinatarios(calcularTotal(request.getDestinatariosJson()));
        }
        comunicado.setDataAgendamento(request.getDataAgendamento());
        return toResponse(comunicadoRepository.save(comunicado));
    }

    @Transactional
    public void inativar(Long id) {
        Comunicado comunicado = findById(id);
        comunicado.setAtivo(false);
        comunicadoRepository.save(comunicado);
    }

    @Transactional
    public void marcarLida(Long id) {
        Comunicado comunicado = findById(id);
        comunicado.setLidasCount(comunicado.getLidasCount() + 1);
        comunicadoRepository.save(comunicado);
    }

    private int calcularTotal(String destinatariosJson) {
        if (destinatariosJson == null || destinatariosJson.isBlank() || "todas".equals(destinatariosJson)) {
            return 0;
        }
        try {
            Object[] arr = objectMapper.readValue(destinatariosJson, Object[].class);
            return arr.length;
        } catch (Exception e) {
            return 0;
        }
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
                .criadoEm(c.getCriadoEm()).atualizadoEm(c.getAtualizadoEm())
                .lidasCount(c.getLidasCount() != null ? c.getLidasCount() : 0)
                .totalDestinatarios(c.getTotalDestinatarios() != null ? c.getTotalDestinatarios() : 0)
                .build();
    }
}
