import { Router } from "express";
import { config } from "../config.js";
import { prisma } from "../lib/db.js";
import { cleanText } from "../lib/sanitize.js";
import { telegramLimiter } from "../middleware/rateLimits.js";
import { sendChatMessage } from "../services/chat.js";

export const telegramRouter = Router();

telegramRouter.post("/webhook", telegramLimiter, async (req, res) => {
  if (config.telegramWebhookSecret && req.headers["x-telegram-bot-api-secret-token"] !== config.telegramWebhookSecret) {
    return res.status(401).json({ error: "Invalid Telegram secret" });
  }

  res.sendStatus(200);
  const message = req.body.message;
  if (!message?.text || !message.from?.id) return;

  const telegramId = String(message.from.id);
  const text = cleanText(message.text, 8000);

  try {
    if (text.startsWith("/start")) {
      await handleStart(telegramId, message.from, text);
      return;
    }

    const user = await prisma.user.findUnique({ where: { telegramId } });
    if (!user) {
      await sendTelegram(telegramId, "Necesitas un enlace/codigo de invitacion. Usa: /start TU-CODIGO");
      return;
    }

    const chat = await getOrCreateTelegramChat(user.id);
    const result = await sendChatMessage({ userId: user.id, chatId: chat.id, content: text });
    await sendTelegram(telegramId, result.message.content);
  } catch (error) {
    await sendTelegram(telegramId, `Error: ${error.message}`);
  }
});

async function handleStart(telegramId, from, text) {
  const code = cleanText(text.replace("/start", ""), 120).trim();
  if (!code) {
    await sendTelegram(telegramId, "Bienvenido a Fex. Entra con un enlace de invitacion o usa /start CODIGO.");
    return;
  }

  const existing = await prisma.user.findUnique({ where: { telegramId } });
  if (existing) {
    await sendTelegram(telegramId, "Tu Telegram ya esta conectado a Fex.");
    return;
  }

  const invite = await prisma.invite.findUnique({ where: { code }, include: { uses: true } });
  if (!invite || !invite.active || (invite.expiresAt && invite.expiresAt < new Date())) {
    await sendTelegram(telegramId, "Invitacion invalida o caducada.");
    return;
  }
  if (invite.maxUses && invite.uses.length >= invite.maxUses) {
    await sendTelegram(telegramId, "Esta invitacion ya no tiene usos disponibles.");
    return;
  }

  const username = cleanText(from.username || `telegram_${telegramId}`, 30);
  const user = await prisma.user.create({
    data: {
      username,
      telegramId,
      telegramName: cleanText([from.first_name, from.last_name].filter(Boolean).join(" "), 80),
      usedInvitations: { create: { inviteId: invite.id } }
    }
  });

  await getOrCreateTelegramChat(user.id);
  await sendTelegram(telegramId, "Fex esta listo. Preguntame cualquier cosa de programacion.");
}

async function getOrCreateTelegramChat(userId) {
  const title = "Telegram";
  return (
    (await prisma.chat.findFirst({ where: { userId, title } })) ||
    prisma.chat.create({ data: { userId, title } })
  );
}

async function sendTelegram(chatId, text) {
  if (!config.telegramBotToken) return;
  await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: text.slice(0, 4096) })
  });
}

