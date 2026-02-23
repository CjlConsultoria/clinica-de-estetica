import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

interface BoletoBody {
  empresaId:      string;
  empresaNome:    string;
  plano:          string;
  valor:          number;
  competencia:    string;
  vencimento:     string;
  linhaDigitavel: string;
}

// ─── Paleta (mesma dos outros PDFs do projeto) ─────────────────────────────────
const PRIMARY:  [number, number, number] = [187, 161, 136];
const BLACK:    [number, number, number] = [27,  27,  27 ];
const DARK:     [number, number, number] = [26,  26,  26 ];
const MUTED:    [number, number, number] = [136, 136, 136];
const WHITE:    [number, number, number] = [255, 255, 255];
const GOLD:     [number, number, number] = [146, 103, 10 ];
const GOLD_BG:  [number, number, number] = [254, 252, 232];
const LIGHT:    [number, number, number] = [248, 244, 240];

const fmtValor = (v: number) =>
  `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ── Idêntico à API de comissões ───────────────────────────────────────────────
function getLogoBase64(): string | null {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logocjl.png');
    const logoData = fs.readFileSync(logoPath);
    return `data:image/png;base64,${logoData.toString('base64')}`;
  } catch {
    return null;
  }
}

// Trunca texto para não passar da largura máxima disponível
function truncateText(doc: jsPDF, text: string, maxWidth: number): string {
  const width = doc.getTextWidth(text);
  if (width <= maxWidth) return text;
  let truncated = text;
  while (doc.getTextWidth(truncated + '...') > maxWidth && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '...';
}

// Gera barras do código de barras — largura total sempre = w, nunca ultrapassa
function drawBarcode(doc: jsPDF, x: number, y: number, w: number, h: number, code: string) {
  const digits = code.replace(/\D/g, '').padEnd(44, '0').slice(0, 44);

  // Calcula quantas "unidades" de largura o padrão inteiro precisa
  // Início: 3 barras (barra + espaço cada) = 6 unidades
  // Dados: cada dígito = barra (1+n%3) + espaço (2+n%2) — média ~3 unidades
  // Fim: barra(2) + espaço(3) + barra(1) = 6 unidades
  // Usamos unidade fixa: totalUnits = 6 + sum(dados) + 6
  let totalUnits = 6; // início
  for (const ch of digits) {
    const n = parseInt(ch);
    totalUnits += (1 + (n % 3)) + (2 + (n % 2));
  }
  totalUnits += 6; // fim

  const unit = w / totalUnits; // 1 unidade em mm — escala para caber exatamente em w
  let cx = x;

  // Padrão de início: 3× (barra 1u + espaço 1u)
  for (let i = 0; i < 3; i++) {
    doc.setFillColor(...BLACK);
    doc.rect(cx, y, unit, h, 'F');
    cx += unit * 2;
  }

  // Dados
  for (const ch of digits) {
    const n = parseInt(ch);
    const barW = unit * (1 + (n % 3));
    const spW  = unit * (2 + (n % 2));
    doc.setFillColor(...BLACK);
    doc.rect(cx, y, barW, h, 'F');
    cx += barW + spW;
  }

  // Padrão de fim: barra(2u) + espaço(3u) + barra(1u)
  doc.setFillColor(...BLACK);
  doc.rect(cx, y, unit * 2, h, 'F');
  cx += unit * 5;
  doc.rect(cx, y, unit, h, 'F');
}

async function generateBoletoPDF(body: BoletoBody): Promise<ArrayBuffer> {
  const { empresaNome, plano, valor, competencia, vencimento, linhaDigitavel } = body;
  const doc    = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W      = 210;
  const MARGIN = 18;   // igual à API de comissões
  const CW     = W - MARGIN * 2;

  const now = new Date().toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  const nossoNumero = `${Date.now().toString().slice(-10)}`;
  const codigoBanco = '001-9';

  // ── Cabeçalho escuro — idêntico ao de comissões ────────────────────────────
  doc.setFillColor(...BLACK);
  doc.rect(0, 0, W, 52, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...PRIMARY);
  doc.text('Boleto Bancário', MARGIN, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 180, 180);
  doc.text('Sistema de Gestão Estética  ·  Cobrança de Assinatura', MARGIN, 30);

  // Meta items — mesmo padrão da API de comissões
  const metaItems = [
    `Emissão: ${now}`,
    `Ref: ${competencia}`,
    `Nosso Nº: ${nossoNumero}`,
  ];
  metaItems.forEach((item, i) => {
    const x = MARGIN + i * 62;
    doc.setFillColor(...PRIMARY);
    doc.circle(x, 40, 1.2, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(170, 170, 170);
    doc.text(item, x + 3.5, 40.8);
  });

  // ── Logo — posição/tamanho IDÊNTICOS à API de comissões ───────────────────
  const logoBase64 = getLogoBase64();
  if (logoBase64) {
    const logoH = 40;
    const logoW = 80;
    const logoX = W - MARGIN - logoW + 35;
    const logoY = 52 / 2 - logoH / 2 - 10;
    doc.addImage(logoBase64, 'PNG', logoX, logoY, logoW, logoH);
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...PRIMARY);
    doc.text('CJL SYSTEM', W - MARGIN, 24, { align: 'right' });
  }

  let y = 62;   // igual à API de comissões

  // ── Função auxiliar para campos do boleto ──────────────────────────────────
  // maxValueWidth: largura máxima disponível para o valor (fw - 4 de padding)
  function field(label: string, value: string, fx: number, fy: number, fw: number, fh: number = 14) {
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.rect(fx, fy, fw, fh, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...MUTED);
    doc.text(label, fx + 2, fy + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...DARK);
    // Trunca o valor se necessário para não sair da célula
    const maxW = fw - 4;
    doc.text(truncateText(doc, value, maxW), fx + 2, fy + 11.5);
  }

  // ── Linha do banco ─────────────────────────────────────────────────────────
  doc.setFillColor(...WHITE);
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.rect(MARGIN, y, CW, 10, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.text(`BANCO DO BRASIL S.A.    ${codigoBanco}`, MARGIN + 3, y + 7);

  // Linha digitável à direita — truncada para não sair
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...DARK);
  const ldMaxW = CW - doc.getTextWidth(`BANCO DO BRASIL S.A.    ${codigoBanco}`) - 10;
  doc.text(truncateText(doc, linhaDigitavel, ldMaxW), W - MARGIN - 3, y + 7, { align: 'right' });

  y += 14;

  // ── Linha 1: Beneficiário | Agência/Código ─────────────────────────────────
  const col1W = CW * 0.72;
  const col2W = CW - col1W;
  field('Beneficiário', 'Sistema de Gestão Estética LTDA', MARGIN, y, col1W);
  field('Agência/Código Beneficiário', '1234-5 / 67890-1', MARGIN + col1W, y, col2W);
  y += 14;

  // ── Linha 2: CNPJ | Nosso Número | Espécie ──────────────────────────────────
  const c3 = CW / 3;
  field('CNPJ', '12.345.678/0001-90', MARGIN, y, c3);
  field('Nosso Número', nossoNumero, MARGIN + c3, y, c3);
  field('Espécie', 'R$ (Real)', MARGIN + c3 * 2, y, c3);
  y += 14;

  // ── Linha 3: Sacado (empresa pagadora) ────────────────────────────────────
  field('Pagador (Sacado)', empresaNome, MARGIN, y, CW);
  y += 14;

  // ── Linha 4: Plano | Competência | Vencimento | Valor ─────────────────────
  const cW4 = CW / 4;
  field('Plano',                  plano,            MARGIN,              y, cW4);
  field('Referência',             competencia,      MARGIN + cW4,        y, cW4);
  field('Vencimento',             vencimento,       MARGIN + cW4 * 2,    y, cW4);
  field('(=) Valor do Documento', fmtValor(valor),  MARGIN + cW4 * 3,    y, cW4);
  y += 14;

  // ── Instruções ─────────────────────────────────────────────────────────────
  doc.setFillColor(...LIGHT);
  doc.setDrawColor(220, 220, 220);
  doc.rect(MARGIN, y, CW, 30, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text('Instruções ao Caixa', MARGIN + 2, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...DARK);

  const instrucoes = [
    '• Não receber após o vencimento.',
    '• Em caso de dúvidas, contate: suporte@sistema.com ou (11) 0000-0000.',
    '• Este boleto refere-se à assinatura do Sistema de Gestão Estética.',
    `• Plano: ${plano}  |  Competência: ${competencia}  |  Empresa: ${empresaNome}`,
  ];
  const instrMaxW = CW - 6;
  instrucoes.forEach((linha, i) => {
    doc.text(truncateText(doc, linha, instrMaxW), MARGIN + 3, y + 13 + i * 5.5);
  });
  y += 34;

  // ── Separador picotado ─────────────────────────────────────────────────────
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.4);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(MARGIN, y, W - MARGIN, y);
  doc.setLineDashPattern([], 0);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTED);
  doc.text('✂  Recibo do Sacado', W / 2, y + 4, { align: 'center' });
  y += 10;

  // ── Recibo do sacado ───────────────────────────────────────────────────────
  doc.setFillColor(...BLACK);
  doc.roundedRect(MARGIN, y, CW, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...PRIMARY);
  doc.text('RECIBO DO SACADO', MARGIN + 4, y + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 180, 180);
  doc.text(`Sistema de Gestão Estética · ${codigoBanco}`, W - MARGIN - 4, y + 5.5, { align: 'right' });
  y += 12;

  const recW  = CW * 0.72;
  const recW2 = CW - recW;
  field('Beneficiário',      'Sistema de Gestão Estética LTDA', MARGIN,         y, recW,  12);
  field('Vencimento',        vencimento,                        MARGIN + recW,  y, recW2, 12);
  y += 12;
  field('Pagador',           empresaNome,                       MARGIN,         y, recW,  12);
  field('Valor',             fmtValor(valor),                   MARGIN + recW,  y, recW2, 12);
  y += 12;
  field('Referência / Plano', `${competencia} · ${plano}`,     MARGIN,         y, recW,  12);
  field('Nosso Número',      nossoNumero,                       MARGIN + recW,  y, recW2, 12);
  y += 16;

  // ── Código de barras ───────────────────────────────────────────────────────
  drawBarcode(doc, MARGIN, y, CW, 14, linhaDigitavel.replace(/\D/g, ''));
  y += 18;

  // Linha digitável centralizada — com font menor para não sair
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTED);
  const ldCenter = truncateText(doc, linhaDigitavel, CW);
  doc.text(ldCenter, W / 2, y, { align: 'center' });
  y += 10;

  // ── Aviso de autenticação ──────────────────────────────────────────────────
  // Usa splitTextToSize para quebrar o texto e nunca sair da caixa
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const avisoText  = 'Autenticação Mecânica — Este documento é válido apenas com autenticação bancária ou chancela mecânica.';
  const avisoLines = doc.splitTextToSize(avisoText, CW - 10) as string[];
  const avisoH     = Math.max(12, avisoLines.length * 5 + 6);

  doc.setFillColor(...GOLD_BG);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y, CW, avisoH, 2, 2, 'FD');

  doc.setTextColor(...GOLD);
  avisoLines.forEach((line: string, i: number) => {
    doc.text(line, MARGIN + 5, y + 6 + i * 5);
  });

  // ── Rodapé ────────────────────────────────────────────────────────────────
  doc.setFillColor(...BLACK);
  doc.rect(0, 285, W, 15, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('Boleto gerado automaticamente · Confidencial', MARGIN, 291);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PRIMARY);
  doc.text('Sistema de Gestão Estética', W / 2, 291, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Emitido em: ${now}`, W - MARGIN, 291, { align: 'right' });

  return doc.output('arraybuffer');
}

export async function POST(request: NextRequest) {
  try {
    const body: BoletoBody = await request.json();

    if (!body.empresaNome || !body.valor) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const buffer = await generateBoletoPDF(body);
    const slug   = (body.competencia ?? 'fatura').replace(/\s/g, '-').toLowerCase();

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="boleto-${body.empresaId}-${slug}.pdf"`,
        'Cache-Control':       'no-store',
      },
    });
  } catch (error) {
    console.error('[Boleto PDF] Erro:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar boleto', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}