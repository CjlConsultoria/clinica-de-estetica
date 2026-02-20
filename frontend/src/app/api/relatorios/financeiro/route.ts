import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import fs from 'fs';
import path from 'path';

interface FinanceItem {
  id: number;
  date: string;
  description: string;
  type: 'receita' | 'despesa';
  category: string;
  value: number;
  patient: string | null;
}

interface MonthlyData {
  month: string;
  receita: number;
  despesa: number;
}

interface RequestBody {
  transactions: FinanceItem[];
  monthlyData: MonthlyData[];
  month?: string;
  totalReceita: number;
  totalDespesa: number;
  saldo: number;
}

const PRIMARY:  [number, number, number] = [187, 161, 136];
const BLACK:    [number, number, number] = [27,  27,  27 ];
const DARK:     [number, number, number] = [26,  26,  26 ];
const MUTED:    [number, number, number] = [136, 136, 136];
const WHITE:    [number, number, number] = [255, 255, 255];
const RED:      [number, number, number] = [231, 76,  60 ];
const RED_BG:   [number, number, number] = [255, 235, 232];
const PAID:     [number, number, number] = [138, 117, 96 ];
const PAID_BG:  [number, number, number] = [240, 235, 228];
const CREAM:    [number, number, number] = [253, 249, 245];

