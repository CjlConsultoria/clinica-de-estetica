import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import fs from 'fs';
import path from 'path';

interface HistoryItem {
  id: number;
  date: string;
  procedure: string;
  units: string;
  value: number;
  professional: string;
  lote: string;
  status: string;
}

interface PatientData {
  id: number;
  name: string;
  phone: string;
  email: string;
  birthdate: string;
  since: string;
  status: string;
  totalSpent: number;
  totalSessions: number;
  lastVisit: string;
  nextVisit: string | null;
  observations: string;
  history: HistoryItem[];
}

interface RequestBody {
  patient: PatientData;
}

const C_PRIMARY:    [number,number,number] = [187, 161, 136];
const C_BLACK:      [number,number,number] = [27,  27,  27 ];
const C_DARK:       [number,number,number] = [26,  26,  26 ];
const C_GRAY:       [number,number,number] = [100, 100, 100];
const C_MUTED:      [number,number,number] = [153, 153, 153];
const C_LIGHT:      [number,number,number] = [187, 187, 187];
const C_WHITE:      [number,number,number] = [255, 255, 255];
const C_GOLD:       [number,number,number] = [212, 168, 75 ];
const C_BG:         [number,number,number] = [255, 255, 255];
const C_CARD:       [number,number,number] = [255, 255, 255];
const C_CREAM:      [number,number,number] = [253, 249, 245];
const C_BORDER:     [number,number,number] = [240, 235, 228];
const C_PAID:       [number,number,number] = [138, 117, 96 ];
const C_PAID_BG:    [number,number,number] = [240, 235, 228];

const PROC_COLORS: Record<string,[number,number,number]> = {
  'Botox Facial':         [187, 161, 136],
  'Preenchimento Labial': [210, 180, 140],
  'Bioestimulador':       [60,  60,  60 ],
  'Fio de PDO':           [168, 144, 111],
  'Microagulhamento':     [138, 117, 96 ],
  'Toxina Botulinica':    [187, 161, 136],
  'Toxina Botulínica':    [187, 161, 136],
};

function procColor(p: string): [number,number,number] {
  return PROC_COLORS[p] ?? C_PRIMARY;
}

function lighten(c: [number,number,number], pct: number): [number,number,number] {
  return [
    Math.round(c[0] + (255 - c[0]) * pct),
    Math.round(c[1] + (255 - c[1]) * pct),
    Math.round(c[2] + (255 - c[2]) * pct),
  ];
}

