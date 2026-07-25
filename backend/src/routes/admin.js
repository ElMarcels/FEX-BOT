import { Router } from "express";
import { prisma } from "../lib/db.js";
import { cleanText } from "../lib/sanitize.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const adminRouter = Router();
adminRouter.use(requireAuth, requireAdmin);

adminRouter.post("/invites", async (req, res) => {
  const code = cleanText(req.body.code, 120);
  if (!code) return res.status(400).json({ error: "code is required" });
  const invite = await prisma.invite.create({
    data: {
      code,
      maxUses: req.body.maxUses ? Number(req.body.maxUses) : null,
      expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null
    }
  });
  res.json({ invite });
});

adminRouter.get("/invites", async (_req, res) => {
  const invites = await prisma.invite.findMany({ include: { uses: true }, orderBy: { createdAt: "desc" } });
  res.json({ invites });
});

