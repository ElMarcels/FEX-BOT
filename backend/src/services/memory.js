import { prisma } from "../lib/db.js";

const MEMORY_PATTERNS = [
  { key: "preferred_language", re: /(?:prefiero|me gusta|quiero).*?(javascript|typescript|python|java|c\+\+|rust|go|php)/i },
  { key: "framework", re: /(?:uso|trabajo con|mi stack es).*?(react|next\.?js|vue|angular|express|nestjs|spring|laravel|django)/i },
  { key: "goal", re: /(?:quiero crear|estoy creando|mi proyecto es)\s+(.{4,120})/i }
];

export async function rememberFromText(userId, text) {
  for (const pattern of MEMORY_PATTERNS) {
    const match = text.match(pattern.re);
    if (!match) continue;
    await prisma.memory.upsert({
      where: { userId_key: { userId, key: pattern.key } },
      update: { value: match[1] },
      create: { userId, key: pattern.key, value: match[1] }
    });
  }
}

export async function getMemories(userId) {
  return prisma.memory.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 25
  });
}

