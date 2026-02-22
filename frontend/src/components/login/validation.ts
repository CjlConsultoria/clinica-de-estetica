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
  EMAIL_REQUIRED: 'Por favor, insira seu e-mail',
  EMAIL_INVALID: 'E-mail inválido. Verifique o formato',
  EMAIL_NOT_FOUND: 'E-mail não encontrado no sistema',
  PASSWORD_REQUIRED: 'Por favor, insira sua senha',
  PASSWORD_MIN_LENGTH: 'A senha deve ter no mínimo 8 caracteres',
  PASSWORD_INCORRECT: 'Senha incorreta. Tente novamente',
  CREDENTIALS_INVALID: 'E-mail ou senha incorretos. Tente novamente.',
  UNAUTHORIZED: 'Acesso negado. Você não tem permissão para acessar esta área.',
  USER_NOT_FOUND: 'Usuário não encontrado. Verifique suas credenciais',
};

export type ModalErrorType = 'CREDENTIALS_INVALID' | 'UNAUTHORIZED' | 'USER_NOT_FOUND';

export function shouldShowModal(error: ValidationError | null): boolean {
  if (!error) return false;
  const modalErrors = [
    ERROR_MESSAGES.CREDENTIALS_INVALID,
    ERROR_MESSAGES.UNAUTHORIZED,
    ERROR_MESSAGES.USER_NOT_FOUND
  ];
  return modalErrors.includes(error.message);
}

export function getModalTitle(message: string): string {
  if (message === ERROR_MESSAGES.CREDENTIALS_INVALID) return 'Login inválido!';
  if (message === ERROR_MESSAGES.UNAUTHORIZED) return 'Acesso negado!';
  if (message === ERROR_MESSAGES.USER_NOT_FOUND) return 'Usuário não encontrado!';
  return 'Erro!';
}