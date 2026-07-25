import { Router } from "express";
import { prisma } from "../lib/db.js";
import { cleanText } from "../lib/sanitize.js";
import { requireAuth } from "../middleware/auth.js";
import { chatLimiter } from "../middleware/rateLimits.js";
import { sendChatMessage } from "../services/chat.js";

export const chatsRouter = Router();
chatsRouter.use(requireAuth);

chatsRouter.get("/", async (req, res) => {
  const chats = await prisma.chat.findMany({
    where: { userId: req.user.id },
    include: { folder: true, category: true, messages: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { updatedAt: "desc" }
  });
  res.json({ chats });
});

chatsRouter.post("/", async (req, res) => {
  const title = cleanText(req.body.title || "Nuevo chat", 80);
  const chat = await prisma.chat.create({
    data: {
      title,
      userId: req.user.id,
      folderId: req.body.folderId || null,
      categoryId: req.body.categoryId || null
    }
  });
  res.json({ chat });
});

chatsRouter.get("/:id", async (req, res) => {
  const chat = await prisma.chat.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: { messages: { orderBy: { createdAt: "asc" } }, folder: true, category: true }
  });
  if (!chat) return res.status(404).json({ error: "Chat not found" });
  res.json({ chat });
});

chatsRouter.patch("/:id", async (req, res) => {
  const chat = await prisma.chat.updateMany({
    where: { id: req.params.id, userId: req.user.id },
    data: {
      title: req.body.title ? cleanText(req.body.title, 80) : undefined,
      folderId: req.body.folderId ?? undefined,
      categoryId: req.body.categoryId ?? undefined
    }
  });
  res.json({ updated: chat.count });
});

chatsRouter.delete("/:id", async (req, res) => {
  const result = await prisma.chat.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
  res.json({ deleted: result.count });
});

chatsRouter.post("/:id/messages", chatLimiter, async (req, res) => {
  try {
    const result = await sendChatMessage({
      userId: req.user.id,
      chatId: req.params.id,
      content: req.body.content
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

chatsRouter.post("/messages", chatLimiter, async (req, res) => {
  try {
    const result = await sendChatMessage({
      userId: req.user.id,
      chatId: req.body.chatId,
      content: req.body.content
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

