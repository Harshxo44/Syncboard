import { Card, ALL_USERS } from '../store/board-store';
import { useBoardStore } from '../store/board-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { Calendar, MessageSquare, Trash2, UserPlus, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';

interface CardDetailDialogProps {
  card: Card;
  boardId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CardDetailDialog({ card, boardId, open, onOpenChange }: CardDetailDialogProps) {
  const { updateCard, deleteCard, addComment, currentUser, getCurrentBoard, moveCard } = useBoardStore();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(card.description || '');
  const [newComment, setNewComment] = useState('');

  const currentBoard = getCurrentBoard();
  const currentColumn = currentBoard?.columns.find((col) => col.id === card.columnId);

  const assignedUsers = card.assignees
    .map((id) => ALL_USERS.find((u) => u.id === id))
    .filter(Boolean);

  const handleSaveDescription = () => {
    updateCard(boardId, card.id, { description });
    toast.success('Description updated!');
    setIsEditingDescription(false);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(boardId, card.id, newComment);
      toast.success('Comment added!');
      setNewComment('');
    }
  };

  const handleToggleAssignee = (userId: string) => {
    const currentAssignees = card.assignees;
    const newAssignees = currentAssignees.includes(userId)
      ? currentAssignees.filter((id) => id !== userId)
      : [...currentAssignees, userId];
    updateCard(boardId, card.id, { assignees: newAssignees });
  };

  const handleSetDueDate = (date: string) => {
    updateCard(boardId, card.id, { dueDate: date });
  };

  const handleMoveToColumn = (newColumnId: string) => {
    const targetColumn = currentBoard?.columns.find((col) => col.id === newColumnId);
    if (targetColumn) {
      const cardsInTargetColumn = currentBoard?.cards.filter((c) => c.columnId === newColumnId) || [];
      moveCard(boardId, card.id, newColumnId, cardsInTargetColumn.length);
      toast.success(`Moved to ${targetColumn.title}`);
    }
  };

  const handleDelete = () => {
    deleteCard(boardId, card.id);
    toast.success('Card deleted!');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full" aria-describedby={undefined}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {currentColumn?.title}
            </span>
          </div>
          <DialogTitle className="text-lg sm:text-xl pr-8">{card.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 mt-4">
          {/* Assignees, Due Date, and Move Column */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Assignees
              </label>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {assignedUsers.map((user) => (
                    <Avatar key={user.id} user={user} size="sm" showTooltip />
                  ))}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <UserPlus className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {ALL_USERS.map((user) => (
                      <DropdownMenuItem
                        key={user.id}
                        onClick={() => handleToggleAssignee(user.id)}
                        className="gap-2"
                      >
                        <Avatar user={user} size="xs" />
                        {user.name}
                        {card.assignees.includes(user.id) && (
                          <span className="ml-auto text-blue-600">✓</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Due Date
              </label>
              <div className="flex items-center gap-2">
                {card.dueDate && (
                  <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <Calendar className="size-4" />
                    {format(new Date(card.dueDate), 'MMM d, yyyy')}
                  </div>
                )}
                <Input
                  type="date"
                  value={card.dueDate || ''}
                  onChange={(e) => handleSetDueDate(e.target.value)}
                  className="w-auto"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Move to
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowRight className="size-4" />
                    Column
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {currentBoard?.columns.map((column) => (
                    <DropdownMenuItem
                      key={column.id}
                      onClick={() => handleMoveToColumn(column.id)}
                      disabled={column.id === card.columnId}
                      className="gap-2"
                    >
                      {column.title}
                      {column.id === card.columnId && (
                        <span className="ml-auto text-blue-600">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Description
            </label>
            {isEditingDescription ? (
              <div className="space-y-2">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description..."
                  rows={6}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveDescription}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setDescription(card.description || '');
                      setIsEditingDescription(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingDescription(true)}
                className="min-h-[100px] p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {card.description ? (
                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {card.description}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400">Click to add a description...</p>
                )}
              </div>
            )}
          </div>

          {/* Comments */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="size-5 text-slate-600 dark:text-slate-400" />
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Comments
              </label>
            </div>

            <div className="space-y-3 mb-4">
              {card.comments.map((comment) => {
                const user = ALL_USERS.find((u) => u.id === comment.userId);
                return (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar user={user!} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {user?.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Avatar user={currentUser} size="sm" />
              <div className="flex-1 space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleAddComment();
                    }
                  }}
                />
                <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                  Add Comment
                </Button>
              </div>
            </div>
          </div>

          {/* Delete */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="destructive" size="sm" onClick={handleDelete} className="gap-2">
              <Trash2 className="size-4" />
              Delete Card
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}