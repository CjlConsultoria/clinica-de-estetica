export type Role =
  | 'super_admin'
<<<<<<< HEAD
=======
  | 'company_admin'
>>>>>>> f28813edf0f1c78aa8233460f31ac36892245d4a
  | 'gerente'
  | 'tecnico'
  | 'recepcionista'
  | 'financeiro';

export type Permission =
  | 'profissionais.read' | 'profissionais.create' | 'profissionais.edit' | 'profissionais.delete'
  | 'agenda.read' | 'agenda.read_own' | 'agenda.create' | 'agenda.edit' | 'agenda.delete'
  | 'pacientes.read' | 'pacientes.read_own' | 'pacientes.create' | 'pacientes.edit' | 'pacientes.delete'
  | 'prontuario.read' | 'prontuario.read_own' | 'prontuario.create' | 'prontuario.edit'
  | 'historico.read' | 'historico.read_own'
  | 'fotos.read' | 'fotos.read_own' | 'fotos.create'
  | 'reaplicacoes.read' | 'reaplicacoes.read_own' | 'reaplicacoes.create'
  | 'procedimentos.read' | 'procedimentos.create' | 'procedimentos.edit'
  | 'consentimento.read' | 'consentimento.read_own' | 'consentimento.create'
  | 'financeiro.read' | 'financeiro.create' | 'financeiro.edit' | 'financeiro.delete'
  | 'comissoes.read' | 'comissoes.read_own' | 'comissoes.edit'
  | 'estoque.read' | 'estoque.create' | 'estoque.edit'
  | 'lotes.read' | 'lotes.create' | 'lotes.edit'
  | 'relatorios.operacional' | 'relatorios.financeiro' | 'relatorios.completo'
  | 'configuracoes.read' | 'configuracoes.edit'
  | 'dashboard.read'
  | '*';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
<<<<<<< HEAD
  super_admin: ['*'],
=======
  super_admin:   ['*'],
  company_admin: ['*'],

>>>>>>> f28813edf0f1c78aa8233460f31ac36892245d4a
  gerente: [
    'dashboard.read',
    'profissionais.read', 'profissionais.create', 'profissionais.edit',
    'agenda.read', 'agenda.read_own', 'agenda.create', 'agenda.edit', 'agenda.delete',
    'pacientes.read', 'pacientes.create', 'pacientes.edit',
    'prontuario.read', 'prontuario.read_own',
    'historico.read', 'historico.read_own',
    'fotos.read', 'fotos.read_own', 'fotos.create',
    'reaplicacoes.read', 'reaplicacoes.read_own', 'reaplicacoes.create',
    'procedimentos.read', 'procedimentos.create', 'procedimentos.edit',
    'consentimento.read', 'consentimento.read_own', 'consentimento.create',
    'financeiro.read', 'financeiro.create', 'financeiro.edit',
    'comissoes.read', 'comissoes.read_own', 'comissoes.edit',
    'estoque.read', 'estoque.create', 'estoque.edit',
    'lotes.read', 'lotes.create', 'lotes.edit',
    'relatorios.operacional', 'relatorios.financeiro', 'relatorios.completo',
  ],

  tecnico: [
    'dashboard.read',
    'agenda.read_own', 'agenda.create', 'agenda.edit',
    'pacientes.read', 'pacientes.read_own', 'pacientes.create',
    'prontuario.read_own', 'prontuario.create', 'prontuario.edit',
    'historico.read_own',
    'fotos.read_own', 'fotos.create',
    'reaplicacoes.read_own', 'reaplicacoes.create',
    'procedimentos.read',
    'consentimento.read_own', 'consentimento.create',
    'estoque.read',
    'comissoes.read_own',
  ],

  recepcionista: [
    'dashboard.read',
    'agenda.read', 'agenda.read_own', 'agenda.create', 'agenda.edit',
    'pacientes.read', 'pacientes.create', 'pacientes.edit',
    'consentimento.read', 'consentimento.create',
    'estoque.read',
    'procedimentos.read',
  ],

  financeiro: [
    'dashboard.read',
    'financeiro.read', 'financeiro.create', 'financeiro.edit', 'financeiro.delete',
    'comissoes.read', 'comissoes.edit',
    'agenda.read',
    'pacientes.read',
    'relatorios.financeiro', 'relatorios.operacional',
  ],
};

export const CARGO_ROLE_MAP: Record<string, Role> = {
  esteticista:    'tecnico',
  biomedico:      'tecnico',
  enfermeiro:     'tecnico',
  dermatologista: 'tecnico',
  fisioterapeuta: 'tecnico',
  recepcionista:  'recepcionista',
  gerente:        'gerente',
  financeiro:     'financeiro',
};

