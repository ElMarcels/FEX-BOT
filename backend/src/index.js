import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config.js";
import { adminRouter } from "./routes/admin.js";
import { authRouter } from "./routes/auth.js";
import { chatsRouter } from "./routes/chats.js";
import { googleRouter } from "./routes/google.js";
import { memoryRouter } from "./routes/memory.js";
import { organizationRouter } from "./routes/organization.js";
import { telegramRouter } from "./telegram/webhook.js";
import { globalLimiter } from "./middleware/rateLimits.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));
app.use(globalLimiter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, name: "Fex", status: "ready" });
});

app.use("/api/auth", authRouter);
app.use("/api/auth", googleRouter);
app.use("/api/chats", chatsRouter);
app.use("/api", organizationRouter);
app.use("/api/memory", memoryRouter);
app.use("/api/admin", adminRouter);
app.use("/api/telegram", telegramRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(config.port, () => {
  console.log(`Fex API listening on ${config.port}`);
});

