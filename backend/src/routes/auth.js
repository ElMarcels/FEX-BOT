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
  email: z.preprocess((value) => (value === "" || value === undefined ? undefined : value), z.string().email().optional()),
  password: z.string().min(4).max(200)
});

authRouter.post("/register", authLimiter, async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      console.error("Register validation error:", parsed.error.flatten());
      return res.status(400).json({ error: "Usuario minimo 3 caracteres, contrasena minimo 4 caracteres" });
    }

    const existing = await prisma.user.findFirst({
      where: { username: parsed.data.username.toLowerCase() }
    });
    if (existing) return res.status(409).json({ error: "Este usuario ya existe" });

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: {
        username: parsed.data.username.toLowerCase(),
        email: parsed.data.email?.toLowerCase() || null,
        passwordHash
      }
    });

    res.json({ token: signUser(user), user: publicUser(user) });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Error al crear cuenta" });
  }
});

authRouter.post("/login", authLimiter, async (req, res) => {
  try {
    const username = String(req.body.username || "").toLowerCase().trim();
    const password = String(req.body.password || "");

    if (!username || !password) {
      return res.status(400).json({ error: "Usuario y contrasena requeridos" });
    }

    const user = await prisma.user.findFirst({
      where: { OR: [{ username }, { email: username }] }
    });
    if (!user || !user.passwordHash) return res.status(401).json({ error: "Usuario o contrasena incorrectos" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Usuario o contrasena incorrectos" });

    res.json({ token: signUser(user), user: publicUser(user) });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error al iniciar sesion" });
  }
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

function publicUser(user) {
  return { id: user.id, username: user.username, email: user.email, role: user.role };
}
