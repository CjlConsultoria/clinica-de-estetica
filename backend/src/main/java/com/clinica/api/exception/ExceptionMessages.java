package com.clinica.api.exception;

public final class ExceptionMessages {

    private ExceptionMessages() {}

    public static final String RECURSO_NAO_ENCONTRADO = "%s não encontrado com id: %d";

    public static final String EMAIL_JA_EM_USO            = "E-mail já está em uso.";
    public static final String SENHA_OBRIGATORIA           = "Senha é obrigatória.";
    public static final String CARGO_OU_ROLE_OBRIGATORIO   = "Informe o cargo do profissional ou a role de acesso.";

    public static final String CPF_JA_CADASTRADO           = "CPF já cadastrado.";
    public static final String EMAIL_JA_CADASTRADO         = "E-mail já cadastrado.";

    public static final String AGENDAMENTO_JA_CANCELADO    = "Agendamento já está cancelado.";
    public static final String MEDICO_HORARIO_OCUPADO      = "Médico já possui agendamento neste horário.";

    public static final String TERMO_INATIVO               = "Este termo não está mais ativo.";
    public static final String PACIENTE_JA_ASSINOU         = "Paciente já assinou este termo.";

    public static final String VALIDADE_PASSADA            = "Data de validade não pode ser no passado.";
    public static final String LOTE_INATIVO                = "Lote não está ativo: %s";
    public static final String ESTOQUE_INSUFICIENTE        = "Estoque insuficiente. Disponível: %s";

    public static final String LANCAMENTO_JA_PAGO          = "Lançamento já está pago.";
    public static final String LANCAMENTO_CANCELADO        = "Lançamento está cancelado.";
    public static final String LANCAMENTO_NAO_CANCELAVEL   = "Não é possível cancelar um lançamento pago. Use estorno.";

    public static final String COMISSAO_NAO_PENDENTE       = "Comissão não está pendente: %s";

    public static final String FALHA_SALVAR_ARQUIVO        = "Falha ao salvar arquivo: %s";

    public static final String CREDENCIAIS_INVALIDAS       = "E-mail ou senha inválidos.";
    public static final String ACESSO_NEGADO               = "Acesso negado. Você não tem permissão para realizar esta operação.";
    public static final String INTEGRIDADE_GENERICA        = "Operação viola restrição de integridade: registro duplicado ou referência inválida.";
    public static final String INTEGRIDADE_CPF             = "CPF já cadastrado no sistema.";
    public static final String INTEGRIDADE_EMAIL           = "E-mail já cadastrado no sistema.";
    public static final String INTEGRIDADE_UNIQUE          = "Registro duplicado: já existe um cadastro com estes dados.";
    public static final String JSON_INVALIDO               = "Requisição inválida: corpo ausente ou com formato incorreto (JSON inválido).";
    public static final String PARAMETRO_AUSENTE           = "Parâmetro obrigatório ausente: '%s'.";
    public static final String PARAMETRO_TIPO_INVALIDO     = "Valor inválido para o parâmetro '%s': '%s'.";
    public static final String METODO_NAO_SUPORTADO        = "Método HTTP '%s' não suportado para este endpoint.";
    public static final String ERRO_INTERNO               = "Erro interno do servidor. Tente novamente em instantes.";
}
