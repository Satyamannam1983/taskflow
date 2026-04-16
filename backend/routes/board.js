const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { PrismaLibSQL } = require("@prisma/adapter-libsql");

const adapter = new PrismaLibSQL({
  url: "file:./dev.db"
});

const prisma = new PrismaClient({
  adapter
});

// Create board
router.post("/", async (req, res) => {
  const { title } = req.body;

  const board = await prisma.board.create({
    data: { title },
  });

  res.json(board);
});

// Get board with lists + cards
router.get("/:id", async (req, res) => {
  const board = await prisma.board.findUnique({
    where: { id: req.params.id },
    include: {
      lists: {
        include: {
          cards: true,
        },
        orderBy: { position: "asc" },
      },
    },
  });

  res.json(board);
});

module.exports = router;
