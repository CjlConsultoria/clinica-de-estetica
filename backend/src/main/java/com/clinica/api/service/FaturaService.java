package com.clinica.api.service;

import com.clinica.api.dto.request.FaturaRequest;
import com.clinica.api.dto.response.FaturaResponse;
import com.clinica.api.entity.Empresa;
import com.clinica.api.entity.FaturaAssinatura;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.EmpresaRepository;
import com.clinica.api.repository.FaturaAssinaturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FaturaService {

    private final FaturaAssinaturaRepository faturaRepository;
    private final EmpresaRepository empresaRepository;

    public List<FaturaResponse> listar() {
        return faturaRepository.findAllByOrderByCriadoEmDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<FaturaResponse> listarPorEmpresa(Long empresaId) {
        return faturaRepository.findByEmpresaId(empresaId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public FaturaResponse criar(FaturaRequest request) {
        Empresa empresa = empresaRepository.findById(request.getEmpresaId())
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada"));

        FaturaAssinatura fatura = FaturaAssinatura.builder()
                .empresa(empresa)
                .competencia(request.getCompetencia())
                .valor(request.getValor() != null ? request.getValor() : empresa.getValor())
                .plano(request.getPlano() != null ? request.getPlano() : empresa.getPlano())
                .vencimento(request.getVencimento() != null ? request.getVencimento() : LocalDate.now().plusDays(30))
                .observacoes(request.getObservacoes())
                .status("pendente")
                .build();
        empresa.setStatus("pendente");
        empresaRepository.save(empresa);

        return toResponse(faturaRepository.save(fatura));
    }

    public FaturaResponse pagar(Long id) {
        FaturaAssinatura fatura = faturaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fatura não encontrada"));

        fatura.setStatus("pago");
        fatura.setPagamento(LocalDate.now());

        Empresa empresa = fatura.getEmpresa();
        empresa.setStatus("ativo");
        empresa.setAtivo(true);
        empresaRepository.save(empresa);

        return toResponse(faturaRepository.save(fatura));
    }

    private FaturaResponse toResponse(FaturaAssinatura f) {
        return FaturaResponse.builder()
                .id(f.getId())
                .empresaId(f.getEmpresa().getId())
                .empresaNome(f.getEmpresa().getNome())
                .competencia(f.getCompetencia())
                .valor(f.getValor())
                .plano(f.getPlano())
                .vencimento(f.getVencimento())
                .pagamento(f.getPagamento())
                .status(f.getStatus())
                .observacoes(f.getObservacoes())
                .criadoEm(f.getCriadoEm())
                .build();
    }
}
