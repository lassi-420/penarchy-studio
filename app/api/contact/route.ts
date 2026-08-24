import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getEmailProvider } from "@/lib/email";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const provider = getEmailProvider();
  await provider.send({
    to: process.env.EMAIL_FROM ?? "hello@penarchystudio.com",
    subject: `New contact form message from ${parsed.data.name}`,
    html: `<p><strong>${parsed.data.name}</strong> (${parsed.data.email}) wrote:</p><p>${parsed.data.message}</p>`,
  });

  return NextResponse.json({ ok: true });
}
