import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import fs from 'fs';
import path from 'path';

interface ProfessionalData {
  id: number;
  name: string;
  role: string;
  avatar: string;
  sessoes: number;
  receita: number;
  comissao: number;
  percentual: number;
  meta: number;
}

interface ComissaoData {
  id: number;
  date: string;
  professional: string;
  procedure: string;
  patient: string;
  value: number;
  percentual: number;
  comissao: number;
  status: string;
}

interface RequestBody {
  professionals: ProfessionalData[];
  comissoes: ComissaoData[];
  month?: string;
  filterProf?: string;
}

const PRIMARY:    [number, number, number] = [187, 161, 136];
const BLACK:      [number, number, number] = [27,  27,  27 ];
const DARK:       [number, number, number] = [26,  26,  26 ];
const MUTED:      [number, number, number] = [136, 136, 136];
const LIGHT_BG:   [number, number, number] = [245, 245, 245];
const WHITE:      [number, number, number] = [255, 255, 255];
const GOLD:       [number, number, number] = [212, 168, 75 ];
const GOLD_BG:    [number, number, number] = [255, 243, 205];
const PAID:       [number, number, number] = [138, 117, 96 ];
const PAID_BG:    [number, number, number] = [240, 235, 228];
const PRIMARY_BG: [number, number, number] = [248, 244, 240];

