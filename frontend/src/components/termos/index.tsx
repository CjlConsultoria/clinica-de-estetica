'use client';

import React, {
  useState,
  useRef,
  useLayoutEffect,
} from 'react';
import Button from '@/components/ui/button';
import CancelModal  from '@/components/modals/cancelModal';
import ConfirmModal from '@/components/modals/confirmModal';
import SucessModal  from '@/components/modals/sucessModal';
import ErrorModal   from '@/components/modals/errorModal';
import {
  PageWrapper,
  PageTitle,
  TabsRow,
  TabButton,
  Card,
  ContentArea,
  ScrollWrapper,
  TextDisplay,
  EditableTextarea,
  CustomScrollbar,
  ScrollThumb,
  EmptyState,
  EmptyIconWrap,
  EmptyText,
  FooterRow,
  LastUpdateWrap,
  LastUpdateLabel,
  LastUpdateDate,
} from './styles';

/* ------------------------------------------------------------------ Types */
type Tab = 'terms' | 'privacy';

/* -------------------------------------------------------- Main Component */
export default function TermosPage() {
  const [activeTab, setActiveTab] = useState<Tab>('terms');

  // DEPOIS — texto placeholder para testes locais
  const [termsText,   setTermsText]   = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.');
  const [privacyText, setPrivacyText] = useState('Política de privacidade placeholder. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.');
  const [backupTerms,   setBackupTerms]   = useState('');
  const [backupPrivacy, setBackupPrivacy] = useState('');

  const [lastDate, setLastDate] = useState('');
  const [lastTime, setLastTime] = useState('');

  const [isEditing,  setIsEditing]  = useState(false);
  const [isSaving,   setIsSaving]   = useState(false);
  const [pendingTab, setPendingTab] = useState<Tab | null>(null);

  /* ── Modal states ─────────────────────────────────────────────────────── */
  const [cancelModalOpen,  setCancelModalOpen]  = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [sucessModalOpen,  setSucessModalOpen]  = useState(false);
  const [errorModalOpen,   setErrorModalOpen]   = useState(false);
  const [errorMessage,     setErrorMessage]     = useState('');
  const [sucessMessage,    setSucessMessage]    = useState('');

  /* ── Scroll refs ──────────────────────────────────────────────────────── */
  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const displayRef   = useRef<HTMLDivElement>(null);
  const thumbRef     = useRef<HTMLDivElement>(null);
  const thumbRefEdit = useRef<HTMLDivElement>(null);

  /* --------------------------------------------------------- Scroll thumb */
  function updateThumb(el: HTMLElement, thumb: HTMLElement) {
    const ratio = el.clientHeight / el.scrollHeight;
    const h     = Math.max(30, ratio * el.clientHeight);
    const pct   = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
    thumb.style.height = h + 'px';
    thumb.style.top    = pct * (el.clientHeight - h) + 'px';
  }

  function onScroll(
    ref: React.RefObject<HTMLElement | null>,
    tRef: React.RefObject<HTMLDivElement | null>,
  ) {
    if (ref.current && tRef.current) updateThumb(ref.current, tRef.current);
  }

  function onThumbMouseDown(
    e: React.MouseEvent,
    ref: React.RefObject<HTMLElement | null>,
  ) {
    e.preventDefault();
    const track = (e.target as HTMLElement).parentElement;
    if (!track || !ref.current) return;
    const move = (ev: MouseEvent) => {
      const rect  = track.getBoundingClientRect();
      const ratio = Math.min(Math.max(0, ev.clientY - rect.top), rect.height) / rect.height;
      ref.current!.scrollTop = ratio * (ref.current!.scrollHeight - ref.current!.clientHeight);
    };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }

  useLayoutEffect(() => {
    const el   = isEditing ? textareaRef.current : displayRef.current;
    const tRef = isEditing ? thumbRefEdit.current : thumbRef.current;
    if (el && tRef) setTimeout(() => updateThumb(el, tRef), 50);
  }, [isEditing, activeTab, termsText, privacyText]);

  /* --------------------------------------------------------- Tab switching */
  function handleTabClick(tab: Tab) {
    if (tab === activeTab) return;
    if (isEditing) {
      setPendingTab(tab);
      setCancelModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  }

  /* --------------------------------------------------------------- Editing */
  function startEdit() {
    if (activeTab === 'terms') setBackupTerms(termsText);
    else setBackupPrivacy(privacyText);
    setIsEditing(true);
  }

  function handleChange(value: string) {
    if (activeTab === 'terms') setTermsText(value);
    else setPrivacyText(value);
  }

  /* ── Cancel flow ──────────────────────────────────────────────────────── */
  function handleCancelClick() {
    setCancelModalOpen(true);
  }

  function handleCancelConfirmed() {
    setCancelModalOpen(false);
    setIsEditing(false);
    if (activeTab === 'terms') setTermsText(backupTerms);
    else setPrivacyText(backupPrivacy);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  }

  function handleCancelDismissed() {
    setCancelModalOpen(false);
    setPendingTab(null);
  }

  /* ── Save flow ────────────────────────────────────────────────────────── */
  function handleSaveClick() {
    const content = activeTab === 'terms' ? termsText : privacyText;
    if (!content.trim()) {
      setErrorMessage(
        activeTab === 'terms'
          ? 'Nao e possivel salvar o Termo de Uso vazio.'
          : 'Nao e possivel salvar a Politica de Privacidade vazia.',
      );
      setErrorModalOpen(true);
      return;
    }
    setConfirmModalOpen(true);
  }

  async function handleSaveConfirmed() {
    setConfirmModalOpen(false);
    setIsSaving(true);

    /* TODO: chamar API aqui */
    await new Promise(r => setTimeout(r, 600)); // simulacao temporaria

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    setLastDate(pad(now.getDate()) + '/' + pad(now.getMonth() + 1) + '/' + now.getFullYear());
    setLastTime(pad(now.getHours()) + ':' + pad(now.getMinutes()));
    setIsEditing(false);
    setIsSaving(false);

    setSucessMessage(
      activeTab === 'terms'
        ? 'Termos de uso alterados com sucesso!'
        : 'Politica de privacidade alterada com sucesso!',
    );
    setSucessModalOpen(true);
  }

  /* ------------------------------------------------------------- Computed */
  const currentText = activeTab === 'terms' ? termsText : privacyText;
  const isFirstTab  = activeTab === 'terms';

  /* -------------------------------------------------------------- Render */
  return (
    <PageWrapper>
      <PageTitle>
        {activeTab === 'terms' ? 'Termos de uso' : 'Politica de privacidade'}
      </PageTitle>

      <TabsRow>
        <TabButton $active={activeTab === 'terms'} onClick={() => handleTabClick('terms')}>
          Termos de uso
        </TabButton>
        <TabButton $active={activeTab === 'privacy'} onClick={() => handleTabClick('privacy')}>
          Politica de privacidade
        </TabButton>
      </TabsRow>

      <Card $activeFirst={isFirstTab}>
        <ContentArea>
          <ScrollWrapper>

            {/* Editando */}
            {isEditing && (
              <>
                <EditableTextarea
                  ref={textareaRef}
                  value={currentText}
                  onChange={(e) => handleChange(e.target.value)}
                  onScroll={() => onScroll(textareaRef, thumbRefEdit)}
                />
                <CustomScrollbar>
                  <ScrollThumb
                    ref={thumbRefEdit}
                    onMouseDown={(e) => onThumbMouseDown(e, textareaRef)}
                  />
                </CustomScrollbar>
              </>
            )}

            {/* Exibindo conteudo */}
            {!isEditing && currentText && (
              <>
                <TextDisplay
                  ref={displayRef}
                  onScroll={() => onScroll(displayRef, thumbRef)}
                >
                  {currentText}
                </TextDisplay>
                <CustomScrollbar>
                  <ScrollThumb
                    ref={thumbRef}
                    onMouseDown={(e) => onThumbMouseDown(e, displayRef)}
                  />
                </CustomScrollbar>
              </>
            )}

            {/* Vazio — centralizado no card */}
            {!isEditing && !currentText && (
              <EmptyState>
                <EmptyIconWrap>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </EmptyIconWrap>
                <EmptyText>
                  {activeTab === 'terms'
                    ? 'Termos de uso nao encontrados.'
                    : 'Politica de privacidade nao encontrada.'}
                </EmptyText>
              </EmptyState>
            )}

          </ScrollWrapper>
        </ContentArea>

        {/* Footer: sempre visivel */}
        <FooterRow>
          {(lastDate || isEditing || currentText) && (
            <LastUpdateWrap>
              <LastUpdateLabel>Ultima alteracao:</LastUpdateLabel>
              <LastUpdateDate>{lastDate}</LastUpdateDate>
              <LastUpdateDate>{lastTime}</LastUpdateDate>
            </LastUpdateWrap>
          )}

          {isEditing && (
            <Button variant="outline" onClick={handleCancelClick}>
              Cancelar
            </Button>
          )}

          <Button
            variant="primary"
            loading={isSaving}
            onClick={isEditing ? handleSaveClick : startEdit}
          >
            {isEditing ? 'Salvar' : 'Editar'}
          </Button>
        </FooterRow>
      </Card>

      {/* ── Modais ─────────────────────────────────────────────────────────── */}

      <CancelModal
        isOpen={cancelModalOpen}
        title="Cancelar edicao?"
        message="Todas as alteracoes feitas serao perdidas. Deseja continuar?"
        onConfirm={handleCancelConfirmed}
        onCancel={handleCancelDismissed}
      />

      <ConfirmModal
        isOpen={confirmModalOpen}
        title={
          activeTab === 'terms'
            ? 'Modificar Termos de Uso?'
            : 'Modificar Politica de Privacidade?'
        }
        message="Ao realizar essa alteracao, os usuarios deverao aceitar novamente os termos atualizados para continuar utilizando a plataforma."
        onConfirm={handleSaveConfirmed}
        onCancel={() => setConfirmModalOpen(false)}
      />

      <SucessModal
        isOpen={sucessModalOpen}
        title={
          activeTab === 'terms'
            ? 'Termos de uso atualizados!'
            : 'Politica de privacidade atualizada!'
        }
        message={sucessMessage}
        onClose={() => setSucessModalOpen(false)}
      />

      <ErrorModal
        isOpen={errorModalOpen}
        title="Ocorreu um erro"
        message={errorMessage}
        onClose={() => setErrorModalOpen(false)}
      />
    </PageWrapper>
  );
}