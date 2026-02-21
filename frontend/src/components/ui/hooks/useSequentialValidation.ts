import { useState, useCallback } from 'react';

export interface ValidationField<T extends string> {
  key: T;
  validate: (value: string) => string | null;
}

export interface UseSequentialValidationReturn<T extends string> {
  errors: Partial<Record<T, string>>;
  validate: (values: Partial<Record<T, string>>) => boolean;
  clearError: (key: T) => void;
  clearAll: () => void;
}

export function useSequentialValidation<T extends string>(
  fields: ValidationField<T>[]
): UseSequentialValidationReturn<T> {
  const [errors, setErrors] = useState<Partial<Record<T, string>>>({});

  const validate = useCallback(
    (values: Partial<Record<T, string>>): boolean => {
      for (const field of fields) {
        const value = values[field.key] ?? '';
        const error = field.validate(value);
        if (error) {
          setErrors({ [field.key]: error } as Partial<Record<T, string>>);
          return false;
        }
      }
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