const fmt = (v: number) =>
  `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function getBarColor(comissao: number, meta: number): [number, number, number] {
  const pct = (comissao / meta) * 100;
  if (pct < 50) return [240, 150, 150];
  if (pct < 75) return [240, 195, 140];
  return [150, 210, 160];
}

function getLogoBase64(): string | null {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logocjl.png');
    const logoData = fs.readFileSync(logoPath);
    return `data:image/png;base64,${logoData.toString('base64')}`;
  } catch {
    return null;
  }
}

async function generateComissoesPDF(body: RequestBody): Promise<ArrayBuffer> {
  const { professionals, comissoes, month = 'Fevereiro 2025' } = body;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W      = 210;
  const MARGIN = 18;
  const CW     = W - MARGIN * 2;
  const FOOTER_Y = 285;

  const now = new Date().toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const totalComissoes = comissoes.reduce((a, c) => a + c.comissao, 0);
  const totalPago      = comissoes.filter((c) => c.status === 'pago').reduce((a, c) => a + c.comissao, 0);
  const totalPendente  = comissoes.filter((c) => c.status === 'pendente').reduce((a, c) => a + c.comissao, 0);

  doc.setFillColor(...BLACK);
  doc.rect(0, 0, W, 52, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...PRIMARY);
  doc.text('Relatório de Comissões', MARGIN, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 180, 180);
  doc.text('Sistema de Gestão Estética  ·  Relatório Gerencial', MARGIN, 30);

  const metaItems = [
    `Período: ${month}`,
    `Gerado em: ${now}`,
    `${comissoes.length} transações · ${professionals.length} profissionais`,
  ];
  metaItems.forEach((item, i) => {
    const x = MARGIN + i * 62;
    doc.setFillColor(...PRIMARY);
    doc.circle(x, 40, 1.2, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(170, 170, 170);
    doc.text(item, x + 3.5, 40.8);
  });

  const logoBase64 = getLogoBase64();
  if (logoBase64) {
    const logoH = 40;
    const logoW = 80;
    const logoX = W - MARGIN - logoW + 35;
    const logoY = 52 / 2 - logoH / 2 - 10;
    doc.addImage(logoBase64, 'PNG', logoX, logoY, logoW, logoH);
  }

  let y = 62;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text('Resumo Executivo', MARGIN, y);
  y += 8;

  const statW = (CW - 9) / 4;
  const statH = 22;
  const statItems = [
    { label: 'TOTAL DE COMISSÕES', value: fmt(totalComissoes), accent: PRIMARY },
    { label: 'PAGAS',              value: fmt(totalPago),      accent: PAID    },
    { label: 'PENDENTES',          value: fmt(totalPendente),  accent: GOLD    },
    { label: 'PROFISSIONAIS',      value: String(professionals.length), accent: BLACK },
  ] as const;

  statItems.forEach((s, i) => {
    const cx = MARGIN + i * (statW + 3);
    doc.setFillColor(...WHITE);
    doc.roundedRect(cx, y, statW, statH, 3, 3, 'F');
    // Thinner accent line: width reduced from 2.5 to 1.2
    doc.setFillColor(...s.accent);
    doc.roundedRect(cx, y, 1.2, statH, 0.6, 0.6, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...MUTED);
    doc.text(s.label, cx + 4.5, y + 7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(i === 3 ? 14 : 8.5);
    const vc: [number, number, number] = i === 3 ? DARK : s.accent as [number, number, number];
    doc.setTextColor(...vc);
    doc.text(s.value, cx + 4.5, y + 16);
  });

  y += statH + 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text('Desempenho por Profissional', MARGIN, y);
  y += 8;

  const profW  = (CW - (professionals.length - 1) * 5) / professionals.length;
  const profH  = 52;
  const avSize = 18;

  professionals.forEach((prof, i) => {
    const px       = MARGIN + i * (profW + 5);
    const progress = Math.min(100, (prof.comissao / prof.meta) * 100);
    const isDark   = i === 2;

    doc.setFillColor(...WHITE);
    doc.roundedRect(px, y, profW, profH, 3, 3, 'F');

    const avX = px + 4;
    const avY = y + 4;
    doc.setFillColor(...(isDark ? ([40, 40, 40] as [number, number, number]) : PRIMARY_BG));
    doc.roundedRect(avX, avY, avSize, avSize, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...(isDark ? ([200, 200, 200] as [number, number, number]) : PRIMARY));
    doc.text(
      prof.avatar,
      avX + avSize / 2,
      avY + avSize / 2 + 1.7,
      { align: 'center' }
    );

    const txtX = avX + avSize + 3;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...DARK);
    doc.text(prof.name, txtX, y + 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...MUTED);
    doc.text(prof.role, txtX, y + 17);

    const msY = y + 24;
    const msW = (profW - 10) / 3;
    const msH = 13;
    [
      { label: 'Sessões',                  val: String(prof.sessoes),                       hl: false },
      { label: 'Receita',                  val: `R$ ${(prof.receita  / 1000).toFixed(1)}k`, hl: false },
      { label: `Com. ${prof.percentual}%`, val: `R$ ${(prof.comissao / 1000).toFixed(1)}k`, hl: true  },
    ].forEach((ms, j) => {
      const sx = px + 4 + j * (msW + 1);
      doc.setFillColor(...LIGHT_BG);
      doc.roundedRect(sx, msY, msW, msH, 2, 2, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.5);
      doc.setTextColor(...MUTED);
      doc.text(ms.label, sx + 2.5, msY + 5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(ms.hl ? 7 : 6.5);
      doc.setTextColor(...(ms.hl ? PRIMARY : DARK));
      doc.text(ms.val, sx + 2.5, msY + 11);
    });

    const barY   = y + 43;
    const barW   = profW - 8;
    const barH   = 1.2;
    const barR   = 0.6;
    const barColor = getBarColor(prof.comissao, prof.meta);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(...MUTED);
    doc.text('Meta mensal', px + 4, barY - 2);
    doc.text(`${Math.round(progress)}%`, px + profW - 4, barY - 2, { align: 'right' });

    doc.setFillColor(230, 230, 230);
    doc.roundedRect(px + 4, barY, barW, barH, barR, barR, 'F');
    doc.setFillColor(...barColor);
    if (progress > 0) {
      doc.roundedRect(px + 4, barY, (barW * progress) / 100, barH, barR, barR, 'F');
    }
  });

  y += profH + 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text('Detalhamento de Comissões', MARGIN, y);
  y += 6;

  const COL_WIDTHS = [20, 28, 30, 22, 22, 10, 22, 20];

  autoTable(doc, {
    startY: y,
    head: [['Data', 'Profissional', 'Procedimento', 'Paciente', 'Valor Proc.', '%', 'Comissão', 'Status']],
    body: comissoes.map((c) => [
      c.date,
      c.professional,
      c.procedure,
      c.patient,
      fmt(c.value),
      `${c.percentual}%`,
      fmt(c.comissao),
      c.status === 'pago' ? 'Pago' : 'Pendente',
    ]),
    theme: 'plain',
    tableWidth: CW,
    headStyles: {
      fillColor: BLACK,
      textColor: WHITE,
      fontSize: 7,
      fontStyle: 'bold',
      cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
      minCellHeight: 9,
      valign: 'middle',
    },
    bodyStyles: {
      fontSize: 7,
      cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 },
      textColor: [68, 68, 68],
      minCellHeight: 9,
      valign: 'middle',
    },
    alternateRowStyles: { fillColor: [253, 249, 245] },
    columnStyles: {
      0: { cellWidth: COL_WIDTHS[0], textColor: MUTED as [number, number, number] },
      1: { cellWidth: COL_WIDTHS[1], fontStyle: 'bold', textColor: DARK as [number, number, number] },
      2: { cellWidth: COL_WIDTHS[2] },
      3: { cellWidth: COL_WIDTHS[3], textColor: MUTED as [number, number, number] },
      4: { cellWidth: COL_WIDTHS[4], fontStyle: 'bold' },
      5: { cellWidth: COL_WIDTHS[5] },
      6: { cellWidth: COL_WIDTHS[6], fontStyle: 'bold' },
      7: { cellWidth: COL_WIDTHS[7] },
    },
    margin: { left: MARGIN, right: MARGIN },
    didDrawCell: (data) => {
      if (data.section !== 'body') return;

      const rowData = comissoes[data.row.index];
      if (!rowData) return;

      const rowCenter = data.cell.y + data.cell.height / 2;
      const badgeH    = 5.5;

      if (data.column.index === 5) {
        const bw    = data.cell.width - 2;
        const bx    = data.cell.x + 1;
        const by    = rowCenter - badgeH / 2;
        const textY = rowCenter + 0.7;

        doc.setFillColor(...PAID_BG);
        doc.roundedRect(bx, by, bw, badgeH, 1.5, 1.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(...PRIMARY);
        doc.text(`${rowData.percentual}%`, bx + bw / 2, textY, { align: 'center' });
      }

      if (data.column.index === 6) {
        const profData = professionals.find(p => p.name === rowData.professional);
        const comColor = profData ? getBarColor(profData.comissao, profData.meta) : PRIMARY;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...comColor);
        doc.text(
          fmt(rowData.comissao),
          data.cell.x + 3,
          rowCenter + 0.7,
        );
      }

      if (data.column.index === 7) {
        const isPago = rowData.status === 'pago';
        const bw    = data.cell.width - 3;
        const bx    = data.cell.x + 1.5;
        const by    = rowCenter - badgeH / 2;
        const textY = rowCenter + 0.7;

        doc.setFillColor(...(isPago ? PAID_BG : GOLD_BG));
        doc.roundedRect(bx, by, bw, badgeH, 1.5, 1.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(...(isPago ? PAID : GOLD));
        doc.text(isPago ? 'Pago' : 'Pendente', bx + bw / 2, textY, { align: 'center' });
      }
    },
  });

  const totH = 18;
  const totalPages = (doc as any).getNumberOfPages() as number;
  doc.setPage(totalPages);
  const TOT_Y = FOOTER_Y - totH - 3;

  doc.setFillColor(...BLACK);
  doc.roundedRect(MARGIN, TOT_Y, CW, totH, 4, 4, 'F');

  const colW = CW / 3;
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.3);
  doc.line(MARGIN + colW,     TOT_Y + 3, MARGIN + colW,     TOT_Y + totH - 3);
  doc.line(MARGIN + colW * 2, TOT_Y + 3, MARGIN + colW * 2, TOT_Y + totH - 3);

  const midY    = TOT_Y + totH / 2;
  const leftPad = 8;

  const totCols = [
    { label: 'Comissões Pagas', value: fmt(totalPago),      color: PRIMARY, labelColor: [120, 100, 85]  as [number,number,number] },
    { label: 'Pendentes',       value: fmt(totalPendente),  color: GOLD,    labelColor: [130, 110, 60]  as [number,number,number] },
    { label: 'Total Geral',     value: fmt(totalComissoes), color: WHITE,   labelColor: [160, 160, 160] as [number,number,number] },
  ];

  totCols.forEach((t, i) => {
    const colX = MARGIN + colW * i + leftPad;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...t.labelColor);
    doc.text(t.label, colX, midY - 2.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(i === 0 ? 12 : 10);
    doc.setTextColor(...t.color);
    doc.text(t.value, colX, midY + 4.5);
  });

  const allPages = (doc as any).getNumberOfPages();
  for (let p = 1; p <= allPages; p++) {
    doc.setPage(p);
    doc.setFillColor(...BLACK);
    doc.rect(0, 285, W, 15, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text('Relatório gerado automaticamente · Confidencial', MARGIN, 291);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PRIMARY);
    doc.text('Sistema de Gestão Estética', W / 2, 291, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Página ${p} de ${allPages}`, W - MARGIN, 291, { align: 'right' });
  }

  return doc.output('arraybuffer');
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();

    if (!body.comissoes || !body.professionals) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const buffer = await generateComissoesPDF(body);
    const month  = (body.month ?? 'fevereiro-2025').replace(/\s/g, '-').toLowerCase();

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-comissoes-${month}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[PDF Comissões] Erro:', error);
    return NextResponse.json(
      {
        error: 'Falha ao gerar PDF',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month') ?? 'Fevereiro 2025';

  const defaultBody: RequestBody = {
    month,
    professionals: [
      { id: 1, name: 'Maria Oliveira', role: 'Esteticista Sênior', avatar: 'MO', sessoes: 12, receita: 14400, comissao: 2880,  percentual: 20, meta: 12000 },
      { id: 2, name: 'Clara Andrade',  role: 'Biomédica Esteta',   avatar: 'CA', sessoes: 26, receita: 31200, comissao: 5200,  percentual: 20, meta: 8000  },
      { id: 3, name: 'Beatriz Santos', role: 'Esteticista',        avatar: 'BS', sessoes: 21, receita: 24500, comissao: 6125,  percentual: 25, meta: 6000  },
    ],
    comissoes: [
      { id: 1, date: '18/02/2025', professional: 'Maria Oliveira', procedure: 'Botox Facial',        patient: 'Ana Costa',   value: 720,  percentual: 20, comissao: 144,  status: 'pago'     },
      { id: 2, date: '18/02/2025', professional: 'Clara Andrade',  procedure: 'Preenchimento Labial', patient: 'Carla M.',    value: 1200, percentual: 20, comissao: 240,  status: 'pendente' },
      { id: 3, date: '16/02/2025', professional: 'Beatriz Santos', procedure: 'Bioestimulador',       patient: 'Fernanda L.', value: 2500, percentual: 25, comissao: 625,  status: 'pago'     },
      { id: 4, date: '14/02/2025', professional: 'Maria Oliveira', procedure: 'Microagulhamento',     patient: 'Patrícia A.', value: 450,  percentual: 20, comissao: 90,   status: 'pago'     },
      { id: 5, date: '13/02/2025', professional: 'Clara Andrade',  procedure: 'Fio PDO',              patient: 'Marina S.',   value: 1800, percentual: 20, comissao: 360,  status: 'pendente' },
      { id: 6, date: '10/02/2025', professional: 'Beatriz Santos', procedure: 'Toxina Botulínica',    patient: 'Juliana R.',  value: 600,  percentual: 25, comissao: 150,  status: 'pago'     },
    ],
  };

  return POST(new NextRequest(request.url, { method: 'POST', body: JSON.stringify(defaultBody) }));
}