'use client';

import { useState } from 'react';
import { usePermissions } from '@/components/ui/hooks/usePermissions';

const ALL_PERMISSIONS = [
  'agenda.read',
  'agenda.read_own',
  'agenda.create',
  'agenda.edit',
  'agenda.delete',
  'financeiro.read',
  'financeiro.create',
  'financeiro.edit',
  'estoque.read',
  'estoque.create',
  'estoque.edit',
  'pacientes.read',
  'pacientes.create',
  'pacientes.edit',
  'consentimento.read',
  'consentimento.create',
  'reports.read',
];

export default function PermissionDebugPanel() {
  const { can, isSuperAdmin, role } = usePermissions();
  const [open, setOpen] = useState(true);

  return (
    <div style={{
      position: 'fixed',
      bottom: 16,
      right: 16,
      zIndex: 9999,
      fontFamily: 'monospace',
      fontSize: 12,
      width: 280,
      borderRadius: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      overflow: 'hidden',
      border: '1px solid #333',
    }}>
      {/* Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          background: '#1b1b1b',
          color: '#fff',
          padding: '8px 12px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>🔐 Permissões Debug</span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>{open ? '▼ fechar' : '▲ abrir'}</span>
      </div>

      {open && (
        <div style={{ background: '#111', color: '#eee', padding: '10px 12px', maxHeight: 420, overflowY: 'auto' }}>
          {/* Perfil */}
          <div style={{
            marginBottom: 10,
            padding: '6px 10px',
            background: '#222',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            <span style={{ color: '#BBA188', fontWeight: 700, fontSize: 11 }}>PERFIL ATUAL</span>
            <span style={{ color: '#fff', fontSize: 13 }}>{role ?? '—'}</span>
            {isSuperAdmin && (
              <span style={{
                marginTop: 4,
                background: '#BBA188',
                color: '#1b1b1b',
                borderRadius: 4,
                padding: '2px 6px',
                fontSize: 10,
                fontWeight: 700,
                width: 'fit-content',
              }}>⭐ SUPER ADMIN — acesso total</span>
            )}
          </div>

          {/* Lista de permissões */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ALL_PERMISSIONS.map(perm => {
              const allowed = isSuperAdmin || can(perm as any);
              return (
                <div
                  key={perm}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 8px',
                    borderRadius: 6,
                    background: allowed ? 'rgba(138,180,100,0.1)' : 'rgba(220,80,80,0.08)',
                    borderLeft: `3px solid ${allowed ? '#6abf69' : '#e74c3c'}`,
                  }}
                >
                  <span style={{ color: '#ccc' }}>{perm}</span>
                  <span style={{
                    fontWeight: 700,
                    fontSize: 11,
                    color: allowed ? '#6abf69' : '#e74c3c',
                  }}>
                    {allowed ? '✓ OK' : '✗ NEG'}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 10, color: '#555', fontSize: 10, textAlign: 'center' }}>
            Remova este painel antes de ir para produção
          </div>
        </div>
      )}
    </div>
  );
}