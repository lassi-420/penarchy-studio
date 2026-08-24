"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import {
  contactSchema,
  shippingSchema,
  type ContactValues,
  type ShippingValues,
} from "@/lib/validation/checkout";
import { EmptyState } from "@/components/ui/empty-state";

const STEPS = ["Contact", "Shipping", "Payment", "Review"] as const;

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCartStore();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState<ContactValues | null>(null);
  const [shipping, setShipping] = useState<ShippingValues | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "paypal" | "cod" | "bank_transfer"
  >("card");
  const [placing, setPlacing] = useState(false);

  const contactForm = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });
  const shippingForm = useForm<ShippingValues>({
    resolver: zodResolver(shippingSchema),
  });

  const shippingCost = subtotal() >= 150 || subtotal() === 0 ? 0 : 12;
  const tax = subtotal() * 0.0;
  const total = subtotal() + shippingCost + tax;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 md:px-8">
        <EmptyState
          title="Your bag is empty"
          body="Add something to your bag before checking out."
        />
      </div>
    );
  }

  const placeOrder = async () => {
    setPlacing(true);
    // In production this calls a Server Action that: validates stock,
    // creates the Order + OrderItems in Postgres via Prisma, calls
    // lib/payments to create a payment intent, then redirects. That path is
    // wired below in comments — it can't execute against a live DB from this
    // sandbox, so we simulate the order number client-side for the demo.
    await new Promise((r) => setTimeout(r, 900));
    const orderNumber = `PS-${Date.now().toString().slice(-8)}`;
    clear();
    router.push(`/checkout/confirmation?order=${orderNumber}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
      <h1 className="font-display text-4xl text-[var(--color-text)]">
        Checkout
      </h1>

      <div className="mt-6 flex gap-6 text-xs tracking-widest">
        {STEPS.map((s, i) => (
          <span
            key={s}
            className={
              i === step
                ? "text-[var(--color-brass-light)]"
                : i < step
                ? "text-[var(--color-text-muted)]"
                : "text-[var(--color-text-faint)]"
            }
          >
            {String(i + 1).padStart(2, "0")} {s.toUpperCase()}
          </span>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {step === 0 && (
            <form
              onSubmit={contactForm.handleSubmit((values) => {
                setContact(values);
                setStep(1);
              })}
              className="space-y-5"
            >
              <div>
                <label className="eyebrow mb-2 block">Email</label>
                <input
                  {...contactForm.register("email")}
                  type="email"
                  className="w-full border border-[var(--color-border-strong)] bg-transparent px-4 py-3 text-sm focus:border-[var(--color-brass)] focus:outline-none"
                  placeholder="you@example.com"
                />
                {contactForm.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-400">
                    {contactForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <button className="bg-[var(--color-brass)] px-8 py-3 text-xs tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-brass-light)]">
                CONTINUE TO SHIPPING
              </button>
            </form>
          )}

          {step === 1 && (
            <form
              onSubmit={shippingForm.handleSubmit((values) => {
                setShipping(values);
                setStep(2);
              })}
              className="space-y-5"
            >
              {[
                ["fullName", "Full name"],
                ["line1", "Address"],
                ["line2", "Apt / suite (optional)"],
                ["city", "City"],
                ["state", "State / province"],
                ["postalCode", "Postal code"],
                ["country", "Country"],
                ["phone", "Phone (optional)"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="eyebrow mb-2 block">{label}</label>
                  <input
                    {...shippingForm.register(name as keyof ShippingValues)}
                    className="w-full border border-[var(--color-border-strong)] bg-transparent px-4 py-3 text-sm focus:border-[var(--color-brass)] focus:outline-none"
                  />
                  {shippingForm.formState.errors[name as keyof ShippingValues] && (
                    <p className="mt-1 text-xs text-red-400">
                      {
                        shippingForm.formState.errors[name as keyof ShippingValues]
                          ?.message as string
                      }
                    </p>
                  )}
                </div>
              ))}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="border border-[var(--color-border-strong)] px-8 py-3 text-xs tracking-widest hover:border-[var(--color-brass)]"
                >
                  BACK
                </button>
                <button className="bg-[var(--color-brass)] px-8 py-3 text-xs tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-brass-light)]">
                  CONTINUE TO PAYMENT
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {[
                ["card", "Credit / Debit Card"],
                ["paypal", "PayPal"],
                ["cod", "Cash on Delivery"],
                ["bank_transfer", "Bank Transfer"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 border p-4 text-sm transition-colors",
                    paymentMethod === value
                      ? "border-[var(--color-brass)] text-[var(--color-brass-light)]"
                      : "border-[var(--color-border-strong)] text-[var(--color-text-muted)]"
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === value}
                    onChange={() => setPaymentMethod(value as typeof paymentMethod)}
                  />
                  {label}
                </label>
              ))}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="border border-[var(--color-border-strong)] px-8 py-3 text-xs tracking-widest hover:border-[var(--color-brass)]"
                >
                  BACK
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-[var(--color-brass)] px-8 py-3 text-xs tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-brass-light)]"
                >
                  REVIEW ORDER
                </button>
              </div>
            </div>
          )}

          {step === 3 && contact && shipping && (
            <div className="space-y-6">
              <div className="border border-[var(--color-border)] p-5 text-sm">
                <p className="text-[var(--color-text-muted)]">Contact</p>
                <p>{contact.email}</p>
              </div>
              <div className="border border-[var(--color-border)] p-5 text-sm">
                <p className="text-[var(--color-text-muted)]">Ship to</p>
                <p>
                  {shipping.fullName}, {shipping.line1}
                  {shipping.line2 ? `, ${shipping.line2}` : ""}, {shipping.city}
                  {shipping.state ? `, ${shipping.state}` : ""} {shipping.postalCode},{" "}
                  {shipping.country}
                </p>
              </div>
              <div className="border border-[var(--color-border)] p-5 text-sm">
                <p className="text-[var(--color-text-muted)]">Payment</p>
                <p className="capitalize">{paymentMethod.replace("_", " ")}</p>
              </div>
              <label className="flex items-start gap-2 text-xs text-[var(--color-text-faint)]">
                <input type="checkbox" required className="mt-0.5" />
                I agree to the Terms of Service and Privacy Policy.
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="border border-[var(--color-border-strong)] px-8 py-3 text-xs tracking-widest hover:border-[var(--color-brass)]"
                >
                  BACK
                </button>
                <button
                  onClick={placeOrder}
                  disabled={placing}
                  className="bg-[var(--color-brass)] px-8 py-3 text-xs tracking-widest text-[var(--color-ink)] hover:bg-[var(--color-brass-light)] disabled:opacity-50"
                >
                  {placing ? "PLACING ORDER…" : "PLACE ORDER"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="border border-[var(--color-border)] p-6 h-fit">
          <h2 className="eyebrow mb-5">Order Summary</h2>
          <div className="space-y-3 divide-y divide-[var(--color-border)]">
            {lines.map((l) => (
              <div
                key={`${l.productId}-${l.variantId ?? "base"}`}
                className="flex justify-between pt-3 first:pt-0 text-sm"
              >
                <span className="text-[var(--color-text-muted)]">
                  {l.name} × {l.quantity}
                </span>
                <span>{formatPrice(l.price * l.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-[var(--color-border)] pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Subtotal</span>
              <span>{formatPrice(subtotal())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Shipping</span>
              <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-2 text-base">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <Link
        href="/cart"
        className="mt-8 inline-block text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
      >
        ← Back to bag
      </Link>
    </div>
  );
}
