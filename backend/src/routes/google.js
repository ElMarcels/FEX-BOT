import { OAuth2Client } from "google-auth-library";
import { Router } from "express";
import { prisma } from "../lib/db.js";
import { signUser } from "../middleware/auth.js";
import { config } from "../config.js";

export const googleRouter = Router();

const client = new OAuth2Client(config.googleClientId);

googleRouter.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: "Missing Google credential" });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: config.googleClientId
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || email?.split("@")[0] || `user_${googleId.slice(0, 8)}`;

    let user = await prisma.user.findFirst({
      where: { OR: [{ telegramId: googleId }, { email: email?.toLowerCase() }] }
    });

    if (!user) {
      let username = name.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing) username = `${username}_${googleId.slice(0, 4)}`;

      user = await prisma.user.create({
        data: {
          username,
          email: email?.toLowerCase(),
          telegramId: googleId,
          telegramName: name
        }
      });
    }

    res.json({ token: signUser(user), user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(401).json({ error: "Invalid Google credential" });
  }
});
