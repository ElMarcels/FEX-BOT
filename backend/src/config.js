import "dotenv/config";

export const config = {
  port: Number(process.env.PORT || 3001),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "dev-only-secret",
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
  telegramWebhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET || "",
  aiProvider: process.env.AI_PROVIDER || "ollama",
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  ollamaModel: process.env.OLLAMA_MODEL || "qwen2.5-coder:7b",
  compatibleBaseUrl: process.env.OPENAI_COMPATIBLE_BASE_URL || "",
  compatibleApiKey: process.env.OPENAI_COMPATIBLE_API_KEY || "",
  compatibleModel: process.env.OPENAI_COMPATIBLE_MODEL || ""
};

