import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { OrganizationSwitcher, FactorySwitcher } from "@/components/ContextSwitchers";
import { useAuthStore } from "@/store/auth";
import { useThemeStore } from "@/store/theme";
import { useLogoutMutation } from "@/hooks/useAuthQueries";
import { Moon, Sun, Bell, Search, LogOut, User, ChevronDown, Settings, LogOutIcon } from "lucide-react";

export const Navbar = () => {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/analytics?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="h-14 w-full bg-secondary-bg border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
      {/* Left: Multi-Tenant Switchers */}
      <div className="flex items-center gap-4">
        <OrganizationSwitcher />
        <FactorySwitcher />
      </div>

      {/* Center: Search */}
      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search machines, work orders, documents..."
            className="w-full bg-primary-bg border border-gray-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-accent transition-colors placeholder:text-gray-600"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </kbd>
        </div>
      </form>

      {/* Right: Controls */}
      <div className="flex items-center gap-1">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors relative"
          title="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-secondary-bg" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-800/60 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-medium text-white leading-tight">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-[10px] text-gray-500 leading-tight">{user?.email}</p>
            </div>
            <ChevronDown size={12} className="text-gray-500 hidden sm:block" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-56 bg-card-bg border border-gray-700 rounded-xl shadow-2xl shadow-black/50 z-50 py-1 animate-in fade-in duration-150">
                <div className="px-3 py-2 border-b border-gray-700">
                  <p className="text-sm font-medium text-white">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    <User size={14} className="text-gray-500" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/admin/settings");
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    <Settings size={14} className="text-gray-500" />
                    Settings
                  </button>
                </div>
                <div className="border-t border-gray-700 py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logoutMutation.mutate();
                    }}
                    disabled={logoutMutation.isPending}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#EF4444] hover:bg-gray-800 transition-colors"
                  >
                    <LogOutIcon size={14} />
                    {logoutMutation.isPending ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
