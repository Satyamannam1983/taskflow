# TaskFlow - Kanban Project Management Application

A Trello-inspired Kanban-style project management web application built with Next.js, Express.js, and PostgreSQL.

## Tech Stack

### Frontend
- **Framework**: Next.js 13+ (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Drag & Drop**: Native HTML5 Drag and Drop API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL

## Core Features

### Board Management
- Create boards with title, description, and color
- View all boards with their lists and cards
- Multiple boards support

### List Management
- Create, edit, and delete lists
- Drag and drop to reorder lists
- Visual color coding by position

### Card Management
- Create cards with title and description
- Edit card title and description
- Archive cards (soft delete)
- Drag and drop cards between lists
- Drag and drop to reorder cards within a list

### Card Details
- **Labels**: Colored tags for categorization (Bug, Feature, Enhancement, Documentation)
- **Due Dates**: Set due dates on cards
- **Checklists**: Add checklists with items that can be marked as complete/incomplete
- **Members**: Assign team members to cards

### Search & Filter
- Search cards by title
- Filter cards by labels, members, or due date
- Filter boards by color
- Sort boards by various criteria

## Database Schema

The application uses PostgreSQL with the following main entities:

- **User**: Team members who can be assigned to cards
- **Board**: Project boards containing lists and cards
- **List**: Columns within boards (e.g., To Do, In Progress, Done)
- **Card**: Tasks within lists
- **Label**: Colored tags for categorizing cards
- **CardLabel**: Many-to-many relationship between cards and labels
- **CardMember**: Many-to-many relationship between cards and users
- **Checklist**: Checklists attached to cards
- **ChecklistItem**: Items within checklists
- **Comment**: Comments on cards
- **Attachment**: File attachments on cards

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/Satyamannam1983/taskflow.git
cd taskflow
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow?schema=public"

# Backend
PORT=5000
NODE_ENV=development

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Setup Database

#### Create PostgreSQL Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE taskflow;

# Exit
\q
```

#### Run Prisma Migrations
```bash
cd backend
npx prisma migrate dev --name init
```

#### Seed Database with Sample Data
```bash
npm run seed
```

### 5. Start Development Servers

#### Backend
```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

#### Frontend
```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

## Project Structure

```
taskflow/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Database seeding script
│   ├── index.js             # Express server
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── boards/          # Boards page
│   │   ├── kanban/          # Kanban board page
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   ├── auth/            # Authentication components
│   │   ├── design-system/   # Design system components
│   │   └── layout/          # Layout components
│   ├── lib/
│   │   └── data.ts          # Centralized data management
│   └── package.json
├── .env.example             # Example environment variables
├── vercel.json              # Deployment configuration
└── README.md
```

## API Endpoints

### Boards
- `GET /boards` - Get all boards
- `POST /boards` - Create a new board
- `DELETE /boards/:id` - Delete a board

### Lists
- `GET /boards/:boardId/lists` - Get all lists for a board
- `POST /lists` - Create a new list
- `PUT /lists/:id` - Update a list
- `DELETE /lists/:id` - Delete a list

### Cards
- `GET /lists/:listId/cards` - Get all cards for a list
- `POST /cards` - Create a new card
- `PUT /cards/:id` - Update a card
- `DELETE /cards/:id` - Delete a card

## Features Implemented

### Core Features (Required)
- ✅ Board Management (Create, View)
- ✅ List Management (Create, Edit, Delete, Drag & Drop Reorder)
- ✅ Card Management (Create, Edit, Delete, Archive, Drag & Drop)
- ✅ Card Details (Labels, Due Dates, Checklists, Members)
- ✅ Search & Filter (Search by title, Filter by labels/members/due date)

### Bonus Features
- ✅ Multiple boards support
- ✅ Responsive design (mobile, tablet, desktop)
- ⏳ File attachments on cards (Schema ready, UI pending)
- ⏳ Comments and activity log on cards (Schema ready, UI pending)
- ⏳ Card covers (images) (Schema ready, UI pending)
- ⏳ Board background customization (Schema ready, UI pending)

## Deployment

The application is configured for deployment on Render using `render.yaml`.

### Environment Variables for Production
- `DATABASE_URL`: PostgreSQL connection string (Render provides this automatically)
- `PORT`: Backend port (default: 5000)
- `NODE_ENV`: Set to `production`
- `NEXT_PUBLIC_API_URL`: Backend API URL (Render provides this automatically)

### Deploy to Render

#### Backend Deployment
1. Push your code to GitHub
2. Go to [Render.com](https://render.com) and sign up/login
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Select the `backend` folder as the root directory
6. Configure:
   - Name: `taskflow-backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `node index.js`
   - Environment Variables: Add `DATABASE_URL` (Render will provide this from the database)
7. Create a PostgreSQL database:
   - Click "New +" → "PostgreSQL"
   - Name it `taskflow-db`
   - Link it to your backend service
8. Deploy!

#### Frontend Deployment
1. Click "New +" → "Web Service"
2. Select the `frontend` folder as the root directory
3. Configure:
   - Name: `taskflow-frontend`
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables: Add `NEXT_PUBLIC_API_URL` (your backend Render URL)
4. Deploy!

### Alternative: Using render.yaml
The repository includes a `render.yaml` file for automated deployment. Render will automatically detect this configuration when you connect your repository.

## Assumptions

1. **No Login Required**: The application assumes a default user is logged in. Sample users are seeded in the database for assignment functionality.

2. **Database**: PostgreSQL is used as the database (as per requirements). The schema is designed with proper relationships and cascading deletes.

3. **Drag & Drop**: Uses native HTML5 Drag and Drop API for simplicity and performance.

4. **Sample Data**: The database is seeded with sample boards, lists, cards, labels, users, checklists, and comments to demonstrate functionality.

5. **UI Design**: The application closely follows Trello's design patterns with a modern, clean interface using Tailwind CSS.

## Original Work

This is an original implementation created for this project. All code was written from scratch following the provided specifications and Trello's UI patterns.

## License

ISC
