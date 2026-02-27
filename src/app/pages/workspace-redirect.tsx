import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useBoardStore } from '../store/board-store';

export function WorkspaceRedirect() {
  const navigate = useNavigate();
  const currentWorkspaceId = useBoardStore((state) => state.currentWorkspaceId);

  useEffect(() => {
    navigate(`/workspace/${currentWorkspaceId}`, { replace: true });
  }, [navigate, currentWorkspaceId]);

  return null;
}
