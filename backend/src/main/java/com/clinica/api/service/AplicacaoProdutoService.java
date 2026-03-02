package com.clinica.api.service;

import com.clinica.api.dto.request.AplicacaoProdutoRequest;
import com.clinica.api.dto.response.AplicacaoProdutoResponse;
import com.clinica.api.entity.AplicacaoProduto;
import com.clinica.api.entity.LoteProduto;
import com.clinica.api.entity.Paciente;
import com.clinica.api.entity.Prontuario;
import com.clinica.api.entity.Usuario;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.AplicacaoProdutoRepository;
import com.clinica.api.repository.LoteProdutoRepository;
import com.clinica.api.repository.PacienteRepository;
import com.clinica.api.repository.ProntuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AplicacaoProdutoService {

    private final AplicacaoProdutoRepository aplicacaoRepository;
    private final PacienteRepository pacienteRepository;
    private final LoteProdutoRepository loteRepository;
    private final ProntuarioRepository prontuarioRepository;
    private final EstoqueService estoqueService;

    private Long getEmpresaId() {
        Usuario u = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return u.getEmpresaId();
    }

    public List<AplicacaoProdutoResponse> listarPorPaciente(Long pacienteId) {
        Long empresaId = getEmpresaId();
        if (empresaId != null) {
            return aplicacaoRepository.findByPaciente_EmpresaIdAndPacienteId(empresaId, pacienteId)
                    .stream().map(this::toResponse).toList();
        }
        return aplicacaoRepository.findByPacienteIdOrderByDataAplicacaoDesc(pacienteId)
                .stream().map(this::toResponse).toList();
    }

    public List<AplicacaoProdutoResponse> listarVencendo(int diasAntecedencia) {
        Long empresaId = getEmpresaId();
        LocalDate hoje = LocalDate.now();
        LocalDate limite = hoje.plusDays(diasAntecedencia);
        if (empresaId != null) {
            return aplicacaoRepository.findByPaciente_EmpresaIdAndDataProximaAplicacaoBefore(empresaId, limite)
                    .stream().map(this::toResponse).toList();
        }
        return aplicacaoRepository.findAplicacoesVencendoEm(hoje, limite)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public AplicacaoProdutoResponse registrar(AplicacaoProdutoRequest request) {
        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente", request.getPacienteId()));

        LoteProduto lote = loteRepository.findById(request.getLoteId())
                .orElseThrow(() -> new ResourceNotFoundException("Lote", request.getLoteId()));

        Prontuario prontuario = null;
        if (request.getProntuarioId() != null) {
            prontuario = prontuarioRepository.findById(request.getProntuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Prontuário", request.getProntuarioId()));
        }

        estoqueService.darBaixa(lote.getId(), request.getQuantidade());

        AplicacaoProduto aplicacao = AplicacaoProduto.builder()
                .paciente(paciente)
                .prontuario(prontuario)
                .lote(lote)
                .quantidade(request.getQuantidade())
                .dataAplicacao(request.getDataAplicacao())
                .dataProximaAplicacao(request.getDataProximaAplicacao())
                .observacoes(request.getObservacoes())
                .build();

        return toResponse(aplicacaoRepository.save(aplicacao));
    }

    private AplicacaoProdutoResponse toResponse(AplicacaoProduto a) {
        return AplicacaoProdutoResponse.builder()
                .id(a.getId())
                .pacienteId(a.getPaciente().getId())
                .pacienteNome(a.getPaciente().getNome())
                .loteId(a.getLote().getId())
                .numeroLote(a.getLote().getNumeroLote())
                .produtoNome(a.getLote().getProduto().getNome())
                .quantidade(a.getQuantidade())
                .dataAplicacao(a.getDataAplicacao())
                .dataProximaAplicacao(a.getDataProximaAplicacao())
                .observacoes(a.getObservacoes())
                .criadoEm(a.getCriadoEm())
                .build();
    }
}
