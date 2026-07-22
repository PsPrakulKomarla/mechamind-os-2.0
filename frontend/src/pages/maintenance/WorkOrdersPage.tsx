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
    { id: "WO-2026-001", title: "Replace primary spindle bearing", machine: "Stamping Press M-201", priority: "critical", status: "open", assignee: "J. Smith", dueDate: "2026-07-25T10:00:00Z" },
    { id: "WO-2026-002", title: "Hydraulic fluid flush & filter replacement", machine: "Injection Molder M-103", priority: "high", status: "open", assignee: "A. Patel", dueDate: "2026-07-28T10:00:00Z" },
    { id: "WO-2026-003", title: "Calibrate torque sensors on robotic arm", machine: "Assembly Line A-5", priority: "medium", status: "open", assignee: "M. Lee", dueDate: "2026-08-01T10:00:00Z" },
    { id: "WO-2026-004", title: "Replace worn conveyor belt rollers", machine: "Conveyor C-12", priority: "low", status: "open", assignee: "T. Garcia", dueDate: "2026-08-05T10:00:00Z" },
    { id: "WO-2026-005", title: "Monthly lubrication route - Zone B", machine: "Assembly Line 4", priority: "medium", status: "in-progress", assignee: "A. Patel", dueDate: "2026-07-22T10:00:00Z" },
    { id: "WO-2026-006", title: "Vibration analysis on cooling tower fan", machine: "Cooling Tower CT-101", priority: "high", status: "in-progress", assignee: "K. Tanaka", dueDate: "2026-07-24T10:00:00Z" },
    { id: "WO-2026-007", title: "Inspect & clean heat exchanger tubes", machine: "Heat Exchanger HX-5", priority: "medium", status: "in-progress", assignee: "J. Smith", dueDate: "2026-07-26T10:00:00Z" },
    { id: "WO-2026-008", title: "Replace air compressor oil & filters", machine: "Air Compressor C-401", priority: "high", status: "review", assignee: "M. Lee", dueDate: "2026-07-18T10:00:00Z" },
    { id: "WO-2026-009", title: "Calibrate pressure gauges - Line 2", machine: "Production Line 2", priority: "low", status: "review", assignee: "T. Garcia", dueDate: "2026-07-20T10:00:00Z" },
    { id: "WO-2026-010", title: "Emergency stop button test - South Wing", machine: "Factory South Wing", priority: "critical", status: "review", assignee: "K. Tanaka", dueDate: "2026-07-15T10:00:00Z" },
    { id: "WO-2026-011", title: "Annual motor insulation resistance test", machine: "Motor M-305", priority: "medium", status: "closed", assignee: "J. Smith", dueDate: "2026-06-30T10:00:00Z" },
    { id: "WO-2026-012", title: "Replace cooling tower fan belt", machine: "Cooling Tower CT-101", priority: "high", status: "closed", assignee: "A. Patel", dueDate: "2026-06-28T10:00:00Z" },
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
