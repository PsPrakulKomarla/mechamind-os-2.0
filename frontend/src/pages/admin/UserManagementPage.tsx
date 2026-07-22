import React, { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { UserForm } from "@/components/admin/UserForm";
import { useUsers, useDeleteUser } from "@/hooks/useAdminQueries";
import { Users, Plus, Edit2, Trash2 } from "lucide-react";
import { useCan } from "@/hooks/useCan";

export const UserManagementPage = () => {
  const { data: users, isLoading } = useUsers({});
  const deleteMutation = useDeleteUser();
  const canCreate = useCan("create", "admin.users");
  const canEdit = useCan("edit", "admin.users");
  const canDelete = useCan("delete", "admin.users");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const mockUsers = users || [
    { id: "usr-1", name: "Alice Chen", email: "alice@mechamind.io", role: "Super Admin", organization: "Global", status: "Active" },
    { id: "usr-2", name: "Bob Smith", email: "bob@mechamind.io", role: "Factory Manager", organization: "North America", status: "Active" },
    { id: "usr-3", name: "Charlie Davis", email: "charlie@mechamind.io", role: "Technician", organization: "Europe", status: "Inactive" },
  ];

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    { header: "Name", accessorKey: "name", cell: (row: any) => <span className="font-bold text-white">{row.name}</span> },
    { header: "Email", accessorKey: "email" },
    { header: "Role", accessorKey: "role", cell: (row: any) => (
      <Badge variant={row.role === "Super Admin" ? "danger" : row.role === "Factory Manager" ? "warning" : "info"}>
        {row.role}
      </Badge>
    )},
    { header: "Organization", accessorKey: "organization" },
    { header: "Status", accessorKey: "status", cell: (row: any) => (
      <Badge variant={row.status === "Active" ? "success" : "secondary"}>{row.status}</Badge>
    )},
    { header: "Actions", accessorKey: "id", cell: (row: any) => (
      <div className="flex gap-2">
        {canEdit && (
          <button onClick={() => handleEdit(row)} className="p-1.5 text-gray-400 hover:text-white bg-gray-800 rounded transition-colors">
            <Edit2 size={14} />
          </button>
        )}
        {canDelete && (
          <button onClick={() => handleDelete(row.id)} className="p-1.5 text-danger hover:text-white hover:bg-danger bg-danger/10 rounded transition-colors">
            <Trash2 size={14} />
          </button>
        )}
      </div>
    )}
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="text-info" /> User Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform access and directory</p>
        </div>
        <button onClick={handleCreate} disabled={!canCreate} className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded font-medium transition-colors disabled:opacity-40">
          <Plus size={16} /> Add User
        </button>
      </div>

      <DataTable columns={columns} data={mockUsers} isLoading={isLoading} />

      {isFormOpen && (
        <UserForm initialData={selectedUser} onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
};
