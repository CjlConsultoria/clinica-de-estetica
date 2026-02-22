package com.clinica.api.controller;

import com.clinica.api.dto.response.ComparativoFotoResponse;
import com.clinica.api.dto.response.FotoPacienteResponse;
import com.clinica.api.enums.TipoFoto;
import com.clinica.api.service.FotoPacienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/fotos")
@RequiredArgsConstructor
public class FotoPacienteController {

    private final FotoPacienteService fotoService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FotoPacienteResponse> upload(
            @RequestParam Long pacienteId,
            @RequestParam TipoFoto tipoFoto,
            @RequestParam(required = false) String descricao,
            @RequestParam(required = false) Long agendamentoId,
            @RequestParam("arquivo") MultipartFile arquivo) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(fotoService.salvar(pacienteId, tipoFoto, descricao, agendamentoId, arquivo));
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<FotoPacienteResponse>> listarPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(fotoService.listarPorPaciente(pacienteId));
    }

    @GetMapping("/paciente/{pacienteId}/comparativo")
    public ResponseEntity<ComparativoFotoResponse> comparativo(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(fotoService.buscarComparativo(pacienteId));
    }

    @GetMapping("/{id}/arquivo")
    public ResponseEntity<Resource> arquivo(@PathVariable Long id) {
        Path arquivo = fotoService.buscarArquivo(id);
        Resource resource = new FileSystemResource(arquivo);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + arquivo.getFileName() + "\"")
                .contentType(MediaType.IMAGE_JPEG)
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        fotoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
