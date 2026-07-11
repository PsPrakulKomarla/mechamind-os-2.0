import React, { useState } from "react";
import { RoleMatrix } from "@/components/admin/RoleMatrix";
import { Shield, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const RoleManagementPage = () => {
  const [selectedRole, setSelectedRole] = useState("Factory Manager");

  const roles = ["Super Admin", "Factory Manager", "Maintenance Supervisor", "Technician", "Viewer"];

  // Mock permissions matrix for the selected role
  const getPermissionsForRole = (role: string) => {
    const isSuper = role === "Super Admin";
    const isManager = role === "Factory Manager";
    
    return [
      {
        module: "Command Center",
        actions: [
          { name: "View", granted: true },
          { name: "Create", granted: isSuper || isManager },
          { name: "Edit", granted: isSuper || isManager },
          { name: "Delete", granted: isSuper },
        ]
      },
      {
        module: "Asset Management (EAM)",
        actions: [
          { name: "View", granted: true },
          { name: "Create", granted: isSuper || isManager },
          { name: "Edit", granted: isSuper || isManager },
          { name: "Delete", granted: isSuper },
        ]
      },
      {
        module: "Maintenance & Work Orders",
        actions: [
          { name: "View", granted: true },
          { name: "Create", granted: true },
          { name: "Edit", granted: true },
          { name: "Delete", granted: isSuper || isManager },
        ]
      },
      {
        module: "IoT & Vision AI",
        actions: [
          { name: "View", granted: true },
          { name: "Create", granted: isSuper },
          { name: "Edit", granted: isSuper || isManager },
          { name: "Delete", granted: isSuper },
        ]
      }
    ];
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shield className="text-warning" /> Role & Permission Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Configure granular RBAC across all modules</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary-bg hover:bg-gray-800 border border-gray-700 text-white rounded font-medium transition-colors">
          <Plus size={16} /> Create Custom Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        <div className="lg:col-span-1 border border-gray-800 bg-secondary-bg/20 rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-800 font-bold text-gray-300 bg-secondary-bg/50">Available Roles</div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {roles.map(r => (
              <button 
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`w-full text-left px-4 py-3 rounded text-sm font-medium transition-colors ${selectedRole === r ? "bg-accent/10 text-accent border border-accent/20" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <Card className="lg:col-span-3 flex flex-col p-0 overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-secondary-bg/30">
            <div>
              <h2 className="text-xl font-bold text-white">{selectedRole}</h2>
              <p className="text-sm text-gray-400 mt-1">Configure module-level access for this role.</p>
            </div>
            <button className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/90 transition-colors text-sm font-medium">
              Save Permissions
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1">
            <RoleMatrix permissions={getPermissionsForRole(selectedRole)} />
          </div>
        </Card>
      </div>
    </div>
  );
};
