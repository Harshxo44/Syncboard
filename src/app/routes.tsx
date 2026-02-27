import { createBrowserRouter } from "react-router";
import { BoardPage } from "./pages/board-page";
import { RootLayout } from "./layouts/root-layout";
import { WorkspaceRedirect } from "./pages/workspace-redirect";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: WorkspaceRedirect,
      },
      {
        path: "workspace/:workspaceId",
        Component: BoardPage,
      },
    ],
  },
]);