import React from "react";
import { OrganizationSwitcher, FactorySwitcher } from "@/components/ContextSwitchers";
import { useAuthStore } from "@/store/auth";
import { useThemeStore } from "@/store/theme";
import { Sun, Moon, Search, Bell } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="h-16 w-full bg-secondary-bg border-b border-gray-800 flex items-center justify-between px-6">
      {/* Multi-Tenant Switchers (Breadcrumb location) */}
      <div className="flex items-center gap-6">
        <OrganizationSwitcher />
        <FactorySwitcher />
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-xl mx-8 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search machines, users, alerts... (Cmd+K)"
            className="w-full bg-gray-900 border border-gray-800 rounded-md py-1.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
          />
        </div>
      </div>

      {/* Profile & Controls */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-secondary-bg"></span>
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-white">{user?.first_name} {user?.last_name}</p>
          <p className="text-[10px] text-gray-500 font-mono">User ID: {user?.id.slice(0, 8)}</p>
        </div>
        <button
          onClick={logout}
          className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-3 py-1.5 rounded transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};
