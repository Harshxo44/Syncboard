import { Outlet } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from 'next-themes';
import { Header } from '../components/header';
import { Toaster } from '../components/ui/toaster';
import { DemoBanner } from '../components/demo-banner';
import { KeyboardShortcuts } from '../components/keyboard-shortcuts';

export function RootLayout() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <DndProvider backend={HTML5Backend}>
        <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
          <KeyboardShortcuts />
          <DemoBanner />
          <Header />
          <main className="flex-1 overflow-hidden">
            <Outlet />
          </main>
          <Toaster />
        </div>
      </DndProvider>
    </ThemeProvider>
  );
}