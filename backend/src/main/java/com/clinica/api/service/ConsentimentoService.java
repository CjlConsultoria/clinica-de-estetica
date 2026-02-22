package com.clinica.api.service;

import com.clinica.api.dto.request.AssinarTermoRequest;
import com.clinica.api.dto.request.TermoRequest;
import com.clinica.api.dto.response.AssinaturaResponse;
import com.clinica.api.dto.response.TermoResponse;
import com.clinica.api.entity.AssinaturaConsentimento;
import com.clinica.api.entity.Paciente;
import com.clinica.api.entity.TermoConsentimento;
import com.clinica.api.exception.BusinessException;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.AssinaturaConsentimentoRepository;
import com.clinica.api.repository.PacienteRepository;
import com.clinica.api.repository.TermoConsentimentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConsentimentoService {

    private final TermoConsentimentoRepository termoRepository;
    private final AssinaturaConsentimentoRepository assinaturaRepository;
    private final PacienteRepository pacienteRepository;

    public List<TermoResponse> listarTermosAtivos() {
        return termoRepository.findByAtivoTrue().stream().map(this::toTermoResponse).toList();
    }

    public List<TermoResponse> listarTodosTermos() {
        return termoRepository.findAll().stream().map(this::toTermoResponse).toList();
    }

    public TermoResponse buscarTermoPorId(Long id) {
        return toTermoResponse(findTermoById(id));
    }

    @Transactional
    public TermoResponse criarTermo(TermoRequest request) {
        TermoConsentimento termo = TermoConsentimento.builder()
                .titulo(request.getTitulo())
                .conteudo(request.getConteudo())
                .versao(request.getVersao())
                .build();
        return toTermoResponse(termoRepository.save(termo));
    }

    @Transactional
    public TermoResponse atualizarTermo(Long id, TermoRequest request) {
        TermoConsentimento termo = findTermoById(id);
        termo.setTitulo(request.getTitulo());
        termo.setConteudo(request.getConteudo());
        termo.setVersao(request.getVersao());
        return toTermoResponse(termoRepository.save(termo));
    }

    @Transactional
    public void inativarTermo(Long id) {
        TermoConsentimento termo = findTermoById(id);
        termo.setAtivo(false);
        termoRepository.save(termo);
    }

    @Transactional
    public AssinaturaResponse assinar(AssinarTermoRequest request, String ipOrigem) {
        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente", request.getPacienteId()));

        TermoConsentimento termo = findTermoById(request.getTermoId());

        if (!termo.isAtivo()) {
            throw new BusinessException("Este termo não está mais ativo");
        }

        if (assinaturaRepository.existsByPacienteIdAndTermoId(paciente.getId(), termo.getId())) {
            throw new BusinessException("Paciente já assinou este termo");
        }

        LocalDateTime agora = LocalDateTime.now();
        String hashAssinatura = gerarHash(paciente.getId(), termo.getId(), agora, ipOrigem);

        AssinaturaConsentimento assinatura = AssinaturaConsentimento.builder()
                .paciente(paciente)
                .termo(termo)
                .hashAssinatura(hashAssinatura)
                .ipOrigem(ipOrigem)
                .dataAssinatura(agora)
                .build();

        return toAssinaturaResponse(assinaturaRepository.save(assinatura));
    }

    public List<AssinaturaResponse> listarTodasAssinaturas() {
        return assinaturaRepository.findAllByOrderByDataAssinaturaDesc()
                .stream().map(this::toAssinaturaResponse).toList();
    }

    public List<AssinaturaResponse> listarAssinaturasPorPaciente(Long pacienteId) {
        return assinaturaRepository.findByPacienteIdOrderByDataAssinaturaDesc(pacienteId)
                .stream().map(this::toAssinaturaResponse).toList();
    }

    public Optional<AssinaturaResponse> verificarAssinatura(String hash) {
        return assinaturaRepository.findByHashAssinatura(hash)
                .map(this::toAssinaturaResponse);
    }

    private String gerarHash(Long pacienteId, Long termoId, LocalDateTime timestamp, String ip) {
        try {
            String dados = pacienteId + ":" + termoId + ":" + timestamp.toString() + ":" + (ip != null ? ip : "");
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(dados.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 não disponível", e);
        }
    }

    private TermoConsentimento findTermoById(Long id) {
        return termoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Termo de consentimento", id));
    }

    private TermoResponse toTermoResponse(TermoConsentimento t) {
        return TermoResponse.builder()
                .id(t.getId())
                .titulo(t.getTitulo())
                .conteudo(t.getConteudo())
                .versao(t.getVersao())
                .ativo(t.isAtivo())
                .criadoEm(t.getCriadoEm())
                .build();
    }

    private AssinaturaResponse toAssinaturaResponse(AssinaturaConsentimento a) {
        return AssinaturaResponse.builder()
                .id(a.getId())
                .pacienteId(a.getPaciente().getId())
                .pacienteNome(a.getPaciente().getNome())
                .termoId(a.getTermo().getId())
                .termoTitulo(a.getTermo().getTitulo())
                .termoVersao(a.getTermo().getVersao())
                .hashAssinatura(a.getHashAssinatura())
                .ipOrigem(a.getIpOrigem())
                .dataAssinatura(a.getDataAssinatura())
                .criadoEm(a.getCriadoEm())
                .build();
    }
}
