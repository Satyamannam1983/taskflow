const express = require("express");
const cors = require("cors");
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

// Board routes
app.get("/boards", async (req, res) => {
  try {
    const boards = await prisma.board.findMany({
      include: {
        lists: {
          include: {
            cards: true
          }
        }
      }
    });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch boards" });
  }
});

app.post("/boards", async (req, res) => {
  try {
    const { title, description, color } = req.body;
    const board = await prisma.board.create({
      data: {
        title,
        description: description || '',
        color: color || 'blue'
      }
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

app.delete("/boards/:id", async (req, res) => {
  try {
    console.log('Deleting board:', req.params.id);
    await prisma.board.delete({
      where: { id: req.params.id }
    });
    console.log('Board deleted successfully');
    res.json({ message: "Board deleted successfully" });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: "Failed to delete board", details: error.message });
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

app.listen(5000, async () => {
  console.log("Server running on port 5000");
  
  // Test database connection
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});
