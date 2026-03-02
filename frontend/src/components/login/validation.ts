export type ValidationError = {
  field: 'email' | 'password' | 'general';
  message: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): ValidationError | null {
  if (!email || email.trim() === '') {
    return { field: 'email', message: 'Por favor, insira seu e-mail' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { field: 'email', message: 'E-mail inválido. Verifique o formato' };
  }
  return null;
}

export function validatePassword(password: string): ValidationError | null {
  if (!password || password.trim() === '') {
    return { field: 'password', message: 'Por favor, insira sua senha' };
  }
  if (password.length < 8) {
    return { field: 'password', message: 'A senha deve ter no mínimo 8 caracteres' };
  }
  return null;
}

export function validateCredentials(email: string, password: string): ValidationError | null {
  const emailError = validateEmail(email);
  if (emailError) return emailError;

  const passwordError = validatePassword(password);
  if (passwordError) return passwordError;

  return null;
}

export const ERROR_MESSAGES = {
  EMAIL_REQUIRED:    'Por favor, insira seu e-mail',
  EMAIL_INVALID:     'E-mail inválido. Verifique o formato',
  PASSWORD_REQUIRED: 'Por favor, insira sua senha',
  PASSWORD_MIN_LENGTH: 'A senha deve ter no mínimo 8 caracteres',
};

export function shouldShowModal(_error: ValidationError | null): boolean {
  return false;
}

export function getModalTitle(_message: string): string {
  return 'Erro!';
}
