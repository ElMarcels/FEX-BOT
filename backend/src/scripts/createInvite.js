import "dotenv/config";
import { prisma } from "../lib/db.js";

const codeArg = process.argv.find((arg) => arg.startsWith("--code="));
const maxUsesArg = process.argv.find((arg) => arg.startsWith("--maxUses="));
const code = codeArg?.split("=")[1];

if (!code) {
  console.error("Usage: npm run invite -- --code=FEX-PRIVATE-001 [--maxUses=10]");
  process.exit(1);
}

const invite = await prisma.invite.upsert({
  where: { code },
  update: { active: true },
  create: { code, maxUses: maxUsesArg ? Number(maxUsesArg.split("=")[1]) : null }
});

console.log(`Invite ready: ${invite.code}`);
await prisma.$disconnect();

