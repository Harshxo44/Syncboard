import { useState } from 'react';
import { useNotesStore } from '../store/notes-store';
import { useAuthStore } from '../store/auth-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface PrivateNotesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivateNotes({ open, onOpenChange }: PrivateNotesProps) {
  const { user } = useAuthStore();
  const { notes, addNote, updateNote, deleteNote, getUserNotes } = useNotesStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const userNotes = user ? getUserNotes(user.id) : [];

  const handleCreate = () => {
    if (!user) return;
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    addNote(user.id, title, content);
    toast.success('Note created!');
    setTitle('');
    setContent('');
    setIsCreating(false);
  };

  const handleUpdate = () => {
    if (!editingNoteId) return;
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    updateNote(editingNoteId, title, content);
    toast.success('Note updated!');
    setTitle('');
    setContent('');
    setEditingNoteId(null);
  };

  const handleEdit = (noteId: string) => {
    const note = userNotes.find((n) => n.id === noteId);
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setEditingNoteId(noteId);
      setIsCreating(false);
    }
  };

  const handleDelete = (noteId: string) => {
    deleteNote(noteId);
    toast.success('Note deleted!');
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setIsCreating(false);
    setEditingNoteId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] sm:max-h-[80vh] flex flex-col w-[95vw] sm:w-full" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Private Notes</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2">
          {/* Create/Edit Form */}
          {(isCreating || editingNoteId) && (
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 sm:p-4 space-y-3 border-2 border-blue-500">
              <Input
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-semibold text-sm sm:text-base"
              />
              <Textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="resize-none text-sm sm:text-base"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCancel} size="sm">
                  Cancel
                </Button>
                <Button onClick={editingNoteId ? handleUpdate : handleCreate} size="sm">
                  {editingNoteId ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          )}

          {/* Notes List */}
          {userNotes.length === 0 && !isCreating && !editingNoteId && (
            <div className="text-center py-8 sm:py-12 space-y-3">
              <div className="text-5xl sm:text-6xl">📝</div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                No notes yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Create your first private note to get started
              </p>
            </div>
          )}

          {userNotes
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .map((note) => (
              <div
                key={note.id}
                className="bg-white dark:bg-slate-800 rounded-lg p-3 sm:p-4 space-y-2 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex-1 break-words">
                    {note.title}
                  </h3>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 sm:size-8"
                      onClick={() => handleEdit(note.id)}
                    >
                      <Edit2 className="size-3.5 sm:size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 sm:size-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 className="size-3.5 sm:size-4" />
                    </Button>
                  </div>
                </div>
                {note.content && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap break-words">
                    {note.content}
                  </p>
                )}
                <p className="text-xs text-slate-500">
                  Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                </p>
              </div>
            ))}
        </div>

        {!isCreating && !editingNoteId && (
          <DialogFooter className="mt-2 sm:mt-0">
            <Button onClick={() => setIsCreating(true)} className="gap-2 w-full sm:w-auto">
              <Plus className="size-4" />
              New Note
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}