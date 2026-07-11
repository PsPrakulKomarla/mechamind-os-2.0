import React from "react";
import { Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface Job {
  id: string;
  orderNumber: string;
  product: string;
  status: "queued" | "running" | "completed" | "failed";
  progress: number;
  estimatedCompletion?: string;
}

interface JobQueueProps {
  jobs: Job[];
}

export const JobQueue: React.FC<JobQueueProps> = ({ jobs }) => {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-medium">Active Job Queue</h3>
      </div>
      
      <div className="divide-y divide-border">
        {jobs.map(job => (
          <div key={job.id} className="p-4 hover:bg-muted/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{job.orderNumber}</span>
                <Badge variant="outline" className="text-xs">
                  {job.product}
                </Badge>
              </div>
              <div className="flex items-center space-x-1">
                {job.status === "completed" ? (
                  <CheckCircle className="text-green-500" size={16} />
                ) : job.status === "failed" ? (
                  <AlertTriangle className="text-red-500" size={16} />
                ) : (
                  <Clock className="text-blue-500" size={16} />
                )}
                <span className={`text-xs capitalize ${
                  job.status === 'completed' ? 'text-green-500' : 
                  job.status === 'failed' ? 'text-red-500' : 
                  'text-blue-500'
                }`}>
                  {job.status}
                </span>
              </div>
            </div>
            
            <div className="w-full bg-secondary rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full ${
                  job.status === 'failed' ? 'bg-red-500' : 
                  job.status === 'completed' ? 'bg-green-500' : 
                  'bg-brand-production'
                }`}
                style={{ width: `${job.progress}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress: {job.progress}%</span>
              {job.estimatedCompletion && <span>ETA: {job.estimatedCompletion}</span>}
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No active jobs in the queue.
          </div>
        )}
      </div>
    </Card>
  );
};
