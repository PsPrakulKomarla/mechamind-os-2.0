import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { useCreateUser, useUpdateUser } from "@/hooks/useAdminQueries";

interface UserFormProps {
  initialData?: any;
  onClose: () => void;
}

export const UserForm = ({ initialData, onClose }: UserFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role || "Viewer",
    organization: initialData?.organization || "Global",
    factory: initialData?.factory || "All",
  });

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const isEdit = !!initialData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      updateMutation.mutate({ id: initialData.id, payload: formData }, {
        onSuccess: () => onClose()
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => onClose()
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-primary-bg border border-gray-800 rounded-lg shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-secondary-bg/50">
          <h2 className="font-bold text-white">{isEdit ? "Edit User Profile" : "Create New User"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Alice Chen"
              className="w-full bg-secondary-bg border border-gray-700 rounded p-2 text-white outline-none focus:border-accent"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="e.g. alice@mechamind.io"
              className="w-full bg-secondary-bg border border-gray-700 rounded p-2 text-white outline-none focus:border-accent"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">System Role</label>
            <select 
              className="w-full bg-secondary-bg border border-gray-700 rounded p-2 text-white outline-none focus:border-accent"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Factory Manager">Factory Manager</option>
              <option value="Technician">Technician</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Organization</label>
              <input 
                type="text" 
                placeholder="e.g. Global"
                className="w-full bg-secondary-bg border border-gray-700 rounded p-2 text-white outline-none focus:border-accent"
                value={formData.organization}
                onChange={e => setFormData({ ...formData, organization: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Factory</label>
              <input 
                type="text" 
                placeholder="e.g. Factory A"
                className="w-full bg-secondary-bg border border-gray-700 rounded p-2 text-white outline-none focus:border-accent"
                value={formData.factory}
                onChange={e => setFormData({ ...formData, factory: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded text-sm font-medium transition-colors disabled:opacity-50">
              <Save size={16} /> {isPending ? "Saving..." : "Save User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
