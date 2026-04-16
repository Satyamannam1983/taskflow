const express = require("express");
const cors = require("cors");
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());

// For production, use Vercel Postgres or other cloud database
// For development, use local SQLite
const isProduction = process.env.NODE_ENV === 'production';
let prisma;

if (isProduction) {
  // Use Vercel Postgres or other production database
  prisma = new PrismaClient();
} else {
  // Use SQLite for development
  const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
  prisma = new PrismaClient({ adapter });
}

// Board routes
app.post("/boards", async (req, res) => {
  try {
    const { title } = req.body;
    const board = await prisma.board.create({
      data: { title }
    });
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: "Failed to create board" });
  }
});

app.get("/boards/:id", async (req, res) => {
  try {
    const board = await prisma.board.findUnique({
      where: { id: req.params.id },
      include: {
        lists: {
          include: {
            cards: true
          }
        }
      }
    });
    
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch board" });
  }
});

// List routes
app.post("/lists", async (req, res) => {
  try {
    const { title, boardId } = req.body;
    const list = await prisma.list.create({
      data: {
        title,
        position: 0,
        boardId
      }
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to create list" });
  }
});

app.get("/lists/:boardId", async (req, res) => {
  try {
    const boardLists = await prisma.list.findMany({
      where: { boardId: req.params.boardId }
    });
    res.json(boardLists);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lists" });
  }
});

app.delete("/lists/:id", async (req, res) => {
  try {
    await prisma.list.delete({
      where: { id: req.params.id }
    });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete list" });
  }
});

app.get("/", (req, res) => {
  res.send("API running");
});

// Export for Vercel
module.exports = app;
