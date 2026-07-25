import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/db.js";
import { cleanText } from "../lib/sanitize.js";
import { requireAuth, signUser } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimits.js";

export const authRouter = Router();

const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.preprocess((value) => (value === "" ? undefined : value), z.string().email().optional()),
  password: z.string().min(4).max(200)
});

authRouter.post("/register", authLimiter, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username: parsed.data.username }, { email: parsed.data.email?.toLowerCase() }] }
  });
  if (existing) return res.status(409).json({ error: "Username or email already exists" });

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      username: cleanText(parsed.data.username, 30),
      email: parsed.data.email?.toLowerCase(),
      passwordHash
    }
  });

  res.json({ token: signUser(user), user: publicUser(user) });
});

authRouter.post("/login", authLimiter, async (req, res) => {
  const username = cleanText(req.body.username, 60);
  const password = String(req.body.password || "");
  const user = await prisma.user.findFirst({
    where: { OR: [{ username }, { email: username.toLowerCase() }] }
  });
  if (!user?.passwordHash) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ token: signUser(user), user: publicUser(user) });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

function publicUser(user) {
  return { id: user.id, username: user.username, email: user.email, role: user.role };
}
