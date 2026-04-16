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

// Create list
router.post("/", async (req, res) => {
  const { title, boardId } = req.body;

  const list = await prisma.list.create({
    data: {
      title,
      position: 0,
      boardId,
    },
  });

  res.json(list);
});

// Get lists by board
router.get("/:boardId", async (req, res) => {
  const lists = await prisma.list.findMany({
    where: { boardId: req.params.boardId },
    orderBy: { position: "asc" },
  });

  res.json(lists);
});

// Delete list
router.delete("/:id", async (req, res) => {
  await prisma.list.delete({
    where: { id: req.params.id },
  });

  res.json({ message: "Deleted" });
});

module.exports = router;
