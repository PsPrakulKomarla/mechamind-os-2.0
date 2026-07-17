import React from "react";
import { OrganizationSwitcher, FactorySwitcher } from "@/components/ContextSwitchers";
import { useAuthStore } from "@/store/auth";
import { useThemeStore } from "@/store/theme";
import { Sun, Moon } from "lucide-react";

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

      {/* Profile & Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="text-right">
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
