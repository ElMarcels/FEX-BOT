import { Router } from "express";
import { prisma } from "../lib/db.js";
import { cleanText } from "../lib/sanitize.js";
import { requireAuth } from "../middleware/auth.js";

export const organizationRouter = Router();
organizationRouter.use(requireAuth);

organizationRouter.get("/folders", async (req, res) => {
  const folders = await prisma.folder.findMany({ where: { userId: req.user.id }, orderBy: { name: "asc" } });
  res.json({ folders });
});

organizationRouter.post("/folders", async (req, res) => {
  const folder = await prisma.folder.create({
    data: { name: cleanText(req.body.name, 60), userId: req.user.id }
  });
  res.json({ folder });
});

organizationRouter.get("/categories", async (req, res) => {
  const categories = await prisma.category.findMany({ where: { userId: req.user.id }, orderBy: { name: "asc" } });
  res.json({ categories });
});

organizationRouter.post("/categories", async (req, res) => {
  const category = await prisma.category.create({
    data: {
      name: cleanText(req.body.name, 60),
      color: cleanText(req.body.color || "#7c3aed", 20),
      userId: req.user.id
    }
  });
  res.json({ category });
});

