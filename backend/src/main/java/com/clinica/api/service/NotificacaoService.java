package com.clinica.api.service;

import com.clinica.api.dto.request.NotificacaoRequest;
import com.clinica.api.dto.response.NotificacaoResponse;
import com.clinica.api.entity.Notificacao;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.NotificacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;

    public List<NotificacaoResponse> listarTodas() {
        return notificacaoRepository.findAllByOrderByCriadoEmDesc()
                .stream().map(this::toResponse).toList();
    }

    public Map<String, Long> contarNaoLidas() {
        return Map.of("total", notificacaoRepository.countByLidaFalse());
    }

    @Transactional
    public NotificacaoResponse criar(NotificacaoRequest request) {
        Notificacao n = Notificacao.builder()
                .tipo(request.getTipo())
                .prioridade(request.getPrioridade() != null ? request.getPrioridade() : "media")
                .titulo(request.getTitulo())
                .descricao(request.getDescricao())
                .empresaId(request.getEmpresaId())
                .empresaNome(request.getEmpresaNome())
                .lida(false)
                .build();
        return toResponse(notificacaoRepository.save(n));
    }

    @Transactional
    public NotificacaoResponse marcarComoLida(Long id) {
        Notificacao n = notificacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notificacao", id));
        n.setLida(true);
        return toResponse(notificacaoRepository.save(n));
    }

    @Transactional
    public void marcarTodasComoLidas() {
        notificacaoRepository.marcarTodasComoLidas();
    }

    @Transactional
    public void deletar(Long id) {
        if (!notificacaoRepository.existsById(id))
            throw new ResourceNotFoundException("Notificacao", id);
        notificacaoRepository.deleteById(id);
    }

    @Transactional
    public void limparLidas() {
        notificacaoRepository.deletarTodasLidas();
    }

    private NotificacaoResponse toResponse(Notificacao n) {
        return NotificacaoResponse.builder()
                .id(n.getId()).tipo(n.getTipo()).prioridade(n.getPrioridade())
                .titulo(n.getTitulo()).descricao(n.getDescricao())
                .empresaId(n.getEmpresaId()).empresaNome(n.getEmpresaNome())
                .lida(n.getLida()).criadoEm(n.getCriadoEm()).build();
    }
}
