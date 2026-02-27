# SyncBoard

SyncBoard is a real-time collaborative Kanban-style task management application built with a modern full-stack architecture. It enables multiple users to create, organize, and manage tasks across boards with instant synchronization.

This project simulates a production-level collaborative SaaS product and focuses on real-time state management, scalable architecture, and polished user experience.

---

## Overview

SyncBoard allows teams to:

- Create multiple workspaces and boards
- Organize tasks into workflow columns
- Drag and drop cards between columns
- Edit task details in modal views
- Comment in real-time
- See live updates from other users
- Track user presence on boards

The system is designed with real-time collaboration and performance in mind.

---

## Core Features

### Authentication

- Secure sign up and login
- Protected routes
- Session management

### Workspaces and Boards

- Multiple boards per workspace
- Multi-user collaboration
- Persistent storage

### Kanban System

- Create, edit, delete columns
- Create, edit, delete task cards
- Drag-and-drop functionality
- Ordered positioning logic

### Card Details

- Title and description
- Due dates
- Assignees
- Real-time comments

### Real-Time Collaboration

- Instant UI updates across users
- Optimistic UI handling
- Presence indicators

### UI/UX

- Responsive layout
- Dark mode support
- Accessible components
- Loading states and skeletons

---

## Tech Stack

### Frontend

- Next.js (App Router)
- React
- Tailwind CSS
- shadcn/ui
- Zustand (state management)
- @dnd-kit (drag and drop)

### Backend / Realtime

- Supabase or Liveblocks (WebSocket-based sync)
- PostgreSQL

### Deployment

- Vercel

---

## Architecture

Client → Realtime Layer → Database

- Optimistic UI updates on interaction
- Real-time broadcast via WebSockets
- Persistent storage in PostgreSQL
- Multi-user synchronization

---

## Data Model

Main entities:

- Users
- Workspaces
- Boards
- Columns
- Cards
- Comments

The schema is designed to support ordering, multi-tenancy, and scalable collaboration.

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/syncboard.git
cd syncboard
```
