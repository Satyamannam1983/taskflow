import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      id: 'user-3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
    },
  })

  console.log('Users created')

  // Create labels
  const bugLabel = await prisma.label.upsert({
    where: { id: 'label-bug' },
    update: {},
    create: {
      id: 'label-bug',
      name: 'Bug',
      color: 'bg-red-500',
    },
  })

  const featureLabel = await prisma.label.upsert({
    where: { id: 'label-feature' },
    update: {},
    create: {
      id: 'label-feature',
      name: 'Feature',
      color: 'bg-green-500',
    },
  })

  const enhancementLabel = await prisma.label.upsert({
    where: { id: 'label-enhancement' },
    update: {},
    create: {
      id: 'label-enhancement',
      name: 'Enhancement',
      color: 'bg-blue-500',
    },
  })

  const documentationLabel = await prisma.label.upsert({
    where: { id: 'label-documentation' },
    update: {},
    create: {
      id: 'label-documentation',
      name: 'Documentation',
      color: 'bg-yellow-500',
    },
  })

  console.log('Labels created')

  // Create board
  const board = await prisma.board.upsert({
    where: { id: 'board-1' },
    update: {},
    create: {
      id: 'board-1',
      title: 'Sprint Board',
      description: 'Agile sprint planning and tracking for development teams',
      color: 'blue',
    },
  })

  console.log('Board created')

  // Create lists
  const todoList = await prisma.list.upsert({
    where: { id: 'list-1' },
    update: {},
    create: {
      id: 'list-1',
      title: 'To Do',
      position: 0,
      boardId: board.id,
    },
  })

  const inProgressList = await prisma.list.upsert({
    where: { id: 'list-2' },
    update: {},
    create: {
      id: 'list-2',
      title: 'In Progress',
      position: 1,
      boardId: board.id,
    },
  })

  const doneList = await prisma.list.upsert({
    where: { id: 'list-3' },
    update: {},
    create: {
      id: 'list-3',
      title: 'Done',
      position: 2,
      boardId: board.id,
    },
  })

  console.log('Lists created')

  // Create cards
  const card1 = await prisma.card.upsert({
    where: { id: 'card-1' },
    update: {},
    create: {
      id: 'card-1',
      title: 'Fix login bug',
      description: 'Mobile login not responsive on small screens',
      position: 0,
      dueDate: new Date('2026-04-22'),
      listId: todoList.id,
    },
  })

  const card2 = await prisma.card.upsert({
    where: { id: 'card-2' },
    update: {},
    create: {
      id: 'card-2',
      title: 'Add dark mode',
      description: 'Implement dark theme for better night usage',
      position: 1,
      dueDate: new Date('2026-04-18'),
      listId: todoList.id,
    },
  })

  const card3 = await prisma.card.upsert({
    where: { id: 'card-3' },
    update: {},
    create: {
      id: 'card-3',
      title: 'Optimize search',
      description: 'Reduce API response time under 500ms',
      position: 2,
      dueDate: new Date('2026-04-17'),
      listId: todoList.id,
    },
  })

  const card4 = await prisma.card.upsert({
    where: { id: 'card-4' },
    update: {},
    create: {
      id: 'card-4',
      title: 'Documentation: Update API docs',
      description: 'Add new endpoints and update existing documentation',
      position: 0,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      listId: inProgressList.id,
    },
  })

  const card5 = await prisma.card.upsert({
    where: { id: 'card-5' },
    update: {},
    create: {
      id: 'card-5',
      title: 'Bug: Memory leak fix',
      description: 'Investigate and fix memory leak in dashboard charts',
      position: 1,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      listId: inProgressList.id,
    },
  })

  const card6 = await prisma.card.upsert({
    where: { id: 'card-6' },
    update: {},
    create: {
      id: 'card-6',
      title: 'Feature: User profile page',
      description: 'Create comprehensive user profile management system',
      position: 0,
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      listId: doneList.id,
    },
  })

  console.log('Cards created')

  // Add labels to cards
  await prisma.cardLabel.upsert({
    where: { cardId_labelId: { cardId: card1.id, labelId: bugLabel.id } },
    update: {},
    create: {
      cardId: card1.id,
      labelId: bugLabel.id,
    },
  })

  await prisma.cardLabel.upsert({
    where: { cardId_labelId: { cardId: card2.id, labelId: enhancementLabel.id } },
    update: {},
    create: {
      cardId: card2.id,
      labelId: enhancementLabel.id,
    },
  })

  await prisma.cardLabel.upsert({
    where: { cardId_labelId: { cardId: card3.id, labelId: enhancementLabel.id } },
    update: {},
    create: {
      cardId: card3.id,
      labelId: enhancementLabel.id,
    },
  })

  await prisma.cardLabel.upsert({
    where: { cardId_labelId: { cardId: card4.id, labelId: documentationLabel.id } },
    update: {},
    create: {
      cardId: card4.id,
      labelId: documentationLabel.id,
    },
  })

  await prisma.cardLabel.upsert({
    where: { cardId_labelId: { cardId: card5.id, labelId: bugLabel.id } },
    update: {},
    create: {
      cardId: card5.id,
      labelId: bugLabel.id,
    },
  })

  await prisma.cardLabel.upsert({
    where: { cardId_labelId: { cardId: card6.id, labelId: featureLabel.id } },
    update: {},
    create: {
      cardId: card6.id,
      labelId: featureLabel.id,
    },
  })

  console.log('Card labels created')

  // Add members to cards
  await prisma.cardMember.upsert({
    where: { cardId_userId: { cardId: card1.id, userId: user1.id } },
    update: {},
    create: {
      cardId: card1.id,
      userId: user1.id,
    },
  })

  await prisma.cardMember.upsert({
    where: { cardId_userId: { cardId: card2.id, userId: user2.id } },
    update: {},
    create: {
      cardId: card2.id,
      userId: user2.id,
    },
  })

  await prisma.cardMember.upsert({
    where: { cardId_userId: { cardId: card3.id, userId: user3.id } },
    update: {},
    create: {
      cardId: card3.id,
      userId: user3.id,
    },
  })

  await prisma.cardMember.upsert({
    where: { cardId_userId: { cardId: card4.id, userId: user1.id } },
    update: {},
    create: {
      cardId: card4.id,
      userId: user1.id,
    },
  })

  await prisma.cardMember.upsert({
    where: { cardId_userId: { cardId: card4.id, userId: user2.id } },
    update: {},
    create: {
      cardId: card4.id,
      userId: user2.id,
    },
  })

  await prisma.cardMember.upsert({
    where: { cardId_userId: { cardId: card5.id, userId: user3.id } },
    update: {},
    create: {
      cardId: card5.id,
      userId: user3.id,
    },
  })

  await prisma.cardMember.upsert({
    where: { cardId_userId: { cardId: card6.id, userId: user1.id } },
    update: {},
    create: {
      cardId: card6.id,
      userId: user1.id,
    },
  })

  console.log('Card members created')

  // Add checklist to card1
  const checklist1 = await prisma.checklist.upsert({
    where: { id: 'checklist-1' },
    update: {},
    create: {
      id: 'checklist-1',
      title: 'Mobile Fixes',
      cardId: card1.id,
    },
  })

  await prisma.checklistItem.upsert({
    where: { id: 'checklist-item-1' },
    update: {},
    create: {
      id: 'checklist-item-1',
      content: 'Fix responsive layout on mobile',
      isCompleted: true,
      checklistId: checklist1.id,
    },
  })

  await prisma.checklistItem.upsert({
    where: { id: 'checklist-item-2' },
    update: {},
    create: {
      id: 'checklist-item-2',
      content: 'Test on iOS devices',
      isCompleted: false,
      checklistId: checklist1.id,
    },
  })

  await prisma.checklistItem.upsert({
    where: { id: 'checklist-item-3' },
    update: {},
    create: {
      id: 'checklist-item-3',
      content: 'Test on Android devices',
      isCompleted: false,
      checklistId: checklist1.id,
    },
  })

  console.log('Checklist created')

  // Add comment to card4
  await prisma.comment.upsert({
    where: { id: 'comment-1' },
    update: {},
    create: {
      id: 'comment-1',
      content: 'Started working on the API documentation. Need to review the new endpoints.',
      cardId: card4.id,
      authorId: user1.id,
    },
  })

  console.log('Comment created')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
