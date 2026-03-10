import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY!;

export async function POST(req: NextRequest) {
  const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2026-02-25.clover' as any });

  const { amount, paymentMethod, empresaNome, customerName, customerEmail, customerTaxId } =
    await req.json();

  const amountCents = Math.round(Number(amount) * 100);

  if (!amountCents || amountCents <= 0) {
    return NextResponse.json({ error: 'Valor inválido' }, { status: 400 });
  }

  try {
    if (paymentMethod === 'pix') {
      const pi = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: 'brl',
        payment_method_types: ['pix'],
        metadata: { empresaNome: String(empresaNome || '') },
      });

      return NextResponse.json({ clientSecret: pi.client_secret });
    }
    if (paymentMethod === 'boleto') {
      const taxId = String(customerTaxId || '').replace(/\D/g, '');
      const name  = String(customerName  || empresaNome || 'Cliente');
      const email = String(customerEmail || 'contato@empresa.com.br');

      const customer = await stripe.customers.create({ name, email });

      const pi = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: 'brl',
        payment_method_types: ['boleto'],
        customer: customer.id,
        payment_method_data: {
          type: 'boleto',
          boleto: { tax_id: taxId || '000.000.000-00' },
          billing_details: {
            name,
            email,
            address: { country: 'BR', line1: 'Não informado', city: 'São Paulo', state: 'SP', postal_code: '01310-100' },
          },
        },
        confirm: true,
        metadata: { empresaNome: String(empresaNome || '') },
      });

      const boleto = (pi.next_action as Stripe.PaymentIntent.NextAction & {
        boleto_display_details?: { number: string; hosted_voucher_url: string; expires_at: number };
      })?.boleto_display_details;

      return NextResponse.json({
        clientSecret:     pi.client_secret,
        boletoNumber:     boleto?.number ?? null,
        boletoVoucherUrl: boleto?.hosted_voucher_url ?? null,
        boletoExpiresAt:  boleto?.expires_at ?? null,
      });
    }
    const pi = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'brl',
      payment_method_types: ['card'],
      metadata: { empresaNome: String(empresaNome || '') },
    });

    return NextResponse.json({ clientSecret: pi.client_secret });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('[Stripe PaymentIntent]', msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
