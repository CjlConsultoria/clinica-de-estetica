package com.clinica.api.controller;

import com.clinica.api.dto.request.UsuarioRequest;
import com.clinica.api.dto.response.UsuarioResponse;
import com.clinica.api.enums.AreaProfissional;
import com.clinica.api.enums.Cargo;
import com.clinica.api.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }


    @GetMapping("/medicos")
    public ResponseEntity<List<UsuarioResponse>> listarMedicos() {
        return ResponseEntity.ok(usuarioService.listarMedicos());
    }


    @GetMapping("/area/tecnica")
    public ResponseEntity<List<UsuarioResponse>> listarAreaTecnica() {
        return ResponseEntity.ok(usuarioService.listarAreaTecnica());
    }


    @GetMapping("/area/administrativa")
    public ResponseEntity<List<UsuarioResponse>> listarAreaAdministrativa() {
        return ResponseEntity.ok(usuarioService.listarAreaAdministrativa());
    }

    @GetMapping("/area/{area}")
    public ResponseEntity<List<UsuarioResponse>> listarPorArea(@PathVariable AreaProfissional area) {
        return ResponseEntity.ok(usuarioService.listarPorArea(area));
    }


    @GetMapping("/cargo/{cargo}")
    public ResponseEntity<List<UsuarioResponse>> listarPorCargo(@PathVariable Cargo cargo) {
        return ResponseEntity.ok(usuarioService.listarPorCargo(cargo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> criar(@Valid @RequestBody UsuarioRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioRequest request) {
        return ResponseEntity.ok(usuarioService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        usuarioService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
