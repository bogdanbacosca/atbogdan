import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/portofoliu")({
  component: PortfolioLayout,
});

/**
 * Layout route for /portofoliu. The file-based router treats
 * portofoliu.index.tsx (listing) and portofoliu.$slug.tsx (project detail)
 * as children of this route, so it must render <Outlet /> for their content
 * to appear.
 */
function PortfolioLayout() {
  return <Outlet />;
}
