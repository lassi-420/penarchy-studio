// ============================================================================
// PAYMENT ABSTRACTION LAYER
//
// Nothing in this file (or any file that imports it) is ever bundled for the
// client — it's used from Server Actions / Route Handlers only. Real provider
// credentials live in environment variables (see .env.example) and are never
// exposed to the browser.
// ============================================================================

export type PaymentProviderId = "stripe" | "paypal" | "cod" | "bank_transfer" | "manual";

export interface CreatePaymentIntentInput {
  orderId: string;
  amount: number; // in the smallest currency unit is provider-specific; kept as decimal here for simplicity
  currency: string;
}

export interface PaymentIntentResult {
  provider: PaymentProviderId;
  providerRef: string;
  clientSecret?: string;
  status: "requires_action" | "processing" | "succeeded" | "failed";
}

export interface PaymentProvider {
  id: PaymentProviderId;
  createPaymentIntent(input: CreatePaymentIntentInput): Promise<PaymentIntentResult>;
}

// --- Stripe (structure only — wire up with STRIPE_SECRET_KEY once available) ---
const stripeProvider: PaymentProvider = {
  id: "stripe",
  async createPaymentIntent(input) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error(
        `STRIPE_SECRET_KEY is not configured. Add it to .env and implement the Stripe SDK call here for order ${input.orderId}.`
      );
    }
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const intent = await stripe.paymentIntents.create({ amount: Math.round(input.amount * 100), currency: input.currency });
    // return { provider: "stripe", providerRef: intent.id, clientSecret: intent.client_secret ?? undefined, status: "requires_action" };
    throw new Error("Stripe integration not yet implemented — see lib/payments/index.ts");
  },
};

// --- PayPal (structure only) ---
const paypalProvider: PaymentProvider = {
  id: "paypal",
  async createPaymentIntent(input) {
    if (!process.env.PAYPAL_CLIENT_ID) {
      throw new Error(
        `PAYPAL_CLIENT_ID is not configured. Add it to .env and implement the PayPal order creation call here for order ${input.orderId}.`
      );
    }
    throw new Error("PayPal integration not yet implemented — see lib/payments/index.ts");
  },
};

// --- Cash on delivery — no external call needed ---
const codProvider: PaymentProvider = {
  id: "cod",
  async createPaymentIntent(input) {
    return {
      provider: "cod",
      providerRef: `cod_${input.orderId}`,
      status: "processing",
    };
  },
};

// --- Bank transfer — order is marked payment-pending until manually confirmed ---
const bankTransferProvider: PaymentProvider = {
  id: "bank_transfer",
  async createPaymentIntent(input) {
    return {
      provider: "bank_transfer",
      providerRef: `bank_${input.orderId}`,
      status: "processing",
    };
  },
};

// --- Manual (admin marks paid by hand) ---
const manualProvider: PaymentProvider = {
  id: "manual",
  async createPaymentIntent(input) {
    return {
      provider: "manual",
      providerRef: `manual_${input.orderId}`,
      status: "processing",
    };
  },
};

const providers: Record<PaymentProviderId, PaymentProvider> = {
  stripe: stripeProvider,
  paypal: paypalProvider,
  cod: codProvider,
  bank_transfer: bankTransferProvider,
  manual: manualProvider,
};

export function getPaymentProvider(id: PaymentProviderId): PaymentProvider {
  return providers[id];
}

// Which providers are enabled is a SiteSetting in production (admin-editable).
// Fallback while the DB is not reachable from this sandbox:
export function getEnabledProviders(): PaymentProviderId[] {
  const configured = (process.env.PAYMENT_PROVIDER as PaymentProviderId) || "manual";
  return [configured];
}
