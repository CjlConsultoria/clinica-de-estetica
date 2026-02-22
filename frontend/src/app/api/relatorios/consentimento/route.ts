import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import fs from 'fs';
import path from 'path';

interface TermoData {
  id: number;
  paciente: string;
  procedimento: string;
  dataCriacao: string;
  dataValidade: string;
  status: string;
  assinadoEm: string | null;
  ip: string | null;
  profissional: string;
  versao: string;
}

interface RequestBody {
  termo: TermoData;
}

const C_PRIMARY:  [number,number,number] = [187, 161, 136];
const C_BLACK:    [number,number,number] = [27,  27,  27 ];
const C_DARK:     [number,number,number] = [26,  26,  26 ];
const C_GRAY:     [number,number,number] = [100, 100, 100];
const C_MUTED:    [number,number,number] = [153, 153, 153];
const C_LIGHT:    [number,number,number] = [187, 187, 187];
const C_WHITE:    [number,number,number] = [255, 255, 255];
const C_BG:       [number,number,number] = [255, 255, 255];
const C_CREAM:    [number,number,number] = [253, 249, 245];
const C_BORDER:   [number,number,number] = [240, 235, 228];
const C_SIGNED:   [number,number,number] = [138, 117, 96 ];
const C_SIGNED_BG:[number,number,number] = [240, 235, 228];
const C_PENDING:  [number,number,number] = [133, 100, 4  ];
const C_PENDING_BG:[number,number,number]= [255, 243, 205];

const W        = 210;
const MARGIN   = 14;
const CW       = W - MARGIN * 2;
const HEADER_H = 52;
const FOOTER_Y = 285;
const SAFE_MAX = FOOTER_Y - 2;

