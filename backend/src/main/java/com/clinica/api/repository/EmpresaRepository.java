package com.clinica.api.repository;

import com.clinica.api.entity.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    List<Empresa> findAllByOrderByCriadoEmDesc();
    List<Empresa> findByStatusAndVencimentoBefore(String status, LocalDate data);
}
