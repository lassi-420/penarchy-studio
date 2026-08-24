// ============================================================================
// EMAIL ABSTRACTION LAYER
// Swap EMAIL_PROVIDER in .env to route through a real provider. "console" is
// the safe default for local development — it logs instead of sending.
// ============================================================================

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export interface EmailProvider {
  send(input: SendEmailInput): Promise<void>;
}

const consoleProvider: EmailProvider = {
  async send(input) {
    console.log("[email:console]", input.to, "—", input.subject);
  },
};

// const smtpProvider: EmailProvider = { async send(input) { /* nodemailer using EMAIL_SERVER */ } };
// const resendProvider: EmailProvider = { async send(input) { /* Resend SDK using RESEND_API_KEY */ } };

export function getEmailProvider(): EmailProvider {
  const providerId = process.env.EMAIL_PROVIDER ?? "console";
  switch (providerId) {
    case "console":
    default:
      return consoleProvider;
  }
}

// Transactional email templates — call sites are documented, wiring happens
// once the DB/order pipeline is live.
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: "Welcome to Penarchy Studio",
    html: `<p>Hi ${name}, welcome to Penarchy Studio.</p>`,
  }),
  orderConfirmation: (orderNumber: string) => ({
    subject: `Order confirmed — ${orderNumber}`,
    html: `<p>Your order ${orderNumber} has been received.</p>`,
  }),
  shippingConfirmation: (orderNumber: string, trackingUrl?: string) => ({
    subject: `Your order has shipped — ${orderNumber}`,
    html: `<p>Order ${orderNumber} is on its way.${
      trackingUrl ? ` <a href="${trackingUrl}">Track it here</a>.` : ""
    }</p>`,
  }),
  passwordReset: (resetUrl: string) => ({
    subject: "Reset your password",
    html: `<p><a href="${resetUrl}">Reset your password</a>. This link expires in 1 hour.</p>`,
  }),
};
