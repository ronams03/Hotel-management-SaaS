import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import {
  LayoutDashboard, Calendar, Users, BedDouble, UserCog,
  Clock, Sparkles, Receipt, Shield, Settings,
  Bell, Search, Menu, Hotel, LogOut, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { NAV_ITEMS, ROLE_META } from "../config/rbac";

const iconMap: Record<string, React.ElementType> = {
  dashboard:    LayoutDashboard,
  bookings:     Calendar,
  guests:       Users,
  rooms:        BedDouble,
  staff:        UserCog,
  shifts:       Clock,
  housekeeping: Sparkles,
  invoices:     Receipt,
  iam:          Shield,
  settings:     Settings,
};

export function Layout() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout, canAccess }             = useAuth();

  const roleMeta = user ? ROLE_META[user.role] : null;
  const visibleNavItems = NAV_ITEMS.filter(item => canAccess(item.module));

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed lg:relative z-50 lg:z-auto
          flex flex-col bg-white text-slate-700 h-full flex-shrink-0 border-r border-gray-200
          transition-[width] duration-300 ease-in-out
          ${collapsed ? "w-[68px]" : "w-64"}
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-gray-200 min-h-[64px] px-4 overflow-hidden
          ${collapsed ? "justify-center" : "gap-3"}`}
        >
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <Hotel className="w-5 h-5 text-white" />
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap
              ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
          >
            <p className="text-slate-900 font-semibold text-sm">HotelSaaS</p>
            <p className="text-slate-500 text-xs">Management System</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
          {/* Section label */}
          <div
            className={`transition-all duration-200 overflow-hidden
              ${collapsed ? "h-0 opacity-0" : "h-6 opacity-100"}`}
          >
            <p className="px-4 pb-2 text-slate-400 text-[10px] uppercase tracking-widest font-semibold">
              Navigation
            </p>
          </div>

          <ul className="space-y-0.5 px-2">
            {visibleNavItems.map((item) => {
              const Icon = iconMap[item.module];
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-all duration-150
                      ${isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-gray-100 hover:text-slate-900"
                      }
                      ${collapsed ? "justify-center" : ""}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`w-5 h-5 flex-shrink-0 transition-colors
                            ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"}`}
                        />

                        {/* Label — slides out when expanded */}
                        <span
                          className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out
                            ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
                        >
                          {item.label}
                        </span>

                        {/* Tooltip when collapsed */}
                        {collapsed && (
                          <div className="
                            absolute left-full ml-3 px-2.5 py-1.5
                            bg-slate-900 text-white text-xs rounded-md shadow-xl
                            opacity-0 group-hover:opacity-100
                            pointer-events-none whitespace-nowrap z-50
                            translate-x-1 group-hover:translate-x-0
                            transition-all duration-150
                            border border-slate-800
                          ">
                            {item.label}
                            {/* Arrow */}
                            <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 border-l border-b border-slate-800 rotate-45" />
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User footer */}
        <div className="border-t border-gray-200">
          {/* Avatar row */}
          <div className={`flex items-center gap-3 px-3 py-3 ${collapsed ? "justify-center" : ""}`}>
            <div className="group relative w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold cursor-default">
              {user?.avatar ?? "A"}
              {/* Tooltip for avatar in collapsed mode */}
              {collapsed && (
                <div className="
                  absolute left-full ml-3 px-2.5 py-1.5
                  bg-slate-900 text-white text-xs rounded-md shadow-xl
                  opacity-0 group-hover:opacity-100
                  pointer-events-none whitespace-nowrap z-50
                  border border-slate-800
                  transition-opacity duration-150
                ">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-slate-400">{user?.email}</p>
                </div>
              )}
            </div>

            <div
              className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out
                ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
            >
              <p className="text-slate-900 text-sm font-medium truncate">{user?.name ?? "Admin"}</p>
              <p className="text-slate-500 text-xs truncate">{user?.email}</p>
            </div>

            {!collapsed && (
              <div className="w-6" aria-hidden="true" />
            )}
          </div>
        </div>

        {/* ── Collapse Toggle Button (floating on right edge) ── */}
        <button
          onClick={() => {
            const next = !collapsed;
            setCollapsed(next);
            try { localStorage.setItem("sidebar_collapsed", String(next)); } catch {}
          }}
          className="
            hidden lg:flex
            absolute -right-3 top-[72px]
            w-6 h-6 rounded-full
            bg-white hover:bg-blue-600
            border-2 border-gray-200
            items-center justify-center
            text-gray-600 hover:text-white
            transition-colors duration-200
            shadow-md z-50
          "
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed
            ? <ChevronRight className="w-3 h-3" />
            : <ChevronLeft  className="w-3 h-3" />
          }
        </button>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 h-16 flex items-center gap-4 flex-shrink-0">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 flex items-center gap-3 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            {roleMeta && user && (
              <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${roleMeta.bg} ${roleMeta.border} ${roleMeta.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${roleMeta.dot}`} />
                {user.role}
              </div>
            )}

            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <button
              onClick={logout}
              title="Sign out"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sign out</span>
            </button>

            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer flex-shrink-0">
              {user?.avatar ?? "A"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
