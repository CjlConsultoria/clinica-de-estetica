import { useState, useCallback } from 'react';

/**
 * useSequentialValidation
 *
 * Executa validações em ordem e exibe apenas o PRIMEIRO erro encontrado.
 * Ao corrigir aquele campo, avança para o próximo erro (se houver).
 *
 * @param fields - Lista ordenada de campos a validar
 * @returns helpers para gerenciar erros de formulário
 *
 * Exemplo de uso:
 *
 * const fields = [
 *   { key: 'nome',        validate: (v) => !v ? 'Nome é obrigatório' : null },
 *   { key: 'telefone',    validate: (v) => !v ? 'Telefone é obrigatório' : null },
 *   { key: 'data',        validate: (v) => !v ? 'Data é obrigatória' : null },
 *   { key: 'procedimento',validate: (v) => !v ? 'Procedimento é obrigatório' : null },
 * ];
 * const { errors, validate, clearError, clearAll } = useSequentialValidation(fields);
 */

export interface ValidationField<T extends string> {
  key: T;
  validate: (value: string) => string | null;
}

export interface UseSequentialValidationReturn<T extends string> {
  errors: Partial<Record<T, string>>;
  /** Roda todas as validações em ordem, mostrando apenas o primeiro erro. Retorna true se válido. */
  validate: (values: Partial<Record<T, string>>) => boolean;
  /** Limpa o erro de um campo específico */
  clearError: (key: T) => void;
  /** Limpa todos os erros */
  clearAll: () => void;
}

export function useSequentialValidation<T extends string>(
  fields: ValidationField<T>[]
): UseSequentialValidationReturn<T> {
  const [errors, setErrors] = useState<Partial<Record<T, string>>>({});

  const validate = useCallback(
    (values: Partial<Record<T, string>>): boolean => {
      // Itera em ordem e para no primeiro erro encontrado
      for (const field of fields) {
        const value = values[field.key] ?? '';
        const error = field.validate(value);
        if (error) {
          // Mostra APENAS o erro deste campo, limpa os outros
          setErrors({ [field.key]: error } as Partial<Record<T, string>>);
          return false;
        }
      }
      // Nenhum erro
      setErrors({});
      return true;
    },
    [fields]
  );

  const clearError = useCallback((key: T) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setErrors({});
  }, []);

  return { errors, validate, clearError, clearAll };
}