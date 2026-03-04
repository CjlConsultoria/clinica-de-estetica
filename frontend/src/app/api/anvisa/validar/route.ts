import { NextRequest, NextResponse } from 'next/server';

const CATEGORIAS = [
  'medicamentos',
  'cosmeticos',
  'saneantes',
  'produtos-saude',
];

export async function GET(request: NextRequest) {
  const registro = request.nextUrl.searchParams.get('registro')?.trim();

  if (!registro) {
    return NextResponse.json({ valido: false, mensagem: 'Registro não informado' }, { status: 400 });
  }

  for (const categoria of CATEGORIAS) {
    try {
      const url = `https://consultas.anvisa.gov.br/api/consulta/${categoria}/products/?search=${encodeURIComponent(registro)}&count=1&page=1`;
      const res = await fetch(url, {
        headers: {
          Authorization: 'Guest',
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
        signal: AbortSignal.timeout(6000),
      });

      if (!res.ok) continue;

      const data = await res.json();
      const total: number = data.totalElements ?? data.total ?? 0;
      const items: Record<string, string>[] = data.content ?? data.items ?? data.data ?? [];

      if (total > 0 || items.length > 0) {
        const nome: string =
          items[0]?.productName ??
          items[0]?.nomeProduto ??
          items[0]?.nome ??
          '';
        return NextResponse.json({ valido: true, produto: nome, mensagem: 'Registro ANVISA encontrado' });
      }
    } catch {
      // tenta próxima categoria
    }
  }

  return NextResponse.json({ valido: false, mensagem: 'Registro não encontrado na base da ANVISA' });
}