function getAge(b: string): number {
  return Math.floor((Date.now() - new Date(b).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

function getInitials(name: string): string {
  return name.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase();
}

function fmtMoney(v: number): string {
  return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function fmtMoneyShort(v: number): string {
  return 'R$ ' + v.toLocaleString('pt-BR');
}

function safe(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getLogoBase64(): string | null {
  try {
    const d = fs.readFileSync(path.join(process.cwd(), 'public', 'logocjl.png'));
    return 'data:image/png;base64,' + d.toString('base64');
  } catch { return null; }
}

const W         = 210;
const MARGIN    = 14;
const CW        = W - MARGIN * 2;
const HEADER_H  = 52;
const FOOTER_Y  = 285;
const SAFE_MAX  = FOOTER_Y - 2;

async function generateFichaPDF(body: RequestBody): Promise<ArrayBuffer> {
  const { patient } = body;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const now = new Date().toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const age       = getAge(patient.birthdate);
  const initials  = getInitials(patient.name);
  const avgTicket = patient.totalSessions > 0
    ? Math.round(patient.totalSpent / patient.totalSessions) : 0;

  let y = 0;

  function fillBg() {
    doc.setFillColor(...C_BG);
    doc.rect(0, 0, W, 297, 'F');
  }

  function newPage() {
    doc.addPage();
    fillBg();
    y = 14;
  }

  function need(h: number) {
    if (y + h > SAFE_MAX) newPage();
  }

  function pill(
    x: number, py: number,
    label: string,
    color: [number,number,number],
  ): number {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5); 
    const tw = doc.getTextWidth(label);
    const pw = tw + 10;
    const ph = 8;        
    const pr = 3.2;
    doc.setFillColor(...lighten(color, 0.82));
    doc.roundedRect(x, py, pw, ph, pr, pr, 'F');
    doc.setTextColor(...color);
    doc.text(label, x + pw / 2, py + 5.5, { align: 'center' }); 
    return pw;
  }

  function tag(
    x: number, ty: number,
    label: string,
    color: [number,number,number],
    bg: [number,number,number],
  ): number {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    const tw = doc.getTextWidth(label);
    const tw2 = tw + 10;
    const th  = 5.5;
    const tr  = 2.5;
    doc.setFillColor(...bg);
    doc.roundedRect(x, ty, tw2, th, tr, tr, 'F');
    doc.setTextColor(...color);
    doc.text(label, x + tw2 / 2, ty + 3.8, { align: 'center' });
    return tw2;
  }

  fillBg();

  doc.setFillColor(...C_BLACK);
  doc.rect(0, 0, W, HEADER_H, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...C_PRIMARY);
  doc.text('Ficha do Paciente', MARGIN + 5, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 180, 180);
  doc.text('Sistema de Gestao Estetica  -  Prontuario Individual', MARGIN + 5, 30);

  const metaDots = [
    `Gerado em: ${now}`,
    `${patient.totalSessions} sessoes realizadas`,
    `Cliente desde ${patient.since}`,
  ];
  metaDots.forEach((txt, i) => {
    const mx = MARGIN + 5 + i * 62;
    doc.setFillColor(...C_PRIMARY);
    doc.circle(mx, 40, 1.2, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(170, 170, 170);
    doc.text(safe(txt), mx + 3.5, 40.8);
  });

  const logo = getLogoBase64();
  if (logo) doc.addImage(logo, 'PNG', W - MARGIN - 49, -4, 80, 40);

  y = HEADER_H + 10;

  const avR  = 8;
  const avCX = MARGIN + 10 + avR;

  const HCARD_H = 50;
  need(HCARD_H);

  doc.setFillColor(...C_CARD);
  doc.roundedRect(MARGIN, y, CW, HCARD_H, 4, 4, 'F');

  const IX  = MARGIN + 10 + avR * 2 + 7;
  let   IY  = y + 10;

  const avCY = IY - 1;

  doc.setFillColor(246, 242, 239);
  doc.setDrawColor(226, 215, 204);
  doc.setLineWidth(0.5);
  doc.circle(avCX, avCY + avR, avR, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...C_PRIMARY);
  doc.text(initials, avCX, avCY + avR + 1.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...C_DARK);
  doc.text(patient.name, IX, IY + 3);
  IY += 10;

  const rows: [string, string][] = [
    ['Telefone:', patient.phone],
    ['Email:',   patient.email],
    ['Idade:',   `${age} anos  -  Cliente desde ${safe(patient.since)}`],
  ];

  rows.forEach(([lbl, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...C_MUTED);
    doc.text(lbl, IX, IY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...C_GRAY);
    doc.text(val, IX + doc.getTextWidth(lbl) + 2, IY);
    IY += 7; 
  });

  IY -= 2;
  let PX = IX;

  const pillDefs: { label: string; color: [number,number,number] }[] = [
    { label: `${patient.totalSessions} sessoes`,            color: C_PRIMARY },
    { label: `${fmtMoneyShort(patient.totalSpent)} gastos`, color: C_PAID },
    ...(patient.nextVisit
      ? [{ label: `Prox: ${patient.nextVisit}`, color: [168, 144, 111] as [number,number,number] }]
      : []),
    ...(patient.status === 'inativo'
      ? [{ label: 'Inativo', color: [149,165,166] as [number,number,number] }]
      : []),
  ];

  pillDefs.forEach(p => {
    const pw = pill(PX, IY, safe(p.label), p.color);
    PX += pw + 4;
  });

  y += HCARD_H + 6;

  if (patient.observations && patient.observations.trim()) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const obsClean = safe(patient.observations);
    const obsLines = doc.splitTextToSize(obsClean, CW - 22) as string[];
    const obsH     = 12 + obsLines.length * 5.5;

    need(obsH);

    doc.setFillColor(245, 238, 228);
    doc.roundedRect(MARGIN, y, CW, obsH, 3, 3, 'F');

    doc.setFillColor(...C_PRIMARY);
    doc.roundedRect(MARGIN, y, 1.5, obsH, 0.75, 0.75, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...C_PRIMARY);
    doc.text('Observacoes / Alergias:', MARGIN + 7, y + 7.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    obsLines.forEach((line, i) => {
      doc.text(line, MARGIN + 7, y + 7.5 + (i + 1) * 5.5);
    });

    y += obsH + 6;
  }
  
  need(16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...C_PRIMARY);
  doc.text('Historico Completo de Procedimentos', MARGIN, y + 6);

  doc.setDrawColor(...C_BORDER);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y + 9, MARGIN + CW, y + 9);
  y += 15;

  const DOT_R  = 1.3;
  const DOT_X  = MARGIN + 6;
  const CARD_X = MARGIN + 14;
  const CARD_W = CW - 14;

  const CARD_H = 40;
  const ITEM_H = CARD_H + 5;

  const C_DATE_OFFSET  = 7;
  const C_PROC_OFFSET  = 15;
  const C_DET_OFFSET   = 23;
  const C_TAG_OFFSET   = 29;

  patient.history.forEach((h, i) => {
    const pc = procColor(h.procedure);

    need(ITEM_H);

    const dotCY = y;

    if (i < patient.history.length - 1) {
      doc.setDrawColor(210, 210, 210);
      doc.setLineWidth(0.25);
      doc.line(DOT_X, dotCY + DOT_R + 1.5, DOT_X, y + ITEM_H - DOT_R - 1);
    }

    doc.setFillColor(...C_WHITE);
    doc.setDrawColor(210, 210, 210);
    doc.setLineWidth(0.35);
    doc.circle(DOT_X, dotCY, 2.4, 'FD');

    doc.setFillColor(...pc);
    doc.circle(DOT_X, dotCY, DOT_R, 'F');

    doc.setFillColor(...C_CREAM);
    doc.setDrawColor(...C_BORDER);
    doc.setLineWidth(0.3);
    doc.roundedRect(CARD_X, y, CARD_W, CARD_H, 3, 3, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...C_LIGHT);
    doc.text(h.date, CARD_X + 7, y + C_DATE_OFFSET);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...C_DARK);
    doc.text(safe(h.procedure), CARD_X + 7, y + C_PROC_OFFSET);

    const DY = y + C_DET_OFFSET;
    doc.setFontSize(8);
    let cx = CARD_X + 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C_GRAY);
    doc.text(h.units, cx, DY);
    cx += doc.getTextWidth(h.units);

    doc.setTextColor(...C_LIGHT);
    const SEP = '  .  ';
    doc.text(SEP, cx, DY);
    cx += doc.getTextWidth(SEP);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C_DARK);
    const valStr = 'R$ ' + h.value.toLocaleString('pt-BR');
    doc.text(valStr, cx, DY);
    cx += doc.getTextWidth(valStr);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C_LIGHT);
    doc.text(SEP, cx, DY);
    cx += doc.getTextWidth(SEP);

    doc.setTextColor(...C_GRAY);
    doc.text(safe(h.professional), cx, DY);

    const TY = y + C_TAG_OFFSET;
    let   tx = CARD_X + 7;

    const bigTag = (bx: number, by: number, label: string, color: [number,number,number], bg: [number,number,number]): number => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      const tw = doc.getTextWidth(label);
      const tw2 = tw + 14;
      const th  = 7;
      const tr  = 3;
      doc.setFillColor(...bg);
      doc.roundedRect(bx, by, tw2, th, tr, tr, 'F');
      doc.setTextColor(...color);
      doc.text(label, bx + tw2 / 2, by + 4.5, { align: 'center' });
      return tw2;
    };

    const loteLabel = 'Lote: ' + h.lote;
    const loteW = bigTag(tx, TY, loteLabel, pc, lighten(pc, 0.86));
    tx += loteW + 5;

    bigTag(tx, TY, 'Realizado', C_PAID, C_PAID_BG);

    y += ITEM_H;
  });

  const TOT_H = 18;
  const lastPage = (doc as any).getNumberOfPages() as number;
  doc.setPage(lastPage);
  const TOT_Y = FOOTER_Y - TOT_H - 3;

  doc.setFillColor(...C_BLACK);
  doc.roundedRect(MARGIN, TOT_Y, CW, TOT_H, 4, 4, 'F');

  const colW = CW / 3;
  const midY = TOT_Y + TOT_H / 2;

  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.3);
  doc.line(MARGIN + colW,     TOT_Y + 3, MARGIN + colW,     TOT_Y + TOT_H - 3);
  doc.line(MARGIN + colW * 2, TOT_Y + 3, MARGIN + colW * 2, TOT_Y + TOT_H - 3);

  const totCols = [
    { lbl: 'Total de Sessoes', val: String(patient.totalSessions), col: C_PRIMARY, lc: [120,100,85]  as [number,number,number] },
    { lbl: 'Total Investido',  val: fmtMoney(patient.totalSpent),  col: C_GOLD,   lc: [130,110,60]  as [number,number,number] },
    { lbl: 'Ticket Medio',     val: fmtMoney(avgTicket),           col: C_WHITE,  lc: [160,160,160] as [number,number,number] },
  ];

  totCols.forEach((t, i) => {
    const cx = MARGIN + colW * i + 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...t.lc);
    doc.text(t.lbl, cx, midY - 2.5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(i === 0 ? 12 : 10);
    doc.setTextColor(...t.col);
    doc.text(t.val, cx, midY + 4.5);
  });

  const totalPages = (doc as any).getNumberOfPages() as number;
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(...C_BLACK);
    doc.rect(0, FOOTER_Y, W, 297 - FOOTER_Y, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text('Documento confidencial - Uso interno', MARGIN, 291);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C_PRIMARY);
    doc.text('Sistema de Gestao Estetica', W / 2, 291, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Pagina ${p} de ${totalPages}`, W - MARGIN, 291, { align: 'right' });
  }

  return doc.output('arraybuffer');
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    if (!body.patient) return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });

    const buffer = await generateFichaPDF(body);
    const filename = body.patient.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="ficha-${filename}.pdf"`,
        'Cache-Control':       'no-store',
      },
    });
  } catch (error) {
    console.error('[PDF Ficha Paciente] Erro:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar PDF', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 },
    );
  }
}