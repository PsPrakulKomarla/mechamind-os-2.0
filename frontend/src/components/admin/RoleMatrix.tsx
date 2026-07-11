import React from "react";
import { Check, X } from "lucide-react";

interface PermissionGroup {
  module: string;
  actions: { name: string, granted: boolean }[];
}

export const RoleMatrix = ({ permissions }: { permissions: PermissionGroup[] }) => {
  return (
    <div className="overflow-x-auto w-full border border-gray-800 rounded-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-secondary-bg/80 border-b border-gray-800">
            <th className="p-3 text-sm font-bold text-gray-300 w-1/3">Module</th>
            <th className="p-3 text-sm font-bold text-gray-300 text-center">View</th>
            <th className="p-3 text-sm font-bold text-gray-300 text-center">Create</th>
            <th className="p-3 text-sm font-bold text-gray-300 text-center">Edit</th>
            <th className="p-3 text-sm font-bold text-gray-300 text-center">Delete</th>
          </tr>
        </thead>
        <tbody className="bg-primary-bg divide-y divide-gray-800">
          {permissions.map((group, idx) => (
            <tr key={idx} className="hover:bg-secondary-bg/30 transition-colors">
              <td className="p-3 text-sm font-medium text-white">{group.module}</td>
              {group.actions.map((action, aIdx) => (
                <td key={aIdx} className="p-3 text-center">
                  <button className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-colors ${action.granted ? "bg-accent/20 text-accent" : "bg-gray-800 text-gray-600 hover:bg-gray-700"}`}>
                    {action.granted ? <Check size={14} /> : <X size={14} />}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
