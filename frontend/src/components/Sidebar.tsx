import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShieldAlert, Cpu, Settings, Menu } from "lucide-react";

export const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "RCA Analytics", path: "/rca", icon: Cpu },
    { name: "Compliance", path: "/compliance", icon: ShieldAlert },
    { name: "Settings", path: "/profile", icon: Settings },
  ];

  return (
    <aside className={`h-full bg-secondary-bg border-r border-gray-800 flex flex-col transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        {!isCollapsed && <span className="font-bold text-white tracking-wider">MECHAMIND OS</span>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-gray-400 hover:text-white p-1 rounded hover:bg-primary-bg">
          <Menu size={18} />
        </button>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-all ${
                isActive ? "bg-accent text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