export const ROLE_LABELS: Record<Role, string> = {
  super_admin:   'Super Admin',
<<<<<<< HEAD
=======
  company_admin: 'Admin',
>>>>>>> f28813edf0f1c78aa8233460f31ac36892245d4a
  gerente:       'Gerente',
  tecnico:       'Técnico',
  recepcionista: 'Recepcionista',
  financeiro:    'Financeiro',
};

export const ROLE_COLORS: Record<Role, { bg: string; color: string }> = {
  super_admin:   { bg: '#1b1b1b', color: '#EBD5B0' },
<<<<<<< HEAD
=======
  company_admin: { bg: '#1a2b1a', color: '#7ecb7e' },
>>>>>>> f28813edf0f1c78aa8233460f31ac36892245d4a
  gerente:       { bg: '#e8f0fd', color: '#3a6bc9' },
  tecnico:       { bg: '#f0e8fd', color: '#7a3ac9' },
  recepcionista: { bg: '#fdf8e8', color: '#c9b03a' },
  financeiro:    { bg: '#e8fdf8', color: '#3ac9a8' },
};

<<<<<<< HEAD
=======
export interface Company {
  id: string;
  name: string;
}

export type CompanyPaymentStatus = 'ativo' | 'vencido' | 'suspenso';

export interface CompanyWithPayment extends Company {
  paymentStatus: CompanyPaymentStatus;
}

export const MOCK_COMPANIES: CompanyWithPayment[] = [
  { id: 'empresa_a', name: 'Clínica Estética A', paymentStatus: 'ativo'   },
  { id: 'empresa_b', name: 'Clínica Estética B', paymentStatus: 'vencido' },
];

>>>>>>> f28813edf0f1c78aa8233460f31ac36892245d4a
export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  cargo: string;
  area: 'tecnica' | 'administrativa' | 'sistema';
<<<<<<< HEAD
}

export const MOCK_USERS: CurrentUser[] = [
  { id: 0, name: 'Super Admin',    email: 'admin@clinica.com',        role: 'super_admin',   cargo: 'super_admin',   area: 'sistema'        },
  { id: 6, name: 'Patricia Gomes', email: 'patricia.g@clinica.com',   role: 'gerente',       cargo: 'gerente',       area: 'administrativa' },
  { id: 1, name: 'Ana Beatriz',    email: 'ana.lima@clinica.com',     role: 'tecnico',       cargo: 'esteticista',   area: 'tecnica'        },
  { id: 4, name: 'Rafael Costa',   email: 'rafael.costa@clinica.com', role: 'recepcionista', cargo: 'recepcionista', area: 'administrativa' },
  { id: 9, name: 'Camila Rocha',   email: 'camila.rocha@clinica.com', role: 'financeiro',    cargo: 'financeiro',    area: 'administrativa' },
=======
  companyId: string | null;
}

export const MOCK_USERS: CurrentUser[] = [
  { id: 0,  name: 'Super Admin',     email: 'admin@sistema.com',           role: 'super_admin',   cargo: 'super_admin',   area: 'sistema',        companyId: null        },

  { id: 10, name: 'Admin Empresa A', email: 'admin@empresa-a.com',         role: 'company_admin', cargo: 'company_admin', area: 'administrativa', companyId: 'empresa_a' },
  { id: 11, name: 'Admin Empresa B', email: 'admin@empresa-b.com',         role: 'company_admin', cargo: 'company_admin', area: 'administrativa', companyId: 'empresa_b' },

  { id: 6,  name: 'Patricia Gomes',  email: 'patricia.g@clinica.com',      role: 'gerente',       cargo: 'gerente',       area: 'administrativa', companyId: 'empresa_a' },
  { id: 1,  name: 'Ana Beatriz',     email: 'ana.lima@clinica.com',        role: 'tecnico',       cargo: 'esteticista',   area: 'tecnica',        companyId: 'empresa_a' },
  { id: 4,  name: 'Rafael Costa',    email: 'rafael.costa@clinica.com',    role: 'recepcionista', cargo: 'recepcionista', area: 'administrativa', companyId: 'empresa_a' },
  { id: 9,  name: 'Camila Rocha',    email: 'camila.rocha@clinica.com',    role: 'financeiro',    cargo: 'financeiro',    area: 'administrativa', companyId: 'empresa_a' },

  { id: 20, name: 'João Silva',      email: 'joao.silva@empresa-b.com',    role: 'gerente',       cargo: 'gerente',       area: 'administrativa', companyId: 'empresa_b' },
  { id: 21, name: 'Lucia Ferreira',  email: 'lucia.f@empresa-b.com',      role: 'tecnico',       cargo: 'biomedico',     area: 'tecnica',        companyId: 'empresa_b' },
>>>>>>> f28813edf0f1c78aa8233460f31ac36892245d4a
];