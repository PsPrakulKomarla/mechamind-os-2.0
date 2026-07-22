import React, { useState } from "react";
import { WorkOrderBoard } from "@/components/maintenance/WorkOrderBoard";
import { CreateWorkOrderModal } from "@/components/maintenance/CreateWorkOrderModal";
import { useWorkOrdersList, useCreateWorkOrder } from "@/hooks/useMaintenanceQueries";
import { Input } from "@/components/ui/Input";
import { Search, Filter, Plus } from "lucide-react";

export const WorkOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: workOrders, isLoading } = useWorkOrdersList({ search: searchTerm });
  const createMutation = useCreateWorkOrder();

  const mockWorkOrders = workOrders || [
    { id: "WO-2024-001", title: "Replace primary spindle bearing", machine: "Stamping Press M-201", priority: "critical", status: "open", assignee: "J. Smith", dueDate: "2024-03-01T10:00:00Z" },
    { id: "WO-2024-002", title: "Monthly Lubrication Route", machine: "Assembly Line 4", priority: "medium", status: "in-progress", assignee: "A. Patel", dueDate: "2024-03-05T10:00:00Z" },
    { id: "WO-2024-003", title: "Inspect Conveyor Belt Tension", machine: "Conveyor C-12", priority: "low", status: "review", assignee: "M. Lee", dueDate: "2024-02-28T10:00:00Z" },
  ];

  const handleCreate = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setShowCreateModal(false);
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Work Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage, assign, and track maintenance tasks</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-md text-sm hover:bg-accent/90 transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={16} /> Create Work Order
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500" />
          </div>
          <Input 
            type="text" 
            placeholder="Search by ID, title, or machine..." 
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary-bg border border-gray-800 rounded-md text-sm text-gray-300 hover:text-white transition-colors">
          <Filter size={16} /> Filters
        </button>
      </div>

      <div className="flex-1 mt-2">
        <WorkOrderBoard workOrders={mockWorkOrders as any} isLoading={isLoading} />
      </div>

      <CreateWorkOrderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
};
