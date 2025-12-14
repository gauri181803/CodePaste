import express, { Request, Response } from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// ---------------- Types ----------------
type Room = {
  code: string;
  language: string;
};

// In-memory room store
const rooms: Record<string, Room> = {};

// ---------------- Routes ----------------

// Create or get room
app.post("/api/rooms", (req: Request, res: Response) => {
  const { name } = req.body as { name?: string };

  const roomId =
    name?.trim().toUpperCase() || uuid().slice(0, 6).toUpperCase();

  if (!rooms[roomId]) {
    rooms[roomId] = {
      code: "",
      language: "plaintext",
    };
  }

  res.status(200).json({ roomId });
});

// Get room data
app.get("/api/rooms/:roomId", (req: Request, res: Response) => {
  const { roomId } = req.params;

  if (!rooms[roomId]) {
    rooms[roomId] = {
      code: "",
      language: "plaintext",
    };
  }

  res.status(200).json(rooms[roomId]);
});

// Update room
app.put("/api/rooms/:roomId", (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { code, language } = req.body as Partial<Room>;

  if (!rooms[roomId]) {
    rooms[roomId] = {
      code: "",
      language: "plaintext",
    };
  }

  if (typeof code === "string") {
    rooms[roomId].code = code;
  }

  if (typeof language === "string") {
    rooms[roomId].language = language;
  }

  res.status(200).json({ success: true });
});

// ---------------- Server ----------------
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
