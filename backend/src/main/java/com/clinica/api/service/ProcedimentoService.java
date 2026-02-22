package com.clinica.api.service;

import com.clinica.api.dto.request.ProcedimentoRequest;
import com.clinica.api.dto.response.ProcedimentoResponse;
import com.clinica.api.entity.Procedimento;
import com.clinica.api.repository.ProcedimentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProcedimentoService {

    private final ProcedimentoRepository procedimentoRepository;

    public List<ProcedimentoResponse> listar(boolean apenasAtivos) {
        List<Procedimento> lista = apenasAtivos
                ? procedimentoRepository.findByAtivoTrueOrderByNomeAsc()
                : procedimentoRepository.findAll();
        return lista.stream().map(this::toResponse).toList();
    }

    public ProcedimentoResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public ProcedimentoResponse criar(ProcedimentoRequest request) {
        if (procedimentoRepository.existsByCodigo(request.getCodigo())) {
            throw new IllegalArgumentException("Já existe um procedimento com o código: " + request.getCodigo());
        }
        Procedimento proc = Procedimento.builder()
                .nome(request.getNome())
                .codigo(request.getCodigo().toUpperCase())
                .categoria(request.getCategoria())
                .valor(request.getValor())
                .duracaoMinutos(request.getDuracaoMinutos())
                .percentualComissao(request.getPercentualComissao())
                .descricao(request.getDescricao())
                .ativo(true)
                .build();
        return toResponse(procedimentoRepository.save(proc));
    }

    @Transactional
    public ProcedimentoResponse atualizar(Long id, ProcedimentoRequest request) {
        Procedimento proc = findById(id);
        proc.setNome(request.getNome());
        proc.setCodigo(request.getCodigo().toUpperCase());
        proc.setCategoria(request.getCategoria());
        proc.setValor(request.getValor());
        proc.setDuracaoMinutos(request.getDuracaoMinutos());
        proc.setPercentualComissao(request.getPercentualComissao());
        proc.setDescricao(request.getDescricao());
        return toResponse(procedimentoRepository.save(proc));
    }

    @Transactional
    public void inativar(Long id) {
        Procedimento proc = findById(id);
        proc.setAtivo(false);
        procedimentoRepository.save(proc);
    }

    @Transactional
    public void ativar(Long id) {
        Procedimento proc = findById(id);
        proc.setAtivo(true);
        procedimentoRepository.save(proc);
    }

    private Procedimento findById(Long id) {
        return procedimentoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Procedimento não encontrado: " + id));
    }

    private ProcedimentoResponse toResponse(Procedimento p) {
        return ProcedimentoResponse.builder()
                .id(p.getId())
                .nome(p.getNome())
                .codigo(p.getCodigo())
                .categoria(p.getCategoria())
                .valor(p.getValor())
                .duracaoMinutos(p.getDuracaoMinutos())
                .percentualComissao(p.getPercentualComissao())
                .descricao(p.getDescricao())
                .ativo(p.isAtivo())
                .criadoEm(p.getCriadoEm())
                .atualizadoEm(p.getAtualizadoEm())
                .build();
    }
}
