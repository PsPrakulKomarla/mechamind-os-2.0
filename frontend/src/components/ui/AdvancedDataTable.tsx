import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Search, Download, Trash2, Filter } from "lucide-react";

export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface AdvancedDataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  onBulkDelete?: (selectedRows: T[]) => void;
  enableExport?: boolean;
}

export function AdvancedDataTable<T extends { id?: string | number }>({ 
  columns, 
  data, 
  isLoading, 
  onBulkDelete,
  enableExport = true 
}: AdvancedDataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string | number>>(new Set());
  
  const rowsPerPage = 10;

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    if (!globalFilter) return data || [];
    const lowerFilter = globalFilter.toLowerCase();
    return (data || []).filter(row => {
      return Object.values(row as any).some(val => 
        String(val).toLowerCase().includes(lowerFilter)
      );
    });
  }, [data, globalFilter]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a: any, b: any) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const toggleSelectAll = () => {
    if (selectedRowIds.size === paginatedData.length) {
      setSelectedRowIds(new Set());
    } else {
      const newSet = new Set<string | number>();
      paginatedData.forEach(r => r.id && newSet.add(r.id));
      setSelectedRowIds(newSet);
    }
  };

  const toggleSelectRow = (id: string | number) => {
    const newSet = new Set(selectedRowIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedRowIds(newSet);
  };

  const exportCsv = () => {
    if (!data || data.length === 0) return;
    const headers = columns.map(c => c.header).join(",");
    const rows = sortedData.map((row: any) => 
      columns.map(c => {
        let val = row[c.accessorKey as string];
        return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(",")
    ).join("\n");
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 animate-pulse bg-secondary-bg border border-gray-800 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Loading Data...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Filter records..."
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-secondary-bg border border-gray-800 rounded-md py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent"
          />
        </div>
        
        <div className="flex gap-2">
          {selectedRowIds.size > 0 && onBulkDelete && (
            <button 
              onClick={() => {
                const selected = data.filter(r => r.id && selectedRowIds.has(r.id));
                onBulkDelete(selected);
                setSelectedRowIds(new Set());
              }}
              className="flex items-center gap-2 bg-red-900/20 text-red-500 hover:bg-red-900/40 px-3 py-2 rounded text-sm transition-colors border border-red-900/50"
            >
              <Trash2 size={16} /> Delete ({selectedRowIds.size})
            </button>
          )}
          {enableExport && (
            <button 
              onClick={exportCsv}
              className="flex items-center gap-2 bg-secondary-bg hover:bg-gray-800 text-gray-300 border border-gray-800 px-3 py-2 rounded text-sm transition-colors"
            >
              <Download size={16} /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto bg-secondary-bg border border-gray-800 rounded-lg">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-primary-bg text-gray-400 border-b border-gray-800">
            <tr>
              {onBulkDelete && (
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    checked={paginatedData.length > 0 && selectedRowIds.size === paginatedData.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-700 bg-gray-900 text-accent focus:ring-accent"
                  />
                </th>
              )}
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-6 py-4 font-semibold tracking-wider ${col.sortable !== false ? 'cursor-pointer select-none hover:bg-gray-800' : ''}`}
                  onClick={() => col.sortable !== false && handleSort(col.accessorKey as string)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {sortConfig?.key === col.accessorKey && (
                      sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onBulkDelete ? 1 : 0)} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter size={32} className="text-gray-700" />
                    <p>No records found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row: any, rowIndex) => (
                <tr key={row.id || rowIndex} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                  {onBulkDelete && (
                    <td className="px-6 py-4 w-10">
                      <input 
                        type="checkbox" 
                        checked={row.id ? selectedRowIds.has(row.id) : false}
                        onChange={() => row.id && toggleSelectRow(row.id)}
                        className="rounded border-gray-700 bg-gray-900 text-accent focus:ring-accent"
                      />
                    </td>
                  )}
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      {col.cell ? col.cell(row) : row[col.accessorKey as string]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div>
            Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-3 py-1 bg-secondary-bg border border-gray-800 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded flex items-center justify-center ${currentPage === page ? 'bg-accent text-white font-bold' : 'hover:bg-gray-800'}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-3 py-1 bg-secondary-bg border border-gray-800 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
