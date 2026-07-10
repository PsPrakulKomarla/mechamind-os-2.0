import React from "react";

interface DataTableProps {
  columns: { header: string; accessorKey: string; cell?: (row: any) => React.ReactNode }[];
  data: any[];
  isLoading?: boolean;
}

export const DataTable = ({ columns, data, isLoading }: DataTableProps) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 animate-pulse bg-secondary-bg border border-gray-800 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Loading Data...</span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto bg-secondary-bg border border-gray-800 rounded-lg">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs uppercase bg-primary-bg text-gray-400 border-b border-gray-800">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-3 font-semibold tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                No records found.
              </td>
            </tr>
          )}
          {data?.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  {col.cell ? col.cell(row) : row[col.accessorKey]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
