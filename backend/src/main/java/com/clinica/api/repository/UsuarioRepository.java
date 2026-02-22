package com.clinica.api.repository;

import com.clinica.api.entity.Usuario;
import com.clinica.api.enums.AreaProfissional;
import com.clinica.api.enums.Cargo;
import com.clinica.api.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Usuario> findByRole(Role role);

    List<Usuario> findByAtivoTrue();

    List<Usuario> findByCargoAndAtivoTrue(Cargo cargo);

    List<Usuario> findByAreaProfissionalAndAtivoTrue(AreaProfissional areaProfissional);

    List<Usuario> findByCargo(Cargo cargo);

    List<Usuario> findByAreaProfissional(AreaProfissional areaProfissional);
}
