package com.clinica.api.config;

import com.clinica.api.entity.*;
import com.clinica.api.enums.Role;
import com.clinica.api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;
    private final EmpresaRepository empresaRepository;
    private final FaturaAssinaturaRepository faturaAssinaturaRepository;
    private final ComunicadoRepository comunicadoRepository;
    private final SuporteTicketRepository suporteTicketRepository;
    private final TicketMensagemRepository ticketMensagemRepository;
    private final NotificacaoRepository notificacaoRepository;

    @Override
    public void run(ApplicationArguments args) {

        int migrated = jdbcTemplate.update(
                "UPDATE usuarios SET role = 'TECNICO' WHERE role = 'MEDICO'"
        );
        if (migrated > 0) {
            log.info("Migracao de roles: {} usuario(s) MEDICO -> TECNICO", migrated);
        }


        if (usuarioRepository.findByEmail("admin@clinica.com").isEmpty()) {
            usuarioRepository.save(Usuario.builder()
                    .nome("Administrador")
                    .email("admin@clinica.com")
                    .senha(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .ativo(true)
                    .build());
            log.info("Usuario admin criado: admin@clinica.com / Admin@123");
        }


        if (usuarioRepository.findByEmail("gerente@clinica.com").isEmpty()) {
            usuarioRepository.save(Usuario.builder()
                    .nome("Carlos Gerente")
                    .email("gerente@clinica.com")
                    .senha(passwordEncoder.encode("Gerente@123"))
                    .role(Role.GERENTE)
                    .cargo(com.clinica.api.enums.Cargo.GERENTE)
                    .areaProfissional(com.clinica.api.enums.AreaProfissional.ADMINISTRATIVA)
                    .telefone("(11) 91111-0001")
                    .ativo(true)
                    .build());
            log.info("Usuario gerente criado: gerente@clinica.com / Gerente@123");
        }


        if (usuarioRepository.findByEmail("recepcao@clinica.com").isEmpty()) {
            usuarioRepository.save(Usuario.builder()
                    .nome("Julia Recepcao")
                    .email("recepcao@clinica.com")
                    .senha(passwordEncoder.encode("Recepcao@123"))
                    .role(Role.RECEPCIONISTA)
                    .cargo(com.clinica.api.enums.Cargo.RECEPCIONISTA)
                    .areaProfissional(com.clinica.api.enums.AreaProfissional.ADMINISTRATIVA)
                    .telefone("(11) 91111-0002")
                    .ativo(true)
                    .build());
            log.info("Usuario recepcionista criado: recepcao@clinica.com / Recepcao@123");
        }


        if (usuarioRepository.findByEmail("financeiro@clinica.com").isEmpty()) {
            usuarioRepository.save(Usuario.builder()
                    .nome("Roberto Financeiro")
                    .email("financeiro@clinica.com")
                    .senha(passwordEncoder.encode("Financeiro@123"))
                    .role(Role.FINANCEIRO)
                    .cargo(com.clinica.api.enums.Cargo.FINANCEIRO)
                    .areaProfissional(com.clinica.api.enums.AreaProfissional.ADMINISTRATIVA)
                    .telefone("(11) 91111-0003")
                    .ativo(true)
                    .build());
            log.info("Usuario financeiro criado: financeiro@clinica.com / Financeiro@123");
        }


        if (usuarioRepository.findByEmail("tecnico@clinica.com").isEmpty()) {
            usuarioRepository.save(Usuario.builder()
                    .nome("Patricia Tecnica")
                    .email("tecnico@clinica.com")
                    .senha(passwordEncoder.encode("Tecnico@123"))
                    .role(Role.TECNICO)
                    .cargo(com.clinica.api.enums.Cargo.ESTETICISTA)
                    .areaProfissional(com.clinica.api.enums.AreaProfissional.TECNICA)
                    .telefone("(11) 91111-0004")
                    .especialidade("Estetica Avancada")
                    .ativo(true)
                    .build());
            log.info("Usuario tecnico criado: tecnico@clinica.com / Tecnico@123");
        }


        if (empresaRepository.count() == 0) {
            Empresa e1 = empresaRepository.save(Empresa.builder()
                    .nome("Clinica Bella Vita").email("admin@bellavita.com")
                    .telefone("(11) 98765-4321").cnpj("12.345.678/0001-90")
                    .responsavel("Marina Costa").plano("Pro").valor(new BigDecimal("349.00"))
                    .status("ativo").dataInicio(LocalDate.of(2024, 11, 1))
                    .vencimento(LocalDate.now().plusDays(15))
                    .proximaCobranca(LocalDate.now().plusDays(15))
                    .usuarios(8).adminNome("Marina Costa").adminEmail("admin@bellavita.com").ativo(true).build());

            Empresa e2 = empresaRepository.save(Empresa.builder()
                    .nome("Studio Ana Rodrigues").email("ana@studio.com")
                    .telefone("(21) 97654-3210").cnpj("23.456.789/0001-01")
                    .responsavel("Ana Rodrigues").plano("Starter").valor(new BigDecimal("149.00"))
                    .status("ativo").dataInicio(LocalDate.of(2025, 1, 15))
                    .vencimento(LocalDate.now().plusDays(22))
                    .proximaCobranca(LocalDate.now().plusDays(22))
                    .usuarios(3).adminNome("Ana Rodrigues").adminEmail("ana@studio.com").ativo(true).build());

            Empresa e3 = empresaRepository.save(Empresa.builder()
                    .nome("Clinica Derma Saude").email("contato@dermasaude.com")
                    .telefone("(31) 96543-2109").cnpj("34.567.890/0001-12")
                    .responsavel("Dr. Paulo Lima").plano("Enterprise").valor(new BigDecimal("749.00"))
                    .status("ativo").dataInicio(LocalDate.of(2024, 3, 10))
                    .vencimento(LocalDate.now().plusDays(5))
                    .proximaCobranca(LocalDate.now().plusDays(5))
                    .usuarios(22).adminNome("Dr. Paulo Lima").adminEmail("contato@dermasaude.com").ativo(true).build());

            Empresa e4 = empresaRepository.save(Empresa.builder()
                    .nome("Instituto Skin Care").email("admin@skincare.com")
                    .telefone("(11) 95432-1098").cnpj("45.678.901/0001-23")
                    .responsavel("Carla Mendes").plano("Pro").valor(new BigDecimal("349.00"))
                    .status("suspenso").dataInicio(LocalDate.of(2024, 6, 5))
                    .vencimento(LocalDate.now().minusDays(22))
                    .proximaCobranca(LocalDate.now())
                    .usuarios(6).observacoes("Fatura vencida ha 22 dias.")
                    .adminNome("Carla Mendes").adminEmail("admin@skincare.com").ativo(false).build());

            Empresa e5 = empresaRepository.save(Empresa.builder()
                    .nome("Espaco Beleza Premium").email("fin@espacobeleza.com")
                    .telefone("(11) 94321-0987").cnpj("56.789.012/0001-34")
                    .responsavel("Fernanda Alves").plano("Pro").valor(new BigDecimal("349.00"))
                    .status("ativo").dataInicio(LocalDate.of(2025, 2, 20))
                    .vencimento(LocalDate.now().plusDays(30))
                    .proximaCobranca(LocalDate.now().plusDays(30))
                    .usuarios(11).adminNome("Fernanda Alves").adminEmail("fin@espacobeleza.com").ativo(true).build());

            log.info("5 empresas de exemplo criadas.");


            usuarioRepository.findByEmail("gerente@clinica.com").ifPresent(u -> {
                u.setEmpresaId(e1.getId());
                usuarioRepository.save(u);
            });
            usuarioRepository.findByEmail("recepcao@clinica.com").ifPresent(u -> {
                u.setEmpresaId(e1.getId());
                usuarioRepository.save(u);
            });
            usuarioRepository.findByEmail("financeiro@clinica.com").ifPresent(u -> {
                u.setEmpresaId(e1.getId());
                usuarioRepository.save(u);
            });
            usuarioRepository.findByEmail("tecnico@clinica.com").ifPresent(u -> {
                u.setEmpresaId(e1.getId());
                usuarioRepository.save(u);
            });
            log.info("Usuarios de teste vinculados à Clinica Bella Vita (id={}).", e1.getId());


            if (faturaAssinaturaRepository.count() == 0) {
                faturaAssinaturaRepository.save(FaturaAssinatura.builder()
                        .empresa(e1).competencia("Fevereiro 2025").valor(new BigDecimal("349.00"))
                        .plano("Pro").vencimento(LocalDate.now().plusDays(15)).status("pendente").build());
                faturaAssinaturaRepository.save(FaturaAssinatura.builder()
                        .empresa(e4).competencia("Janeiro 2025").valor(new BigDecimal("349.00"))
                        .plano("Pro").vencimento(LocalDate.now().minusDays(22)).status("vencido").build());
                faturaAssinaturaRepository.save(FaturaAssinatura.builder()
                        .empresa(e1).competencia("Janeiro 2025").valor(new BigDecimal("349.00"))
                        .plano("Pro").vencimento(LocalDate.of(2025, 2, 5))
                        .pagamento(LocalDate.of(2025, 2, 3)).status("pago").build());
                faturaAssinaturaRepository.save(FaturaAssinatura.builder()
                        .empresa(e2).competencia("Fevereiro 2025").valor(new BigDecimal("149.00"))
                        .plano("Starter").vencimento(LocalDate.now().plusDays(22)).status("pendente").build());
                faturaAssinaturaRepository.save(FaturaAssinatura.builder()
                        .empresa(e3).competencia("Fevereiro 2025").valor(new BigDecimal("749.00"))
                        .plano("Enterprise").vencimento(LocalDate.now().plusDays(5)).status("pendente").build());
                log.info("5 faturas de exemplo criadas.");
            }


            if (comunicadoRepository.count() == 0) {
                comunicadoRepository.save(Comunicado.builder()
                        .titulo("Manutencao programada — domingo 02/03")
                        .conteudo("O sistema ficara indisponivel das 02h as 04h para manutencao de infraestrutura.")
                        .tipo("manutencao").status("enviado").destinatariosJson("todas")
                        .criadoPor(1L).nomeAutor("Administrador").ativo(true).build());
                comunicadoRepository.save(Comunicado.builder()
                        .titulo("Nova funcionalidade: Relatorios avancados")
                        .conteudo("Lancamos os relatorios avancados de atendimento. Acesse Relatorios > Avancados.")
                        .tipo("novidade").status("enviado").destinatariosJson("todas")
                        .criadoPor(1L).nomeAutor("Administrador").ativo(true).build());
                comunicadoRepository.save(Comunicado.builder()
                        .titulo("Reajuste de planos — Marco 2025")
                        .conteudo("A partir de 01/03/2025 os planos Profissional e Enterprise terao reajuste de 8,3%.")
                        .tipo("cobranca").status("enviado").destinatariosJson("todas")
                        .criadoPor(1L).nomeAutor("Administrador").ativo(true).build());
                comunicadoRepository.save(Comunicado.builder()
                        .titulo("Alerta: Atualizacao obrigatoria de senha")
                        .conteudo("Por seguranca, todos os administradores devem redefinir suas senhas ate 10/03/2025.")
                        .tipo("alerta").status("enviado").destinatariosJson("todas")
                        .criadoPor(1L).nomeAutor("Administrador").ativo(true).build());
                log.info("4 comunicados de exemplo criados.");
            }


            if (suporteTicketRepository.count() == 0) {
                SuporteTicket t1 = suporteTicketRepository.save(SuporteTicket.builder()
                        .titulo("Erro ao gerar relatorio financeiro")
                        .descricao("Ao tentar exportar o relatorio mensal, o sistema retorna erro 500.")
                        .categoria("tecnico").prioridade("alta").status("aberto")
                        .criadoPor(1L).nomeAutor("Marina Costa")
                        .empresaId(e1.getId()).empresaNome(e1.getNome()).build());

                SuporteTicket t2 = suporteTicketRepository.save(SuporteTicket.builder()
                        .titulo("Duvida sobre cobranca de marco")
                        .descricao("Recebi uma cobranca diferente do habitual. Como e calculado o reajuste?")
                        .categoria("financeiro").prioridade("media").status("em_andamento")
                        .criadoPor(1L).nomeAutor("Ana Rodrigues")
                        .empresaId(e2.getId()).empresaNome(e2.getNome()).build());

                SuporteTicket t3 = suporteTicketRepository.save(SuporteTicket.builder()
                        .titulo("Solicitacao de novo usuario administrador")
                        .descricao("Preciso cadastrar mais um usuario com perfil de gerente.")
                        .categoria("duvida").prioridade("baixa").status("resolvido")
                        .criadoPor(1L).nomeAutor("Dr. Paulo Lima")
                        .empresaId(e3.getId()).empresaNome(e3.getNome()).build());

                ticketMensagemRepository.save(TicketMensagem.builder()
                        .ticket(t1).autor("Marina Costa").fromSupport(false)
                        .texto("O erro acontece quando seleciono periodo maior que 30 dias.").build());
                ticketMensagemRepository.save(TicketMensagem.builder()
                        .ticket(t1).autor("Suporte Tecnico").fromSupport(true)
                        .texto("Identificamos o problema. Ha um timeout na consulta SQL para periodos longos.").build());
                ticketMensagemRepository.save(TicketMensagem.builder()
                        .ticket(t2).autor("Ana Rodrigues").fromSupport(false)
                        .texto("O valor veio R$ 12,30 a mais do que esperado.").build());
                ticketMensagemRepository.save(TicketMensagem.builder()
                        .ticket(t2).autor("Suporte Financeiro").fromSupport(true)
                        .texto("O reajuste de 8,3% (IPCA anual) foi aplicado a partir de 01/03.").build());
                ticketMensagemRepository.save(TicketMensagem.builder()
                        .ticket(t3).autor("Dr. Paulo Lima").fromSupport(false)
                        .texto("Preciso cadastrar Dr. Carlos como gerente da clinica.").build());
                ticketMensagemRepository.save(TicketMensagem.builder()
                        .ticket(t3).autor("Suporte Tecnico").fromSupport(true)
                        .texto("Acesse Configuracoes > Usuarios > Novo Usuario e selecione perfil Gerente.").build());
                log.info("3 tickets e mensagens criados.");
            }


            if (notificacaoRepository.count() == 0) {
                notificacaoRepository.save(Notificacao.builder()
                        .tipo("ticket").prioridade("alta").lida(false)
                        .titulo("Novo ticket aberto — Prioridade Alta")
                        .descricao("Clinica Bella Vita abriu ticket sobre erro no relatorio financeiro.")
                        .empresaId(e1.getId()).empresaNome(e1.getNome()).build());
                notificacaoRepository.save(Notificacao.builder()
                        .tipo("pagamento").prioridade("alta").lida(false)
                        .titulo("Fatura vencida — Instituto Skin Care")
                        .descricao("Fatura de R$ 349,00 referente a Janeiro 2025 esta vencida ha 22 dias.")
                        .empresaId(e4.getId()).empresaNome(e4.getNome()).build());
                notificacaoRepository.save(Notificacao.builder()
                        .tipo("empresa").prioridade("media").lida(false)
                        .titulo("Empresa proxima do vencimento")
                        .descricao("Clinica Derma Saude vence em 5 dias.")
                        .empresaId(e3.getId()).empresaNome(e3.getNome()).build());
                notificacaoRepository.save(Notificacao.builder()
                        .tipo("sistema").prioridade("baixa").lida(true)
                        .titulo("Backup automatico concluido")
                        .descricao("Backup diario realizado com sucesso as 03:00. Todos os dados estao seguros.").build());
                notificacaoRepository.save(Notificacao.builder()
                        .tipo("pagamento").prioridade("media").lida(false)
                        .titulo("Novo pagamento recebido")
                        .descricao("Studio Ana Rodrigues efetuou pagamento de R$ 149,00 — Fevereiro 2025.")
                        .empresaId(e2.getId()).empresaNome(e2.getNome()).build());
                notificacaoRepository.save(Notificacao.builder()
                        .tipo("relatorio").prioridade("baixa").lida(true)
                        .titulo("Relatorio mensal disponivel")
                        .descricao("O relatorio de receitas de Janeiro/2025 esta disponivel para download.").build());
                log.info("6 notificacoes de exemplo criadas.");
            }
        }
    }
}