function lighten(c: [number,number,number], pct: number): [number,number,number] {
  return [
    Math.round(c[0] + (255 - c[0]) * pct),
    Math.round(c[1] + (255 - c[1]) * pct),
    Math.round(c[2] + (255 - c[2]) * pct),
  ];
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

async function generateConsentimentoPDF(body: RequestBody): Promise<ArrayBuffer> {
  const { termo } = body;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const now = new Date().toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  let y = 0;

  function fillBg() {
    doc.setFillColor(...C_BG);
    doc.rect(0, 0, W, 297, 'F');
  }

  function need(h: number) {
    if (y + h > SAFE_MAX) {
      doc.addPage();
      fillBg();
      y = 14;
    }
  }

  fillBg();

  doc.setFillColor(...C_BLACK);
  doc.rect(0, 0, W, HEADER_H, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...C_PRIMARY);
  doc.text('Termo de Consentimento Digital', MARGIN + 5, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 180, 180);
  doc.text('Sistema de Gestao Estetica  -  Documento Juridico', MARGIN + 5, 30);

  const metaDots = [
    `Gerado em: ${now}`,
    `Versao: ${termo.versao}`,
    `Validade: ${termo.dataValidade}`,
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

  const DATA_CARD_H = 42;
  need(DATA_CARD_H);

  doc.setFillColor(...C_CREAM);
  doc.setDrawColor(...C_BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, y, CW, DATA_CARD_H, 4, 4, 'FD');

  doc.setFillColor(...C_PRIMARY);
  doc.roundedRect(MARGIN, y, 2, DATA_CARD_H, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...C_PRIMARY);
  doc.text('Dados do Paciente', MARGIN + 8, y + 9);

  doc.setDrawColor(...C_BORDER);
  doc.setLineWidth(0.3);
  doc.line(MARGIN + 8, y + 12, MARGIN + CW - 8, y + 12);

  const dataRows: [string, string][] = [
    ['Paciente:',      termo.paciente],
    ['Procedimento:',  termo.procedimento],
    ['Profissional:',  termo.profissional],
    ['Data de Criacao:', termo.dataCriacao],
  ];

  const colMid = MARGIN + CW / 2;
  dataRows.forEach((row, i) => {
    const col = i < 2 ? MARGIN + 8 : colMid;
    const rowY = i < 2 ? y + 20 + (i * 9) : y + 20 + ((i - 2) * 9);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...C_MUTED);
    doc.text(safe(row[0]), col, rowY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...C_DARK);
    doc.text(safe(row[1]), col + doc.getTextWidth(safe(row[0])) + 2, rowY);
  });

  y += DATA_CARD_H + 8;

  const sections: { title: string; body: string }[] = [
    {
      title: '1. Descricao do Procedimento e Consentimento',
      body:
        `Eu, paciente acima identificado(a), declaro que fui devidamente informado(a) sobre o procedimento de ` +
        `${safe(termo.procedimento)}, seus objetivos, riscos, alternativas e possiveis complicações, tendo ` +
        `compreendido todas as informacoes prestadas pelo profissional responsavel. ` +
        `Declaro ainda que as informacoes por mim fornecidas sao verdadeiras, e que nao omiti nenhum dado ` +
        `relevante sobre meu estado de saude, alergias ou medicamentos em uso.`,
    },
    {
      title: '2. Riscos e Complicações',
      body:
        `Estou ciente de que qualquer procedimento estetico pode apresentar riscos e complicações, incluindo ` +
        `mas nao se limitando a: reacoes alergicas, hematomas, assimetrias temporarias e, em casos raros, ` +
        `Complicações mais graves. Fui informado(a) sobre todos esses riscos e aceito submeter-me a este ` +
        `procedimento voluntariamente, sem qualquer coercao.`,
    },
    {
      title: '3. Cuidados Pos-Procedimento',
      body:
        `Declaro ter recebido e compreendido as orientacoes de cuidados pos-procedimento, incluindo restricoes ` +
        `de atividade fisica, exposicao solar e uso de produtos. Comprometo-me a seguir as instrucoes do ` +
        `profissional responsavel e a entrar em contato com a clinica em caso de qualquer intercorrencia.`,
    },
    {
      title: '4. Autorizacao de Imagem',
      body:
        `Autorizo, mediante consentimento expresso, o registro fotografico e/ou videogrfico antes, durante e ` +
        `apos o procedimento, para fins de acompanhamento clinico e documentacao do prontuario, sendo vedada ` +
        `qualquer divulgacao sem minha autorizacao previa e por escrito.`,
    },
    {
      title: '5. Protecao de Dados (LGPD)',
      body:
        `Estou ciente de que meus dados pessoais e de saude serao tratados em conformidade com a Lei Geral de ` +
        `Protecao de Dados (LGPD - Lei 13.709/2018), sendo utilizados exclusivamente para fins de atendimento ` +
        `clinico e gestao do prontuario eletronico, com sigilo garantido pela equipe profissional.`,
    },
  ];

  sections.forEach(sec => {
    const bodyLines = doc.splitTextToSize(sec.body, CW - 18) as string[];
    const secH = 10 + bodyLines.length * 5.5 + 6;

    need(secH);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...C_PRIMARY);
    doc.text(sec.title, MARGIN, y + 7);

    doc.setDrawColor(...C_BORDER);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y + 10, MARGIN + CW, y + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    bodyLines.forEach((line, li) => {
      doc.text(line, MARGIN, y + 17 + li * 5.5);
    });

    y += secH + 4;
  });

  const signH = termo.status === 'assinado' ? 52 : 32;
  need(signH + 8);

  y += 4;

  const isSigned = termo.status === 'assinado';
  const signBg   = isSigned ? C_SIGNED_BG : C_PENDING_BG;
  const signColor= isSigned ? C_SIGNED    : C_PENDING;

  doc.setFillColor(...signBg);
  doc.setDrawColor(...signColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN, y, CW, signH, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...signColor);
  doc.text(
    isSigned ? 'Assinado Digitalmente' : 'Aguardando Assinatura Digital',
    MARGIN + 10,
    y + 10,
  );

  if (isSigned) {
    const circleR  = 6;
    const circleX  = MARGIN + CW - 10 - circleR;
    const circleY  = y + 12;

    doc.setFillColor(...signColor);
    doc.circle(circleX, circleY, circleR, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...C_WHITE);
    const okW = doc.getTextWidth('OK');
    doc.text('OK', circleX - okW / 2, circleY + 1.3);

    const signRows: [string, string][] = [
      ['Paciente:',   termo.paciente],
      ['Data/Hora:',  termo.assinadoEm ?? '—'],
      ['IP:',         termo.ip ?? '—'],
      ['Validade:',   termo.dataValidade],
    ];

    const half = Math.ceil(signRows.length / 2);
    signRows.forEach((row, i) => {
      const col = i < half ? MARGIN + 10 : colMid;
      const ry  = i < half ? y + 20 + i * 9 : y + 20 + (i - half) * 9;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...C_MUTED);
      doc.text(row[0], col, ry);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...C_DARK);
      doc.text(safe(row[1]), col + doc.getTextWidth(row[0]) + 2, ry);
    });
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...C_PENDING);
    doc.text(
      'Este termo aguarda a assinatura digital do paciente para ter validade juridica.',
      MARGIN + 10,
      y + 22,
    );
  }

  y += signH + 8;

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
    if (!body.termo) return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });

    const buffer = await generateConsentimentoPDF(body);
    const filename = body.termo.paciente
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="consentimento-${filename}.pdf"`,
        'Cache-Control':       'no-store',
      },
    });
  } catch (error) {
    console.error('[PDF Consentimento] Erro:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar PDF', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 },
    );
  }
}