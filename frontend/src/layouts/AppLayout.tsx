import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto flex max-w-7xl gap-4 lg:gap-6">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <div className="app-card mb-5 flex items-center justify-between px-4 py-3 md:hidden">
            <div>
              <div className="text-sm font-semibold text-[rgb(var(--app-ink))]">Campus Carbon</div>
              <div className="text-xs app-muted">Climate actions, challenges, and pet progress</div>
            </div>
            <div className="app-chip">Menu soon</div>
          </div>

          <div className="space-y-7">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
