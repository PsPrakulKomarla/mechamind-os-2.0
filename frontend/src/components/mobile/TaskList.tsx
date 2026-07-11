import React from "react";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

interface TaskListProps {
  tasks: Task[];
  onComplete: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onComplete }) => {
  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <Card key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4">
          <div className="flex items-start space-x-3 mb-3 sm:mb-0">
            <div className="mt-0.5 flex-shrink-0">
              {task.status === "completed" ? (
                <CheckCircle className="text-green-500" size={20} />
              ) : task.status === "in-progress" ? (
                <Clock className="text-yellow-500" size={20} />
              ) : (
                <AlertCircle className="text-muted-foreground" size={20} />
              )}
            </div>
            <div>
              <h4 className="font-medium text-foreground">{task.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
              
              <div className="flex items-center space-x-3 mt-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full font-medium ${
                  task.priority === 'high' ? 'bg-red-500/10 text-red-500' : 
                  task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' : 
                  'bg-blue-500/10 text-blue-500'
                }`}>
                  {task.priority.toUpperCase()}
                </span>
                {task.dueDate && (
                  <span className="text-muted-foreground">Due: {task.dueDate}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex sm:flex-col justify-end">
             {task.status !== "completed" && (
                <button 
                  onClick={() => onComplete(task.id)}
                  className="px-3 py-1.5 text-sm font-medium bg-brand-mobile text-white rounded-md hover:bg-brand-mobile/90 transition-colors"
                >
                  Complete
                </button>
             )}
          </div>
        </Card>
      ))}
      {tasks.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          No tasks found.
        </div>
      )}
    </div>
  );
};
