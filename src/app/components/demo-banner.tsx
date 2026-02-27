import { Info, X, Keyboard } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <Info className="size-4 sm:size-5 flex-shrink-0" />
        <div className="text-xs sm:text-sm flex-1 min-w-0">
          <strong className="font-semibold">Portfolio Demo:</strong> 
          <span className="hidden sm:inline"> Full-stack project management MVP with drag-and-drop, real-time collaboration simulation, and localStorage persistence.</span>
          <span className="sm:hidden"> Drag cards, create boards & workspaces</span>
          <span className="hidden md:inline ml-2 opacity-90">
            <Keyboard className="inline size-3.5 mx-1" />
            Press <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">Cmd/Ctrl+D</kbd> for dark mode
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsVisible(false)}
        className="text-white hover:bg-white/20 flex-shrink-0 size-7 sm:size-9"
      >
        <X className="size-3.5 sm:size-4" />
      </Button>
    </div>
  );
}