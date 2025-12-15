import express, { Request, Response } from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";
import logger from "./logger";
import sql from "./db";

const app = express();
const PORT = 4000;

// ---------------- Middleware ----------------

app.use(cors({ origin: "*" }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    logger.info(
      `${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - start}ms)`
    );
  });

  next();
});

// ---------------- Types ----------------

type Room = {
  id: string;
  code: string;
  language: string;
};

// ---------------- Helpers ----------------

async function ensureRoom(roomId: string): Promise<Room> {
  const rows = await sql<Room[]>`
    SELECT * FROM rooms WHERE id = ${roomId};
  `;

  if (rows.length > 0) return rows[0];

  logger.warn(`Room not found → creating ${roomId}`);

  const created = await sql<Room[]>`
    INSERT INTO rooms (id, code, language)
    VALUES (${roomId}, '', 'plaintext')
    RETURNING *;
  `;

  return created[0];
}

// ---------------- Routes ----------------

// Create room
app.post("/api/rooms", async (req: Request, res: Response) => {
  try {
    const name = req.body?.name as string | undefined;

    const roomId =
      name?.trim().toUpperCase() || uuid().slice(0, 6).toUpperCase();

    await ensureRoom(roomId);

    logger.success(`Room ready: ${roomId}`);
    res.json({ roomId });
  } catch (err) {
    logger.error("POST /api/rooms failed", err);
    res.status(500).json({ error: "Failed to create room" });
  }
});

// Get room
app.get("/api/rooms/:roomId", async (req: Request, res: Response) => {
  try {
    const room = await ensureRoom(req.params.roomId);

    res.json({
      code: room.code,
      language: room.language,
    });
  } catch (err) {
    logger.error("GET /api/rooms failed", err);
    res.status(500).json({ error: "Failed to load room" });
  }
});

// Update room
app.put("/api/rooms/:roomId", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { code, language } = req.body as Partial<Room>;

    const existing = await ensureRoom(roomId);

    await sql`
      UPDATE rooms
      SET
        code = ${code ?? existing.code},
        language = ${language ?? existing.language},
        updated_at = now()
      WHERE id = ${roomId};
    `;

    logger.info(`Room updated: ${roomId}`);
    res.json({ success: true });
  } catch (err) {
    logger.error("PUT /api/rooms failed", err);
    res.status(500).json({ error: "Failed to update room" });
  }
});

// ---------------- Server ----------------
app.listen(PORT, () => {
  logger.start(`🚀 Backend running at http://localhost:${PORT}`);
});
