import React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useFeedbackQueue, useUpdateFeedbackStatus } from "@/hooks/useAiKnowledgeQueries";
import { MessageSquare, CheckCircle, XCircle } from "lucide-react";

export const FeedbackQueuePage = () => {
  const { data: queue, isLoading } = useFeedbackQueue();
  const updateMutation = useUpdateFeedbackStatus();

  const mockData = queue || [
    { id: "fb-01", type: "Hallucination", context: "WO-9912 RCA", user: "Tech. Davis", aiResponse: "The bearing failed due to fluid starvation.", userNote: "Incorrect. The fluid was fine, it was thermal expansion.", status: "Pending" },
    { id: "fb-02", type: "Low Confidence", context: "Copilot Chat", user: "Eng. Smith", aiResponse: "I am not sure how to configure the M1 controller.", userNote: "Please link the M1 manual to the graph.", status: "Pending" },
    { id: "fb-03", type: "Helpful", context: "Summary Agent", user: "Manager Alice", aiResponse: "Downtime summary generated.", userNote: "Spot on analysis.", status: "Approved" },
  ];

  const handleApprove = (id: string) => updateMutation.mutate({ id, status: "Approved" });
  const handleReject = (id: string) => updateMutation.mutate({ id, status: "Rejected" });

  const columns = [
    { header: "Type", accessorKey: "type", cell: (row: any) => (
      <Badge variant={row.type === "Hallucination" ? "danger" : row.type === "Low Confidence" ? "warning" : "info"}>
        {row.type}
      </Badge>
    )},
    { header: "Context", accessorKey: "context", cell: (row: any) => <span className="text-gray-300 font-bold">{row.context}</span> },
    { header: "AI Response", accessorKey: "aiResponse", cell: (row: any) => <span className="text-gray-400 italic text-xs truncate max-w-[200px] block">"{row.aiResponse}"</span> },
    { header: "User Note", accessorKey: "userNote", cell: (row: any) => <span className="text-gray-300 text-sm">"{row.userNote}"</span> },
    { header: "User", accessorKey: "user" },
    { header: "Status", accessorKey: "status", cell: (row: any) => (
      <Badge variant={row.status === "Approved" ? "success" : row.status === "Rejected" ? "default" : "warning"}>{row.status}</Badge>
    )},
    { header: "Actions", accessorKey: "id", cell: (row: any) => (
      row.status === "Pending" ? (
        <div className="flex gap-2">
          <button onClick={() => handleApprove(row.id)} className="p-1.5 text-success hover:bg-success/20 bg-success/10 rounded transition-colors"><CheckCircle size={14} /></button>
          <button onClick={() => handleReject(row.id)} className="p-1.5 text-danger hover:bg-danger/20 bg-danger/10 rounded transition-colors"><XCircle size={14} /></button>
        </div>
      ) : (
        <span className="text-gray-600 text-xs text-center w-full block">Resolved</span>
      )
    )}
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="text-warning" /> AI Feedback Queue
          </h1>
          <p className="text-sm text-gray-500 mt-1">Human-in-the-loop (HITL) review for model hallucinations</p>
        </div>
      </div>

      <DataTable columns={columns} data={mockData} isLoading={isLoading} />
    </div>
  );
};
