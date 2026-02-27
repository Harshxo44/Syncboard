import { User } from '../../store/board-store';
import { AuthUser } from '../../store/auth-store';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../lib/utils';

interface AvatarProps {
  user: User | AuthUser | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const sizeClasses = {
  xs: 'size-6 text-xs',
  sm: 'size-8 text-sm',
  md: 'size-10 text-base',
  lg: 'size-12 text-lg',
};

export function Avatar({ user, size = 'md', showTooltip = false }: AvatarProps) {
  if (!user) {
    return (
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-medium bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 ring-2 ring-white dark:ring-slate-900',
          sizeClasses[size]
        )}
      >
        👤
      </div>
    );
  }

  const avatar = (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-medium text-white ring-2 ring-white dark:ring-slate-900 cursor-pointer',
        sizeClasses[size]
      )}
      style={{ backgroundColor: 'color' in user ? user.color : '#3b82f6' }}
    >
      {user.avatar}
    </div>
  );

  if (showTooltip) {
    return (
      <TooltipPrimitive.Provider>
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger asChild>{avatar}</TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              className="z-50 overflow-hidden rounded-md bg-slate-900 dark:bg-slate-100 px-3 py-1.5 text-xs text-white dark:text-slate-900 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
              sideOffset={5}
            >
              {user.name}
              <TooltipPrimitive.Arrow className="fill-slate-900 dark:fill-slate-100" />
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    );
  }

  return avatar;
}