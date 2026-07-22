import React, { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface CreateWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export const CreateWorkOrderModal = ({ isOpen, onClose, onSubmit, isSubmitting }: CreateWorkOrderModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [machine, setMachine] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      organization_id: "00000000-0000-0000-0000-000000000000",
      factory_id: "00000000-0000-0000-0000-000000000000",
      title,
      description,
      priority,
      machine_id: machine || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-secondary-bg border border-gray-800 rounded-lg w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Create Work Order</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Title *</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Replace primary spindle bearing" required />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detailed description of the work to be done..."
              className="w-full bg-primary-bg border border-gray-800 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors min-h-[100px] resize-y"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full bg-primary-bg border border-gray-800 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Machine ID</label>
              <Input value={machine} onChange={e => setMachine(e.target.value)} placeholder="Optional machine UUID" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-800">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={!title || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Work Order"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
