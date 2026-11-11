// Provider boundary: wire the confirmed account here, never infer payment success from the browser.
export type PaymentRequest = { orderId: string; amountCents: number; method: "pix" | "card"; name: string; email: string };
export type VerifiedPayment = { eventId: string; reference: string; amountCents: number; status: "pending" | "paid" | "failed" | "expired" | "refunded" };
export interface GiftPaymentProvider {
  create(request: PaymentRequest): Promise<{ reference: string; checkoutUrl: string }>;
  verifyWebhook(request: Request): Promise<VerifiedPayment>;
}
export const provider: GiftPaymentProvider = {
  async create() { throw new Error("Pagamentos ainda não configurados. Nenhuma cobrança foi criada."); },
  async verifyWebhook() { throw new Error("Confirmações de pagamento ainda não configuradas."); },
};