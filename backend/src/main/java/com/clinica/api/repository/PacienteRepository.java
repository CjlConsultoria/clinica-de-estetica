package com.clinica.api.repository;

import com.clinica.api.entity.Paciente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    Optional<Paciente> findByCpf(String cpf);

    boolean existsByCpf(String cpf);

    boolean existsByEmail(String email);

    @Query("SELECT p FROM Paciente p WHERE p.ativo = true AND " +
           "(LOWER(p.nome) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
           "p.cpf LIKE CONCAT('%', :busca, '%') OR " +
           "p.celular LIKE CONCAT('%', :busca, '%') OR " +
           "LOWER(p.email) LIKE LOWER(CONCAT('%', :busca, '%')))")
    Page<Paciente> buscarPorTermoAtivos(@Param("busca") String busca, Pageable pageable);

    Page<Paciente> findByAtivoTrue(Pageable pageable);

    Page<Paciente> findByEmpresaIdAndAtivoTrue(Long empresaId, Pageable pageable);

    @Query("SELECT p FROM Paciente p WHERE p.empresaId = :empresaId AND p.ativo = true AND (LOWER(p.nome) LIKE LOWER(CONCAT('%', :busca, '%')) OR LOWER(p.cpf) LIKE LOWER(CONCAT('%', :busca, '%')) OR LOWER(p.email) LIKE LOWER(CONCAT('%', :busca, '%')))")
    Page<Paciente> buscarPorTermoAtivosEEmpresa(@Param("busca") String busca, @Param("empresaId") Long empresaId, Pageable pageable);
}
