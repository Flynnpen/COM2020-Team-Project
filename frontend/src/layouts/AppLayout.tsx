import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex max-w-6xl">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10">
          {/* Top bar (mobile / simple header) */}
          <div className="mb-6 flex items-center justify-between md:hidden">
            <div className="text-sm font-semibold text-gray-900">Campus Carbon</div>
            <div className="text-xs text-gray-500">Menu later</div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
