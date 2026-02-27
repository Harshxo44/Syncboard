import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  assignees: string[];
  dueDate?: string;
  comments: Comment[];
  columnId: string;
  order: number;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
  cards: Card[];
}

export interface Workspace {
  id: string;
  name: string;
  boards: Board[];
}

interface BoardState {
  currentUser: User;
  onlineUsers: User[];
  workspaces: Workspace[];
  currentWorkspaceId: string;
  currentBoardId: string;
  setCurrentWorkspace: (workspaceId: string) => void;
  setCurrentBoard: (boardId: string) => void;
  addWorkspace: (name: string) => string;
  addBoard: (name: string) => void;
  addColumn: (boardId: string, title: string) => void;
  addCard: (boardId: string, columnId: string, title: string) => void;
  updateCard: (boardId: string, cardId: string, updates: Partial<Card>) => void;
  moveCard: (boardId: string, cardId: string, newColumnId: string, newOrder: number) => void;
  deleteCard: (boardId: string, cardId: string) => void;
  addComment: (boardId: string, cardId: string, content: string) => void;
  simulateUserActivity: () => void;
  getCurrentWorkspace: () => Workspace | undefined;
  getCurrentBoard: () => Board | undefined;
}

const DEMO_USERS: User[] = [
  { id: '1', name: 'You', avatar: '👤', color: '#3b82f6' },
  { id: '2', name: 'Sarah Chen', avatar: '👩‍💼', color: '#8b5cf6' },
  { id: '3', name: 'Marcus Johnson', avatar: '👨‍💻', color: '#10b981' },
  { id: '4', name: 'Emma Wilson', avatar: '👩‍🎨', color: '#f59e0b' },
];

