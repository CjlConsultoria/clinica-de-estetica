export async function GET(_: Request, { params }: { params: { cep: string } }) {
  try {
    const res = await fetch(`https://viacep.com.br/ws/${params.cep}/json/`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      return Response.json({ erro: true }, { status: 200 });
    }
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ erro: true }, { status: 200 });
  }
}