const fmt = (v: number) =>
  `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function safe(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getLogoBase64(): string | null {
  try {
    const d = fs.readFileSync(path.join(process.cwd(), 'public', 'logocjl.png'));
    return 'data:image/png;base64,' + d.toString('base64');
  } catch { return null; }
}

function drawRoundedTopBar(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  color: [number, number, number],
) {
  if (h <= 0) return;
  const r = w / 2; 

  doc.setFillColor(...color);

  doc.circle(x + r, y + r, r, 'F');

  if (h > r) {
    doc.rect(x, y + r, w, h - r, 'F');
  }
}

async function generateFinanceiroPDF(body: RequestBody): Promise<ArrayBuffer> {
  const { transactions, monthlyData, month = 'Fevereiro 2025', totalReceita, totalDespesa, saldo } = body;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W       = 210;
  const MARGIN  = 18;
  const CW      = W - MARGIN * 2;
  const FOOTER_Y = 285;

  const now = new Date().toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  doc.setFillColor(...BLACK);
  doc.rect(0, 0, W, 52, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...PRIMARY);
  doc.text('Relatorio Financeiro', MARGIN, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 180, 180);
  doc.text('Sistema de Gestao Estetica  -  Relatorio Gerencial', MARGIN, 30);

  const metaItems = [
    `Periodo: ${safe(month)}`,
    `Gerado em: ${now}`,
    `${transactions.length} transacoes`,
  ];
  metaItems.forEach((item, i) => {
    const x = MARGIN + i * 62;
    doc.setFillColor(...PRIMARY);
    doc.circle(x, 40, 1.2, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(170, 170, 170);
    doc.text(item, x + 3.5, 40.8);
  });

  const logo = getLogoBase64();
  if (logo) doc.addImage(logo, 'PNG', W - MARGIN - 45, -4, 80, 40);

  let y = 62;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text('Resumo Executivo', MARGIN, y);
  y += 8;

  const statW = (CW - 9) / 4;
  const statH = 22;

  const saldoColor: [number, number, number] = saldo >= 0 ? PAID : RED;

  const statItems = [
    { label: 'RECEITA DO MES',  value: fmt(totalReceita), accent: PRIMARY },
    { label: 'DESPESAS DO MES', value: fmt(totalDespesa), accent: RED     },
    { label: 'SALDO DO MES',    value: fmt(saldo),        accent: saldoColor },
    { label: 'TRANSACOES',      value: String(transactions.length), accent: BLACK },
  ] as const;

  statItems.forEach((s, i) => {
    const cx = MARGIN + i * (statW + 3);
    doc.setFillColor(...WHITE);
    doc.roundedRect(cx, y, statW, statH, 3, 3, 'F');
    doc.setFillColor(...s.accent);
    doc.roundedRect(cx, y, 1.2, statH, 0.6, 0.6, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...MUTED);
    doc.text(s.label, cx + 4.5, y + 7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(i === 3 ? 14 : 8.5);
    doc.setTextColor(...(s.accent as [number, number, number]));
    doc.text(s.value, cx + 4.5, y + 16);
  });

  y += statH + 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text('Receitas vs Despesas - Ultimos 6 Meses', MARGIN, y);
  y += 8;

  const chartH   = 50;
  doc.setFillColor(...WHITE);
  doc.roundedRect(MARGIN, y, CW, chartH + 16, 3, 3, 'F');

  const maxVal   = Math.max(...monthlyData.map(d => Math.max(d.receita, d.despesa)));
  const barAreaH = chartH;
  const barW     = 8;
  const gap      = (CW - monthlyData.length * (barW * 2 + 4)) / (monthlyData.length + 1);

  monthlyData.forEach((d, i) => {
    const baseX = MARGIN + gap + i * (barW * 2 + 4 + gap);
    const baseY = y + barAreaH;

    const recH = maxVal > 0 ? (d.receita / maxVal) * (barAreaH - 10) : 0;
    const desH = maxVal > 0 ? (d.despesa / maxVal) * (barAreaH - 10) : 0;

    drawRoundedTopBar(doc, baseX, baseY - recH, barW, recH, PRIMARY);

    drawRoundedTopBar(doc, baseX + barW + 2, baseY - desH, barW, desH, RED);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    doc.text(d.month, baseX + barW / 2 + 1, baseY + 6, { align: 'center' });
  });

  const legendY = y + chartH + 14;
  const sqSize  = 3.5;
  [{ label: 'Receita', color: PRIMARY }, { label: 'Despesa', color: RED }].forEach((l, i) => {
    const lx = MARGIN + 4 + i * 28;
    doc.setFillColor(...l.color);
    doc.roundedRect(lx, legendY - sqSize + 0.5, sqSize, sqSize, 0.8, 0.8, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    doc.text(l.label, lx + sqSize + 2, legendY);
  });

  y += chartH + 30;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text('Detalhamento de Transacoes', MARGIN, y);
  y += 6;

  const COL_WIDTHS = [20, 55, 28, 18, 30, 23];

  autoTable(doc, {
    startY: y,
    head: [['Data', 'Descricao', 'Categoria', 'Tipo', 'Valor', 'Paciente']],
    body: transactions.map(t => [
      t.date,
      safe(t.description),
      safe(t.category),
      '',
      '',
      t.patient ? safe(t.patient) : '—',
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
    alternateRowStyles: { fillColor: CREAM },
    columnStyles: {
      0: { cellWidth: COL_WIDTHS[0], textColor: MUTED as [number, number, number] },
      1: { cellWidth: COL_WIDTHS[1], fontStyle: 'bold', textColor: DARK as [number, number, number] },
      2: { cellWidth: COL_WIDTHS[2] },
      3: { cellWidth: COL_WIDTHS[3] },
      4: { cellWidth: COL_WIDTHS[4] },
      5: { cellWidth: COL_WIDTHS[5], textColor: MUTED as [number, number, number] },
    },
    margin: { left: MARGIN, right: MARGIN },
    didDrawCell: (data) => {
      if (data.section !== 'body') return;
      const rowData = transactions[data.row.index];
      if (!rowData) return;

      const rowCenter = data.cell.y + data.cell.height / 2;
      const badgeH    = 5.5;

      if (data.column.index === 3) {
        const isReceita = rowData.type === 'receita';
        const bw    = data.cell.width - 4;
        const bx    = data.cell.x + 2;
        const by    = rowCenter - badgeH / 2;
        const textY = rowCenter + 0.8;

        doc.setFillColor(...(isReceita ? PAID_BG : RED_BG));
        doc.roundedRect(bx, by, bw, badgeH, 1.5, 1.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(...(isReceita ? PAID : RED));
        doc.text(
          isReceita ? 'Receita' : 'Despesa',
          bx + bw / 2,
          textY,
          { align: 'center' },
        );
      }

      if (data.column.index === 4) {
        const isReceita = rowData.type === 'receita';
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...(isReceita ? PRIMARY : RED));
        const label = (isReceita ? '+ ' : '- ') + fmt(rowData.value);
        doc.text(label, data.cell.x + 3, rowCenter + 0.8);
      }
    },
  });

  const totH       = 18;
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

  const midY = TOT_Y + totH / 2;

  const totCols = [
    { label: 'Receita do Mes',   value: fmt(totalReceita), color: PRIMARY,     labelColor: [120, 100, 85]  as [number, number, number] },
    { label: 'Despesas do Mes',  value: fmt(totalDespesa), color: RED,         labelColor: [180, 80,  70]  as [number, number, number] },
    { label: 'Saldo do Mes',     value: fmt(saldo),        color: saldo >= 0 ? (PAID as [number,number,number]) : (RED as [number,number,number]), labelColor: [160, 160, 160] as [number, number, number] },
  ];

  totCols.forEach((t, i) => {
    const cx = MARGIN + colW * i + 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...t.labelColor);
    doc.text(t.label, cx, midY - 2.5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(i === 2 ? 12 : 10);
    doc.setTextColor(...t.color);
    doc.text(t.value, cx, midY + 4.5);
  });

  const allPages = (doc as any).getNumberOfPages();
  for (let p = 1; p <= allPages; p++) {
    doc.setPage(p);
    doc.setFillColor(...BLACK);
    doc.rect(0, 285, W, 15, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text('Relatorio gerado automaticamente - Confidencial', MARGIN, 291);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PRIMARY);
    doc.text('Sistema de Gestao Estetica', W / 2, 291, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Pagina ${p} de ${allPages}`, W - MARGIN, 291, { align: 'right' });
  }

  return doc.output('arraybuffer');
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();

    if (!body.transactions) {
      return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
    }

    const buffer = await generateFinanceiroPDF(body);
    const month  = (body.month ?? 'fevereiro-2025').replace(/\s/g, '-').toLowerCase();

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-financeiro-${month}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[PDF Financeiro] Erro:', error);
    return NextResponse.json(
      {
        error: 'Falha ao gerar PDF',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month') ?? 'Fevereiro 2025';

  const mockFinance: FinanceItem[] = [
    { id: 1,  date: '18/02/2025', description: 'Botox Facial - Ana Costa',            type: 'receita', category: 'Procedimento', value: 800,  patient: 'Ana Costa'      },
    { id: 2,  date: '18/02/2025', description: 'Preenchimento Labial - Carla M.',     type: 'receita', category: 'Procedimento', value: 1200, patient: 'Carla Mendonça'  },
    { id: 3,  date: '17/02/2025', description: 'Reposição de Insumos ANVISA',         type: 'despesa', category: 'Insumo',       value: 2340, patient: null              },
    { id: 4,  date: '16/02/2025', description: 'Bioestimulador - Fernanda Lima',      type: 'receita', category: 'Procedimento', value: 2500, patient: 'Fernanda Lima'   },
    { id: 5,  date: '15/02/2025', description: 'Aluguel do Espaço',                  type: 'despesa', category: 'Aluguel',      value: 3500, patient: null              },
    { id: 6,  date: '14/02/2025', description: 'Fio PDO - Marina Souza',             type: 'receita', category: 'Procedimento', value: 1800, patient: 'Marina Souza'    },
    { id: 7,  date: '13/02/2025', description: 'Comissão Profissional - Fevereiro',   type: 'despesa', category: 'Comissão',     value: 1280, patient: null              },
    { id: 8,  date: '12/02/2025', description: 'Microagulhamento - Patrícia A.',      type: 'receita', category: 'Procedimento', value: 450,  patient: 'Patrícia Alves'  },
    { id: 9,  date: '10/02/2025', description: 'Toxina Botulínica - Juliana R.',      type: 'receita', category: 'Procedimento', value: 600,  patient: 'Juliana Rocha'   },
    { id: 10, date: '08/02/2025', description: 'Material de Escritório',              type: 'despesa', category: 'Outros',       value: 180,  patient: null              },
  ];

  const monthlyData: MonthlyData[] = [
    { month: 'Set', receita: 32000, despesa: 12000 },
    { month: 'Out', receita: 35000, despesa: 14000 },
    { month: 'Nov', receita: 28000, despesa: 11000 },
    { month: 'Dez', receita: 42000, despesa: 15000 },
    { month: 'Jan', receita: 38000, despesa: 13500 },
    { month: 'Fev', receita: 38450, despesa: 14300 },
  ];

  const totalReceita = mockFinance.filter(f => f.type === 'receita').reduce((a, f) => a + f.value, 0);
  const totalDespesa = mockFinance.filter(f => f.type === 'despesa').reduce((a, f) => a + f.value, 0);

  const defaultBody: RequestBody = {
    month,
    transactions: mockFinance,
    monthlyData,
    totalReceita,
    totalDespesa,
    saldo: totalReceita - totalDespesa,
  };

  return POST(new NextRequest(request.url, { method: 'POST', body: JSON.stringify(defaultBody) }));
}