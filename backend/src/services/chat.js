import { prisma } from "../lib/db.js";
import { cleanText } from "../lib/sanitize.js";
import { generateReply } from "./ai.js";
import { getMemories, rememberFromText } from "./memory.js";

export async function sendChatMessage({ userId, chatId, content }) {
  const clean = cleanText(content, 8000);
  if (!clean) throw new Error("Message is required");

  const chat =
    chatId
      ? await prisma.chat.findFirst({ where: { id: chatId, userId } })
      : await prisma.chat.create({
          data: { userId, title: clean.slice(0, 60) || "Nuevo chat" }
        });

  if (!chat) throw new Error("Chat not found");

  await prisma.message.create({
    data: { chatId: chat.id, sender: "USER", content: clean }
  });

  await rememberFromText(userId, clean);

  const [messages, memories] = await Promise.all([
    prisma.message.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: "desc" },
      take: 20
    }),
    getMemories(userId)
  ]);

  const reply = await generateReply({ messages: messages.reverse(), memories });

  const assistantMessage = await prisma.message.create({
    data: { chatId: chat.id, sender: "ASSISTANT", content: reply }
  });

  await prisma.chat.update({
    where: { id: chat.id },
    data: { updatedAt: new Date() }
  });

  return { chatId: chat.id, message: assistantMessage };
}

