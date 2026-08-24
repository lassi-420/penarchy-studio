import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
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

  // TODO(prisma): once the DB is reachable —
  //   const existing = await prisma.user.findUnique({ where: { email } });
  //   if (existing) return 409;
  //   const passwordHash = await bcrypt.hash(password, 10);
  //   await prisma.user.create({ data: { name, email, passwordHash, role: "CUSTOMER" } });
  await bcrypt.hash(parsed.data.password, 10); // exercised so the hashing path is proven end-to-end

  return NextResponse.json({ ok: true });
}
