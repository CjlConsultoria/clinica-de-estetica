'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import * as S from './styles';
import {
  validateEmail,
  validatePassword,
  validateCredentials,
  shouldShowModal,
  getModalTitle
} from './validation';
import ErrorModal from '@/components/modals/errorModal';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  function clearAllErrors() {
    setEmailError('');
    setPasswordError('');
  }

  function handleEmailBlur() {
    setEmailTouched(true);
    if (email.trim()) {
      const error = validateEmail(email);
      setEmailError(error ? error.message : '');
    }
  }

  function handlePasswordBlur() {
    setPasswordTouched(true);
    if (password.trim()) {
      const error = validatePassword(password);
      setPasswordError(error ? error.message : '');
    }
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    if (emailTouched) setEmailError('');
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    if (passwordTouched) setPasswordError('');
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    clearAllErrors();

    const validationError = validateCredentials(email, password);

    if (validationError) {
      if (shouldShowModal(validationError)) {
        setModalTitle(getModalTitle(validationError.message));
        setModalMessage(validationError.message);
        setModalOpen(true);
      } else {
        if (validationError.field === 'email') setEmailError(validationError.message);
        else if (validationError.field === 'password') setPasswordError(validationError.message);
      }
      return;
    }

    setLoading(true);
    const result = await login({ email: email.trim(), password });
    setLoading(false);

    if (result.success) {
      router.replace('/agenda');
    } else {
      setModalTitle('Falha no login');
      setModalMessage(result.error || 'E-mail ou senha incorretos. Tente novamente.');
      setModalOpen(true);
    }
  }

  return (
    <>
      <S.Container>
        <S.LeftPanel>
          <S.PatternOverlay />
        </S.LeftPanel>

        <S.RightPanel>
          <S.FormWrapper>
            <S.LogoWrapper>
              <S.LogoImg src="/logocjl.png" alt="Logo Clínica" />
            </S.LogoWrapper>

            <S.Title>Clínica Estética</S.Title>
            <S.Subtitle>Sistema de Gestão</S.Subtitle>

            <S.Form onSubmit={handleLogin}>
              <S.InputGroup>
                <S.Label htmlFor="email">E-mail</S.Label>
                <S.InputWrapper>
                  <S.Input
                    id="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={handleEmailBlur}
                    disabled={loading}
                    $hasError={!!emailError}
                  />
                </S.InputWrapper>
                {emailError && (
                  <S.FieldError>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {emailError}
                  </S.FieldError>
                )}
              </S.InputGroup>

              <S.InputGroup>
                <S.Label htmlFor="password">Senha</S.Label>
                <S.InputWrapper>
                  <S.Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onBlur={handlePasswordBlur}
                    disabled={loading}
                    $hasError={!!passwordError}
                  />
                  <S.TogglePassword
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </S.TogglePassword>
                </S.InputWrapper>
                {passwordError && (
                  <S.FieldError>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {passwordError}
                  </S.FieldError>
                )}
              </S.InputGroup>

              <S.SubmitButton type="submit" disabled={loading}>
                {loading ? (<><S.Spinner />Entrando...</>) : 'Entrar'}
              </S.SubmitButton>
            </S.Form>
          </S.FormWrapper>
        </S.RightPanel>
      </S.Container>

      <ErrorModal
        isOpen={modalOpen}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
