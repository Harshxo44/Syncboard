import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { useBoardStore } from '../store/board-store';
import { useAuthStore } from '../store/auth-store';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { Avatar } from './ui/avatar';
import { useState } from 'react';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { LayoutGrid, Plus, Users, Sun, Moon, Share2, Link2, StickyNote, LogOut, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { PrivateNotes } from './private-notes';

export function Header() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { 
    getCurrentWorkspace, 
    getCurrentBoard, 
    setCurrentBoard, 
    addBoard, 
    addWorkspace,
    onlineUsers,
    workspaces,
    setCurrentWorkspace,
  } = useBoardStore();
  const { theme, setTheme } = useTheme();
  const [showNewBoardDialog, setShowNewBoardDialog] = useState(false);
  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  const currentWorkspace = getCurrentWorkspace();
  const currentBoard = getCurrentBoard();
  const workspaceLink = `${window.location.origin}/workspace/${workspaceId}`;

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      addBoard(newBoardName);
      toast.success('Board created successfully!');
      setNewBoardName('');
      setShowNewBoardDialog(false);
    }
  };

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim()) {
      const newWorkspaceId = addWorkspace(newWorkspaceName);
      toast.success('Workspace created successfully!');
      setNewWorkspaceName('');
      setShowNewWorkspaceDialog(false);
      navigate(`/workspace/${newWorkspaceId}`);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(workspaceLink);
    toast.success('Workspace link copied to clipboard!');
  };

  const handleSwitchWorkspace = (id: string) => {
    setCurrentWorkspace(id);
    navigate(`/workspace/${id}`);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <>
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LayoutGrid className="size-5 sm:size-6 text-blue-600 dark:text-blue-500 flex-shrink-0" />
            <span className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 hidden sm:inline">TaskFlow</span>
          </div>

          <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />

          {/* Workspace Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 sm:gap-2 text-sm sm:text-base px-2 sm:px-4 max-w-[120px] sm:max-w-none">
                <span className="truncate">{currentWorkspace?.name}</span>
                <svg className="size-3 sm:size-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => handleSwitchWorkspace(workspace.id)}
                  className={workspaceId === workspace.id ? 'bg-slate-100 dark:bg-slate-800' : ''}
                >
                  {workspace.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowNewWorkspaceDialog(true)} className="gap-2 text-blue-600 dark:text-blue-500">
                <Plus className="size-4" />
                Create new workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />

          {/* Board Selector */}
          {currentBoard && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 sm:gap-2 text-sm sm:text-base px-2 sm:px-4 hidden md:flex">
                  {currentBoard.name}
                  <svg className="size-3 sm:size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Boards</DropdownMenuLabel>
                {currentWorkspace?.boards.map((board) => (
                  <DropdownMenuItem
                    key={board.id}
                    onClick={() => setCurrentBoard(board.id)}
                    className={currentBoard?.id === board.id ? 'bg-slate-100 dark:bg-slate-800' : ''}
                  >
                    {board.name}
                  </DropdownMenuItem>
                ))}
                {currentWorkspace?.boards.length === 0 && (
                  <div className="px-2 py-6 text-center text-sm text-slate-500">
                    No boards yet
                  </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowNewBoardDialog(true)} className="gap-2 text-blue-600 dark:text-blue-500">
                  <Plus className="size-4" />
                  Create new board
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Online Users */}
          <div className="hidden lg:flex items-center gap-1">
            {onlineUsers.slice(0, 3).map((user) => (
              <Avatar key={user.id} user={user} size="sm" showTooltip />
            ))}
            {onlineUsers.length > 3 && (
              <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
                +{onlineUsers.length - 3}
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {currentBoard && (
                <>
                  <DropdownMenuLabel>Current Board</DropdownMenuLabel>
                  <DropdownMenuItem disabled className="text-sm font-medium">
                    {currentBoard.name}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => setShowNewBoardDialog(true)}>
                <Plus className="size-4 mr-2" />
                New Board
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowNewWorkspaceDialog(true)}>
                <Plus className="size-4 mr-2" />
                New Workspace
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
                <Share2 className="size-4 mr-2" />
                Share Workspace
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowNotesDialog(true)}>
                <StickyNote className="size-4 mr-2" />
                Private Notes
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Online Users ({onlineUsers.length})</DropdownMenuLabel>
              {onlineUsers.map((u) => (
                <DropdownMenuItem key={u.id} disabled className="gap-2">
                  <span>{u.avatar}</span>
                  <span className="text-sm">{u.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop Actions */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowNotesDialog(true)}
            className="hidden md:flex"
          >
            <StickyNote className="size-4 sm:size-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowShareDialog(true)}
            className="hidden md:flex"
          >
            <Share2 className="size-4 sm:size-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="size-4 sm:size-5" /> : <Moon className="size-4 sm:size-5" />}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar user={user} size="sm" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem>
                <User className="size-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="size-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* New Board Dialog */}
      <Dialog open={showNewBoardDialog} onOpenChange={setShowNewBoardDialog}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter board name..."
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewBoardDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBoard} disabled={!newBoardName.trim()}>
              Create Board
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Workspace Dialog */}
      <Dialog open={showNewWorkspaceDialog} onOpenChange={setShowNewWorkspaceDialog}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter workspace name..."
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateWorkspace()}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewWorkspaceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkspace} disabled={!newWorkspaceName.trim()}>
              Create Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Workspace Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Share Workspace</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Share this link with your team to collaborate on <strong>{currentWorkspace?.name}</strong>
            </p>
            <div className="flex gap-2">
              <Input
                value={workspaceLink}
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={handleCopyLink} className="gap-2 flex-shrink-0">
                <Link2 className="size-4" />
                Copy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Private Notes Dialog */}
      <PrivateNotes open={showNotesDialog} onOpenChange={setShowNotesDialog} />
    </>
  );
}