package com.clinica.api.service;

import com.clinica.api.entity.Empresa;
import com.clinica.api.repository.EmpresaRepository;
import com.clinica.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TrialExpirationJob {

    private static final Logger log = LoggerFactory.getLogger(TrialExpirationJob.class);

    private final EmpresaRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void expirarTrials() {
        List<Empresa> expiradas = empresaRepository.findByStatusAndVencimentoBefore("trial", LocalDate.now());

        for (Empresa empresa : expiradas) {
            empresa.setStatus("expirado");
            empresa.setAtivo(false);
            empresaRepository.save(empresa);

            int desativados = usuarioRepository.findByEmpresaIdAndAtivoTrue(empresa.getId())
                    .stream()
                    .peek(u -> u.setAtivo(false))
                    .mapToInt(u -> { usuarioRepository.save(u); return 1; })
                    .sum();

            log.info("Trial expirado: empresa {} (id={}), {} usuário(s) desativado(s)",
                    empresa.getNome(), empresa.getId(), desativados);
        }

        if (!expiradas.isEmpty()) {
            log.info("Job de expiração de trial: {} empresa(s) expirada(s)", expiradas.size());
        }
    }
}
