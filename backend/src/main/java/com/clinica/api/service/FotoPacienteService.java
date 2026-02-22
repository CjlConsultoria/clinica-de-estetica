package com.clinica.api.service;

import com.clinica.api.config.FileStorageConfig;
import com.clinica.api.dto.response.ComparativoFotoResponse;
import com.clinica.api.dto.response.FotoPacienteResponse;
import com.clinica.api.entity.Agendamento;
import com.clinica.api.entity.FotoPaciente;
import com.clinica.api.entity.Paciente;
import com.clinica.api.enums.TipoFoto;
import com.clinica.api.exception.BusinessException;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.AgendamentoRepository;
import com.clinica.api.repository.FotoPacienteRepository;
import com.clinica.api.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FotoPacienteService {

    private final FotoPacienteRepository fotoRepository;
    private final PacienteRepository pacienteRepository;
    private final AgendamentoRepository agendamentoRepository;
    private final FileStorageConfig fileStorageConfig;

    public List<FotoPacienteResponse> listarPorPaciente(Long pacienteId) {
        return fotoRepository.findByPacienteIdOrderByDataRegistroDesc(pacienteId)
                .stream().map(this::toResponse).toList();
    }

    public ComparativoFotoResponse buscarComparativo(Long pacienteId) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente", pacienteId));

        List<FotoPacienteResponse> antes = fotoRepository
                .findByPacienteIdAndTipoFotoOrderByDataRegistroAsc(pacienteId, TipoFoto.ANTES)
                .stream().map(this::toResponse).toList();

        List<FotoPacienteResponse> depois = fotoRepository
                .findByPacienteIdAndTipoFotoOrderByDataRegistroAsc(pacienteId, TipoFoto.DEPOIS)
                .stream().map(this::toResponse).toList();

        List<FotoPacienteResponse> evolucao = fotoRepository
                .findByPacienteIdAndTipoFotoOrderByDataRegistroAsc(pacienteId, TipoFoto.EVOLUCAO)
                .stream().map(this::toResponse).toList();

        return ComparativoFotoResponse.builder()
                .pacienteId(pacienteId)
                .pacienteNome(paciente.getNome())
                .fotosBefore(antes)
                .fotosAfter(depois)
                .fotosEvolucao(evolucao)
                .build();
    }

    @Transactional
    public FotoPacienteResponse salvar(Long pacienteId, TipoFoto tipoFoto, String descricao,
                                        Long agendamentoId, MultipartFile arquivo) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente", pacienteId));

        Agendamento agendamento = null;
        if (agendamentoId != null) {
            agendamento = agendamentoRepository.findById(agendamentoId)
                    .orElseThrow(() -> new ResourceNotFoundException("Agendamento", agendamentoId));
        }

        String nomeArquivo = UUID.randomUUID() + "_" + arquivo.getOriginalFilename();
        Path destino = fileStorageConfig.getUploadPath(pacienteId).resolve(nomeArquivo);

        try {
            Files.copy(arquivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new BusinessException("Falha ao salvar arquivo: " + e.getMessage());
        }

        FotoPaciente foto = FotoPaciente.builder()
                .paciente(paciente)
                .agendamento(agendamento)
                .tipoFoto(tipoFoto)
                .descricao(descricao)
                .nomeArquivo(nomeArquivo)
                .caminhoArquivo(destino.toString())
                .dataRegistro(LocalDate.now())
                .build();

        return toResponse(fotoRepository.save(foto));
    }

    public Path buscarArquivo(Long fotoId) {
        FotoPaciente foto = fotoRepository.findById(fotoId)
                .orElseThrow(() -> new ResourceNotFoundException("Foto", fotoId));
        return Path.of(foto.getCaminhoArquivo());
    }

    @Transactional
    public void excluir(Long fotoId) {
        FotoPaciente foto = fotoRepository.findById(fotoId)
                .orElseThrow(() -> new ResourceNotFoundException("Foto", fotoId));
        try {
            Files.deleteIfExists(Path.of(foto.getCaminhoArquivo()));
        } catch (IOException e) {
        }
        fotoRepository.delete(foto);
    }

    private FotoPacienteResponse toResponse(FotoPaciente foto) {
        return FotoPacienteResponse.builder()
                .id(foto.getId())
                .pacienteId(foto.getPaciente().getId())
                .pacienteNome(foto.getPaciente().getNome())
                .agendamentoId(foto.getAgendamento() != null ? foto.getAgendamento().getId() : null)
                .tipoFoto(foto.getTipoFoto())
                .descricao(foto.getDescricao())
                .nomeArquivo(foto.getNomeArquivo())
                .urlArquivo("/api/fotos/" + foto.getId() + "/arquivo")
                .dataRegistro(foto.getDataRegistro())
                .criadoEm(foto.getCriadoEm())
                .build();
    }
}
