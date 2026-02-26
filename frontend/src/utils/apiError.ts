import { ApiError } from '@/services/api';

/**
 * Converte um erro de API em mensagem amigável ao usuário,
 * variando a mensagem de acordo com o código HTTP retornado pelo backend.
 */
export function getApiErrorMessage(err: unknown, context = 'operação'): string {
  // Erro de rede: fetch falhou antes de receber qualquer resposta
  if (!(err instanceof ApiError)) {
    if (err instanceof Error) return err.message;
    return 'Erro desconhecido. Tente novamente.';
  }

  switch (err.status) {
    case 400:
      // Validação de campos (@Valid no backend) — extrai a primeira mensagem
      if (err.erros) {
        const firstMsg = Object.values(err.erros)[0];
        return `Dados inválidos: ${firstMsg}`;
      }
      return err.mensagem || 'Dados inválidos. Verifique o formulário e tente novamente.';

    case 401:
      return 'Sessão expirada. Faça login novamente.';

    case 403:
      return 'Você não tem permissão para realizar esta ação.';

    case 404:
      // Backend retorna mensagem específica: "X não encontrado com id: Y"
      return err.mensagem || 'Registro não encontrado.';

    case 409:
      return err.mensagem || 'Conflito: este registro já existe no sistema.';

    case 422:
      // BusinessException — backend sempre envia mensagem específica da regra
      return err.mensagem || 'Operação não permitida pelas regras do sistema.';

    case 500:
    case 502:
    case 503:
      return 'Erro interno do servidor. Tente novamente em instantes.';

    default:
      return err.mensagem || `Erro ao realizar ${context}. Tente novamente.`;
  }
}

/**
 * Extrai o mapa de erros de validação (HTTP 400) para exibição inline em formulários.
 * Retorna null se o erro não for de validação.
 */
export function getValidationErrors(err: unknown): Record<string, string> | null {
  if (err instanceof ApiError && err.status === 400 && err.erros) {
    return err.erros;
  }
  return null;
}
