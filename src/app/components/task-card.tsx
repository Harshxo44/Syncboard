import { useDrag, useDrop } from 'react-dnd';
import { Card } from '../store/board-store';
import { useBoardStore, ALL_USERS } from '../store/board-store';
import { Calendar, MessageSquare } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { format } from 'date-fns';
import { useState } from 'react';
import { CardDetailDialog } from './card-detail-dialog';

interface TaskCardProps {
  card: Card;
  boardId: string;
  index: number;
  columnId: string;
}

export function TaskCard({ card, boardId, index, columnId }: TaskCardProps) {
  const { moveCard } = useBoardStore();
  const [showDetail, setShowDetail] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { cardId: card.id, fromColumnId: columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    hover: (item: { cardId: string; fromColumnId: string }) => {
      if (item.cardId === card.id) return;
      moveCard(boardId, item.cardId, columnId, index);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const assignedUsers = card.assignees
    .map((id) => ALL_USERS.find((u) => u.id === id))
    .filter(Boolean);

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  return (
    <>
      <div
        ref={(node) => drag(drop(node))}
        onClick={() => setShowDetail(true)}
        className={`bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all touch-manipulation active:scale-[0.98] ${
          isDragging ? 'opacity-50 rotate-2 scale-105' : ''
        } ${isOver ? 'border-blue-500 scale-[1.02]' : ''}`}
      >
        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2 break-words">
          {card.title}
        </h4>

        <div className="flex items-center gap-2 flex-wrap">
          {card.dueDate && (
            <div
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                isOverdue
                  ? 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Calendar className="size-3" />
              {format(new Date(card.dueDate), 'MMM d')}
            </div>
          )}

          {card.comments.length > 0 && (
            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
              <MessageSquare className="size-3" />
              {card.comments.length}
            </div>
          )}
        </div>

        {assignedUsers.length > 0 && (
          <div className="flex -space-x-2 mt-3">
            {assignedUsers.map((user) => (
              <Avatar key={user.id} user={user} size="xs" showTooltip />
            ))}
          </div>
        )}
      </div>

      <CardDetailDialog
        card={card}
        boardId={boardId}
        open={showDetail}
        onOpenChange={setShowDetail}
      />
    </>
  );
}