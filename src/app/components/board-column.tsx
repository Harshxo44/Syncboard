import { useDrop } from 'react-dnd';
import { Card, Column } from '../store/board-store';
import { TaskCard } from './task-card';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { useBoardStore } from '../store/board-store';
import { useState } from 'react';
import { toast } from 'sonner';

interface BoardColumnProps {
  column: Column;
  cards: Card[];
  boardId: string;
}

export function BoardColumn({ column, cards, boardId }: BoardColumnProps) {
  const { addCard, moveCard } = useBoardStore();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: { cardId: string; fromColumnId: string }, monitor) => {
      if (monitor.didDrop()) return;
      moveCard(boardId, item.cardId, column.id, cards.length);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      addCard(boardId, column.id, newCardTitle);
      toast.success('Card created!');
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  return (
    <div
      ref={drop}
      className={`flex-shrink-0 w-[280px] sm:w-72 md:w-80 bg-slate-100 dark:bg-slate-900 rounded-lg flex flex-col max-h-full transition-colors ${
        isOver ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {/* Column header */}
      <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">
            {column.title}
          </h3>
          <span className="text-xs sm:text-sm text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {cards.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2">
        {cards.length === 0 && !isAddingCard && (
          <div className="text-center py-8 text-slate-400 dark:text-slate-600">
            <p className="text-sm">No cards yet</p>
            <p className="text-xs mt-1">Add a card to get started</p>
          </div>
        )}
        
        {cards.map((card, index) => (
          <TaskCard
            key={card.id}
            card={card}
            boardId={boardId}
            index={index}
            columnId={column.id}
          />
        ))}

        {isAddingCard ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm border border-slate-200 dark:border-slate-700">
            <textarea
              autoFocus
              placeholder="Enter card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddCard();
                }
                if (e.key === 'Escape') {
                  setIsAddingCard(false);
                  setNewCardTitle('');
                }
              }}
              className="w-full resize-none border-none outline-none bg-transparent text-sm"
              rows={2}
            />
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={handleAddCard}>
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
            onClick={() => setIsAddingCard(true)}
          >
            <Plus className="size-4 mr-2" />
            Add card
          </Button>
        )}
      </div>
    </div>
  );
}