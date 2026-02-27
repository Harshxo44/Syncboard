import { useBoardStore } from '../store/board-store';
import { BoardColumn } from '../components/board-column';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router';

export function BoardPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { getCurrentBoard, addColumn, simulateUserActivity, setCurrentWorkspace, currentWorkspaceId, workspaces } = useBoardStore();
  const [showNewColumnDialog, setShowNewColumnDialog] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  // Set workspace from URL
  useEffect(() => {
    if (workspaceId && workspaceId !== currentWorkspaceId) {
      // Check if workspace exists
      const workspace = workspaces.find((w) => w.id === workspaceId);
      if (workspace) {
        setCurrentWorkspace(workspaceId);
      } else {
        // Workspace doesn't exist, redirect to current workspace
        navigate(`/workspace/${currentWorkspaceId}`, { replace: true });
      }
    }
  }, [workspaceId, currentWorkspaceId, setCurrentWorkspace, workspaces, navigate]);

  const currentBoard = getCurrentBoard();

  // Simulate user presence activity
  useEffect(() => {
    const interval = setInterval(() => {
      simulateUserActivity();
    }, 5000);
    return () => clearInterval(interval);
  }, [simulateUserActivity]);

  const handleCreateColumn = () => {
    if (newColumnName.trim() && currentBoard) {
      addColumn(currentBoard.id, newColumnName);
      toast.success('Column created successfully!');
      setNewColumnName('');
      setShowNewColumnDialog(false);
    }
  };

  if (!currentBoard) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="text-6xl">📋</div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            No Board Selected
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Create your first board to start organizing your tasks and collaborating with your team.
          </p>
        </div>
      </div>
    );
  }

  const sortedColumns = [...currentBoard.columns].sort((a, b) => a.order - b.order);

  return (
    <>
      <div className="h-full overflow-x-auto overflow-y-hidden">
        <div className="h-full p-3 sm:p-4 md:p-6 flex gap-3 md:gap-4 min-w-min pb-4">
          {sortedColumns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              cards={currentBoard.cards.filter((c) => c.columnId === column.id).sort((a, b) => a.order - b.order)}
              boardId={currentBoard.id}
            />
          ))}

          <button
            onClick={() => setShowNewColumnDialog(true)}
            className="flex-shrink-0 w-[280px] sm:w-72 h-fit bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg p-4 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors border-2 border-dashed border-slate-300 dark:border-slate-600"
          >
            <Plus className="size-5" />
            <span className="font-medium">Add Column</span>
          </button>
        </div>
      </div>

      <Dialog open={showNewColumnDialog} onOpenChange={setShowNewColumnDialog}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Create New Column</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter column name..."
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateColumn()}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewColumnDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateColumn} disabled={!newColumnName.trim()}>
              Create Column
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}