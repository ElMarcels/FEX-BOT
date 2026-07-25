import { Router } from "express";
import { prisma } from "../lib/db.js";
import { cleanText } from "../lib/sanitize.js";
import { requireAuth } from "../middleware/auth.js";

export const memoryRouter = Router();
memoryRouter.use(requireAuth);

memoryRouter.get("/", async (req, res) => {
  const memories = await prisma.memory.findMany({ where: { userId: req.user.id }, orderBy: { updatedAt: "desc" } });
  res.json({ memories });
});

memoryRouter.put("/", async (req, res) => {
  const key = cleanText(req.body.key, 80);
  const value = cleanText(req.body.value, 2000);
  if (!key || !value) return res.status(400).json({ error: "key and value are required" });
  const memory = await prisma.memory.upsert({
    where: { userId_key: { userId: req.user.id, key } },
    update: { value, source: "manual" },
    create: { userId: req.user.id, key, value, source: "manual" }
  });
  res.json({ memory });
});

memoryRouter.delete("/:id", async (req, res) => {
  const result = await prisma.memory.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
  res.json({ deleted: result.count });
});

