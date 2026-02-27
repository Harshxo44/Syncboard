import { LayoutGrid } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="text-center space-y-8">
        <div className="flex items-center justify-center gap-3 animate-pulse">
          <LayoutGrid className="size-16 text-blue-600 dark:text-blue-500" />
          <span className="text-5xl font-bold text-slate-900 dark:text-slate-100">TaskFlow</span>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <div className="size-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="size-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="size-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 text-lg">Loading your workspace...</p>
      </div>
    </div>
  );
}