const createInitialBoard = (): Board => ({
  id: '1',
  name: 'Product Roadmap Q1 2026',
  columns: [
    { id: 'col-1', title: 'To Do', order: 0 },
    { id: 'col-2', title: 'In Progress', order: 1 },
    { id: 'col-3', title: 'In Review', order: 2 },
    { id: 'col-4', title: 'Done', order: 3 },
  ],
  cards: [
    {
      id: 'card-1',
      title: 'Design new dashboard layout',
      description: 'Create mockups for the analytics dashboard with improved data visualization',
      assignees: ['2'],
      dueDate: '2026-03-15',
      comments: [
        { id: 'c1', userId: '2', content: 'Started working on the wireframes!', createdAt: '2026-02-26T10:30:00Z' }
      ],
      columnId: 'col-2',
      order: 0,
    },
    {
      id: 'card-2',
      title: 'Implement user authentication',
      description: 'Set up OAuth providers and session management',
      assignees: ['3'],
      dueDate: '2026-03-10',
      comments: [],
      columnId: 'col-2',
      order: 1,
    },
    {
      id: 'card-3',
      title: 'Write API documentation',
      description: 'Document all REST endpoints with examples',
      assignees: ['4'],
      comments: [],
      columnId: 'col-1',
      order: 0,
    },
    {
      id: 'card-4',
      title: 'User research interviews',
      description: 'Conduct 10 user interviews to gather feedback',
      assignees: ['2', '4'],
      dueDate: '2026-03-05',
      comments: [
        { id: 'c2', userId: '4', content: 'Completed 7 out of 10 interviews', createdAt: '2026-02-25T14:20:00Z' },
        { id: 'c3', userId: '2', content: 'Great insights so far!', createdAt: '2026-02-25T15:00:00Z' }
      ],
      columnId: 'col-3',
      order: 0,
    },
    {
      id: 'card-5',
      title: 'Set up CI/CD pipeline',
      description: 'Configure automated testing and deployment',
      assignees: ['3'],
      comments: [],
      columnId: 'col-4',
      order: 0,
    },
    {
      id: 'card-6',
      title: 'Mobile responsive design',
      description: 'Ensure all pages work perfectly on mobile devices',
      assignees: ['1'],
      dueDate: '2026-03-20',
      comments: [],
      columnId: 'col-1',
      order: 1,
    },
  ],
});

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      currentUser: DEMO_USERS[0],
      onlineUsers: [DEMO_USERS[0], DEMO_USERS[1], DEMO_USERS[2]],
      workspaces: [
        {
          id: '1',
          name: 'Default Workspace',
          boards: [createInitialBoard()],
        },
      ],
      currentWorkspaceId: '1',
      currentBoardId: '1',

      setCurrentWorkspace: (workspaceId) => {
        const workspace = get().workspaces.find((w) => w.id === workspaceId);
        if (workspace) {
          // Set the first board of this workspace as current, or empty string if no boards
          const firstBoard = workspace.boards[0];
          set({ 
            currentWorkspaceId: workspaceId,
            currentBoardId: firstBoard ? firstBoard.id : ''
          });
        }
      },

      setCurrentBoard: (boardId) => set({ currentBoardId: boardId }),

      addWorkspace: (name) => {
        const newWorkspace: Workspace = {
          id: Date.now().toString(),
          name,
          boards: [],
        };
        set((state) => ({
          workspaces: [...state.workspaces, newWorkspace],
          currentWorkspaceId: newWorkspace.id,
          currentBoardId: '', // Reset board selection when switching to empty workspace
        }));
        return newWorkspace.id;
      },

      addBoard: (name) => {
        const newBoard: Board = {
          id: Date.now().toString(),
          name,
          columns: [
            { id: `col-${Date.now()}-1`, title: 'To Do', order: 0 },
            { id: `col-${Date.now()}-2`, title: 'In Progress', order: 1 },
            { id: `col-${Date.now()}-3`, title: 'Done', order: 2 },
          ],
          cards: [],
        };
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === state.currentWorkspaceId
              ? {
                  ...workspace,
                  boards: [...workspace.boards, newBoard],
                }
              : workspace
          ),
          currentBoardId: newBoard.id,
        }));
      },

      addColumn: (boardId, title) => {
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === state.currentWorkspaceId
              ? {
                  ...workspace,
                  boards: workspace.boards.map((board) =>
                    board.id === boardId
                      ? {
                          ...board,
                          columns: [
                            ...board.columns,
                            {
                              id: `col-${Date.now()}`,
                              title,
                              order: board.columns.length,
                            },
                          ],
                        }
                      : board
                  ),
                }
              : workspace
          ),
        }));
      },

      addCard: (boardId, columnId, title) => {
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === state.currentWorkspaceId
              ? {
                  ...workspace,
                  boards: workspace.boards.map((board) => {
                    if (board.id !== boardId) return board;
                    const cardsInColumn = board.cards.filter((c) => c.columnId === columnId);
                    const newCard: Card = {
                      id: `card-${Date.now()}`,
                      title,
                      assignees: [state.currentUser.id],
                      comments: [],
                      columnId,
                      order: cardsInColumn.length,
                    };
                    return { ...board, cards: [...board.cards, newCard] };
                  }),
                }
              : workspace
          ),
        }));
      },

      updateCard: (boardId, cardId, updates) => {
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === state.currentWorkspaceId
              ? {
                  ...workspace,
                  boards: workspace.boards.map((board) =>
                    board.id === boardId
                      ? {
                          ...board,
                          cards: board.cards.map((card) =>
                            card.id === cardId ? { ...card, ...updates } : card
                          ),
                        }
                      : board
                  ),
                }
              : workspace
          ),
        }));
      },

      moveCard: (boardId, cardId, newColumnId, newOrder) => {
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === state.currentWorkspaceId
              ? {
                  ...workspace,
                  boards: workspace.boards.map((board) => {
                    if (board.id !== boardId) return board;

                    const card = board.cards.find((c) => c.id === cardId);
                    if (!card) return board;

                    const oldColumnId = card.columnId;
                    let updatedCards = board.cards.map((c) => ({ ...c }));

                    // Remove from old position
                    if (oldColumnId === newColumnId) {
                      // Same column - reorder
                      const cardsInColumn = updatedCards
                        .filter((c) => c.columnId === newColumnId)
                        .sort((a, b) => a.order - b.order);

                      const oldIndex = cardsInColumn.findIndex((c) => c.id === cardId);
                      cardsInColumn.splice(oldIndex, 1);
                      cardsInColumn.splice(newOrder, 0, card);

                      cardsInColumn.forEach((c, idx) => {
                        const cardToUpdate = updatedCards.find((uc) => uc.id === c.id);
                        if (cardToUpdate) cardToUpdate.order = idx;
                      });
                    } else {
                      // Different column - move
                      const oldColumnCards = updatedCards
                        .filter((c) => c.columnId === oldColumnId && c.id !== cardId)
                        .sort((a, b) => a.order - b.order);
                      oldColumnCards.forEach((c, idx) => {
                        const cardToUpdate = updatedCards.find((uc) => uc.id === c.id);
                        if (cardToUpdate) cardToUpdate.order = idx;
                      });

                      const newColumnCards = updatedCards
                        .filter((c) => c.columnId === newColumnId)
                        .sort((a, b) => a.order - b.order);
                      newColumnCards.splice(newOrder, 0, card);
                      newColumnCards.forEach((c, idx) => {
                        const cardToUpdate = updatedCards.find((uc) => uc.id === c.id);
                        if (cardToUpdate) {
                          cardToUpdate.order = idx;
                          cardToUpdate.columnId = newColumnId;
                        }
                      });
                    }

                    return { ...board, cards: updatedCards };
                  }),
                }
              : workspace
          ),
        }));
      },

      deleteCard: (boardId, cardId) => {
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === state.currentWorkspaceId
              ? {
                  ...workspace,
                  boards: workspace.boards.map((board) =>
                    board.id === boardId
                      ? { ...board, cards: board.cards.filter((c) => c.id !== cardId) }
                      : board
                  ),
                }
              : workspace
          ),
        }));
      },

      addComment: (boardId, cardId, content) => {
        const newComment: Comment = {
          id: `comment-${Date.now()}`,
          userId: get().currentUser.id,
          content,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === state.currentWorkspaceId
              ? {
                  ...workspace,
                  boards: workspace.boards.map((board) =>
                    board.id === boardId
                      ? {
                          ...board,
                          cards: board.cards.map((card) =>
                            card.id === cardId
                              ? { ...card, comments: [...card.comments, newComment] }
                              : card
                          ),
                        }
                      : board
                  ),
                }
              : workspace
          ),
        }));
      },

      simulateUserActivity: () => {
        const currentOnline = get().onlineUsers;
        const allUsers = DEMO_USERS;
        
        // Randomly add/remove users to simulate presence
        const shouldChange = Math.random() > 0.7;
        if (shouldChange) {
          const available = allUsers.filter(u => !currentOnline.find(cu => cu.id === u.id));
          if (available.length > 0 && currentOnline.length < 4) {
            set({ onlineUsers: [...currentOnline, available[0]] });
          } else if (currentOnline.length > 1) {
            const filtered = currentOnline.filter((_, i) => i !== Math.floor(Math.random() * currentOnline.length));
            set({ onlineUsers: filtered });
          }
        }
      },

      getCurrentWorkspace: () => {
        const currentWorkspaceId = get().currentWorkspaceId;
        return get().workspaces.find((workspace) => workspace.id === currentWorkspaceId);
      },

      getCurrentBoard: () => {
        const currentBoardId = get().currentBoardId;
        const currentWorkspace = get().getCurrentWorkspace();
        if (!currentWorkspace) return undefined;
        return currentWorkspace.boards.find((board) => board.id === currentBoardId);
      },
    }),
    {
      name: 'board-storage',
    }
  )
);

export const ALL_USERS = DEMO_USERS;