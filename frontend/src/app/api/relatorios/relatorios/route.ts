import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import fs from 'fs';
import path from 'path';

interface ProcedureData {
  name: string;
  sessions: number;
  revenue: number;
  growth: number;
}

interface PieItem {
  label: string;
  value: number;
  color: string;
}

interface StatsData {
  totalRevenue: number;
  totalSessions: number;
  avgTicket: number;
  newPatients: number;
}

interface RequestBody {
  period?: string;
  stats?: StatsData;
  procedures?: ProcedureData[];
  pieData?: PieItem[];
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

const fmtCurrency = (v: number) =>
  `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

function getLogoBase64(): string | null {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logocjl.png');
    const logoData = fs.readFileSync(logoPath);
    return `data:image/png;base64,${logoData.toString('base64')}`;
  } catch {
    return null;
  }
}

async function generateRelatoriosPDF(body: RequestBody): Promise<ArrayBuffer> {
  const {
    period = 'Este mês',
    stats = {
      totalRevenue:  462540,
      totalSessions: 562,
      avgTicket:     822,
      newPatients:   42,
    },
    procedures = [
      { name: 'Botox Facial',         sessions: 142, revenue: 113600, growth: 12  },
      { name: 'Preenchimento Labial', sessions: 98,  revenue: 117600, growth: 8   },
      { name: 'Peelings Químicos',    sessions: 110, revenue: 33000,  growth: 22  },
      { name: 'Microagulhamento',     sessions: 89,  revenue: 40050,  growth: 5   },
      { name: 'Toxina Botulínica',    sessions: 67,  revenue: 40200,  growth: -3  },
      { name: 'Fio de PDO',           sessions: 56,  revenue: 100800, growth: 18  },
    ],
    pieData = [
      { label: 'Botox/Toxina',   value: 35, color: '#BBA188' },
      { label: 'Preenchimento',  value: 28, color: '#EBD5B0' },
      { label: 'Skincare',       value: 18, color: '#a8906f' },
      { label: 'Bioestimulador', value: 12, color: '#1b1b1b' },
      { label: 'Fio PDO',        value: 7,  color: '#8a7560' },
    ],
  } = body;

  const doc    = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W      = 210;
  const MARGIN = 18;
  const CW     = W - MARGIN * 2;
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
  doc.text('Relatório Gerencial', MARGIN, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 180, 180);
  doc.text('Sistema de Gestão Estética  ·  Relatório Gerencial', MARGIN, 30);

  const metaItems = [
    `Período: ${period}`,
    `Gerado em: ${now}`,
    `${procedures.length} procedimentos · ${pieData.length} categorias`,
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
    { label: 'RECEITA TOTAL',    value: fmtCurrency(stats.totalRevenue),  accent: PRIMARY },
    { label: 'TOTAL DE SESSÕES', value: String(stats.totalSessions),       accent: PAID    },
    { label: 'TICKET MÉDIO',     value: fmtCurrency(stats.avgTicket),      accent: GOLD    },
    { label: 'NOVOS PACIENTES',  value: String(stats.newPatients),         accent: BLACK   },
  ] as const;

  statItems.forEach((s, i) => {
    const cx = MARGIN + i * (statW + 3);
    doc.setFillColor(...WHITE);
    doc.roundedRect(cx, y, statW, statH, 3, 3, 'F');
    doc.setFillColor(...s.accent);
    doc.roundedRect(cx, y, 2.5, statH, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...MUTED);
    doc.text(s.label, cx + 6, y + 7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(i === 1 || i === 3 ? 14 : 8.5);
    const vc: [number, number, number] = (i === 1 || i === 3) ? DARK : s.accent as [number, number, number];
    doc.setTextColor(...vc);
    doc.text(s.value, cx + 6, y + 16);
  });

  y += statH + 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text('Distribuição por Categoria', MARGIN, y);
  y += 8;

  const pieCardH = 6 + pieData.length * 11;
  doc.setFillColor(...WHITE);
  doc.roundedRect(MARGIN, y, CW, pieCardH, 3, 3, 'F');

  pieData.forEach((d, i) => {
    const rowY   = y + 5 + i * 11;
    const barW   = CW - 60;
    const barH   = 1.2;
    const barR   = 0.6;
    const fillW  = (barW * d.value) / 100;

    const hexToRgb = (hex: string): [number, number, number] => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };
    const rgb = hexToRgb(d.color);

    doc.setFillColor(...rgb);
    doc.roundedRect(MARGIN + 4, rowY + 1.5, 4, 4, 1, 1, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...DARK);
    doc.text(d.label, MARGIN + 12, rowY + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...PRIMARY);
    doc.text(`${d.value}%`, MARGIN + 46, rowY + 4.5);

    doc.setFillColor(230, 230, 230);
    doc.roundedRect(MARGIN + 58, rowY + 2, barW, barH, barR, barR, 'F');

    doc.setFillColor(...rgb);
    if (d.value > 0) {
      doc.roundedRect(MARGIN + 58, rowY + 2, fillW, barH, barR, barR, 'F');
    }
  });

  y += pieCardH + 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text('Procedimentos Mais Realizados', MARGIN, y);
  y += 6;

  const COL_WIDTHS = [60, 25, 35, 25, 29];

  autoTable(doc, {
    startY: y,
    head: [['Procedimento', 'Sessões', 'Receita', 'Crescimento', 'Receita/Sessão']],
    body: procedures.map((p) => [
      p.name,
      String(p.sessions),
      fmtCurrency(p.revenue),
      `${p.growth >= 0 ? '↑' : '↓'} ${Math.abs(p.growth)}%`,
      fmtCurrency(Math.round(p.revenue / p.sessions)),
    ]),
    theme: 'plain',
    tableWidth: CW,
    headStyles: {
      fillColor:     BLACK,
      textColor:     WHITE,
      fontSize:      7,
      fontStyle:     'bold',
      cellPadding:   { top: 3, bottom: 3, left: 3, right: 3 },
      minCellHeight: 9,
      valign:        'middle',
    },
    bodyStyles: {
      fontSize:      7,
      cellPadding:   { top: 2.5, bottom: 2.5, left: 3, right: 3 },
      textColor:     [68, 68, 68],
      minCellHeight: 9,
      valign:        'middle',
    },
    alternateRowStyles: { fillColor: [253, 249, 245] },
    columnStyles: {
      0: { cellWidth: COL_WIDTHS[0], fontStyle: 'bold', textColor: DARK as [number, number, number] },
      1: { cellWidth: COL_WIDTHS[1], halign: 'center' },
      2: { cellWidth: COL_WIDTHS[2], fontStyle: 'bold' },
      3: { cellWidth: COL_WIDTHS[3], halign: 'center' },
      4: { cellWidth: COL_WIDTHS[4] },
    },
    margin: { left: MARGIN, right: MARGIN },
    didDrawCell: (data) => {
      if (data.section !== 'body') return;

      const rowData   = procedures[data.row.index];
      if (!rowData) return;

      const rowCenter = data.cell.y + data.cell.height / 2;
      const badgeH    = 5.5;

      if (data.column.index === 3) {
        const isPos  = rowData.growth >= 0;
        const bw     = data.cell.width - 3;
        const bx     = data.cell.x + 1.5;
        const by     = rowCenter - badgeH / 2;
        const textY  = rowCenter + 0.7;

        doc.setFillColor(...(isPos ? PAID_BG : ([255, 220, 220] as [number, number, number])));
        doc.roundedRect(bx, by, bw, badgeH, 1.5, 1.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(...(isPos ? PAID : ([200, 60, 60] as [number, number, number])));
        doc.text(
          `${rowData.growth >= 0 ? '↑' : '↓'} ${Math.abs(rowData.growth)}%`,
          bx + bw / 2,
          textY,
          { align: 'center' },
        );
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

  const totalRevenue = procedures.reduce((a, p) => a + p.revenue, 0);
  const totalSessions = procedures.reduce((a, p) => a + p.sessions, 0);

  const totCols = [
    { label: 'Total de Sessões',  value: String(totalSessions),        color: PRIMARY, labelColor: [120, 100, 85]  as [number,number,number] },
    { label: 'Receita Gerada',    value: fmtCurrency(totalRevenue),    color: GOLD,    labelColor: [130, 110, 60]  as [number,number,number] },
    { label: 'Ticket Médio',      value: fmtCurrency(Math.round(totalRevenue / totalSessions)), color: WHITE, labelColor: [160, 160, 160] as [number,number,number] },
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
    const buffer = await generateRelatoriosPDF(body);
    const period = (body.period ?? 'relatorio').replace(/\s/g, '-').toLowerCase();

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-gerencial-${period}.pdf"`,
        'Cache-Control':       'no-store',
      },
    });
  } catch (error) {
    console.error('[PDF Relatórios] Erro:', error);
    return NextResponse.json(
      {
        error:   'Falha ao gerar PDF',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(new NextRequest(request.url, {
    method: 'POST',
    body:   JSON.stringify({}),
  }));
}