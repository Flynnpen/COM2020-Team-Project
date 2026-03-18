import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  getAccessibilityMode,
  setAccessibilityMode,
  subscribeToAccessibilityMode,
} from "../accessibility/accessibilityMode";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accessibilityMode, setAccessibilityModeState] = useState<boolean>(() =>
    getAccessibilityMode()
  );
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      mainRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.dataset.accessibilityMode = accessibilityMode ? "true" : "false";
  }, [accessibilityMode]);

  useEffect(() => subscribeToAccessibilityMode(setAccessibilityModeState), []);

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <a href="#primary-navigation" className="app-skip-link">
        Skip to navigation
      </a>
      <a href="#main-content" className="app-skip-link">
        Skip to main content
      </a>
      <div className="mx-auto max-w-7xl">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((open) => !open)}
          accessibilityMode={accessibilityMode}
          onToggleAccessibilityMode={() => setAccessibilityMode(!accessibilityMode)}
        />

        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="min-w-0 pl-14 sm:pl-20"
        >
          <div className="app-card mb-5 px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-[rgb(var(--app-ink))]">Campus Carbon</div>
              <div className="text-xs app-muted">Climate actions, challenges, and pet progress</div>
            </div>
          </div>

          <div className="space-y-7">
            <Outlet context={{ accessibilityMode, setAccessibilityMode }} />
          </div>
        </main>
      </div>
    </div>
  );
}
