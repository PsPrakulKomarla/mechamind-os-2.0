import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useOnboardingStore } from "@/store/onboarding";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Upload,
  ChevronRight,
  Calendar,
  Ban,
  TrendingUp,
} from "lucide-react";

interface ComplianceItem {
  id: string;
  title: string;
  type: "inspection" | "certificate" | "regulation" | "audit";
  status: "compliant" | "warning" | "expired" | "missing";
  dueDate?: string;
  expiryDate?: string;
  asset?: string;
  description: string;
  requiredAction?: string;
}

const COMPLIANCE_ITEMS: ComplianceItem[] = [];

export const ComplianceDashboardPage = () => {
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");

  const isEmpty = !hasDocuments && COMPLIANCE_ITEMS.length === 0;

  const complianceScore = COMPLIANCE_ITEMS.length > 0
    ? Math.round(
        (COMPLIANCE_ITEMS.filter((i) => i.status === "compliant").length /
          COMPLIANCE_ITEMS.length) *
          100
      )
    : null;

  const missingInspections = COMPLIANCE_ITEMS.filter((i) => i.status === "missing");
  const expiredCerts = COMPLIANCE_ITEMS.filter((i) => i.status === "expired");
  const warnings = COMPLIANCE_ITEMS.filter((i) => i.status === "warning");

  const filteredItems =
    filter === "all"
      ? COMPLIANCE_ITEMS
      : COMPLIANCE_ITEMS.filter((i) => i.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle size={14} className="text-[#10B981]" />;
      case "warning":
        return <AlertTriangle size={14} className="text-[#F59E0B]" />;
      case "expired":
        return <Ban size={14} className="text-[#EF4444]" />;
      case "missing":
        return <Clock size={14} className="text-[#EF4444]" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string): "success" | "warning" | "danger" | "secondary" => {
    switch (status) {
      case "compliant":
        return "success";
      case "warning":
        return "warning";
      case "expired":
      case "missing":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shield className="text-[#10B981]" /> Compliance Intelligence
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Safety compliance monitoring, audit preparation, and regulatory tracking
          </p>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
            <Shield size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No Compliance Data</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-4">
            Upload SOPs, safety protocols, and inspection records to enable compliance monitoring.
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium hover:bg-[#3B82F6]/15 transition-colors"
          >
            <Upload size={12} />
            Upload Documents
          </button>
        </div>
      ) : (
        <>
          {/* Compliance Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card className="flex flex-col items-center justify-center py-6 text-center">
              <div className="relative w-20 h-20 mb-3">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="35" stroke="#1F2937" strokeWidth="6" fill="none" />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke={complianceScore && complianceScore >= 80 ? "#10B981" : complianceScore && complianceScore >= 50 ? "#F59E0B" : "#EF4444"}
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${(complianceScore || 0) * 2.2} 220`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{complianceScore ?? "—"}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 font-medium">Compliance Score</p>
            </Card>

            <Card className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#EF4444]/10 flex items-center justify-center mb-3">
                <AlertTriangle size={20} className="text-[#EF4444]" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{missingInspections.length}</p>
              <p className="text-xs text-gray-400">Missing Inspections</p>
            </Card>

            <Card className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#EF4444]/10 flex items-center justify-center mb-3">
                <Ban size={20} className="text-[#EF4444]" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{expiredCerts.length}</p>
              <p className="text-xs text-gray-400">Expired Certificates</p>
            </Card>

            <Card className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center mb-3">
                <AlertTriangle size={20} className="text-[#F59E0B]" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{warnings.length}</p>
              <p className="text-xs text-gray-400">Warnings</p>
            </Card>
          </div>

          {/* Required Actions */}
          {(missingInspections.length > 0 || expiredCerts.length > 0) && (
            <Card className="border-[#EF4444]/30 bg-[#EF4444]/5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} className="text-[#EF4444]" />
                <h3 className="text-sm font-bold text-[#EF4444]">Required Actions</h3>
              </div>
              <div className="space-y-2">
                {[...missingInspections, ...expiredCerts].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-[#111827]/60 border border-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <p className="text-sm text-white font-medium">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.asset || item.description}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(item.status)} className="text-[10px]">
                      {item.status === "missing" ? "Missing" : item.status === "expired" ? "Expired" : item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Audit Preparation */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-[#3B82F6]" />
              <h3 className="text-sm font-bold text-white">Audit Preparation</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#111827]/60 border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Documents Ready</p>
                <p className="text-lg font-bold text-white">{COMPLIANCE_ITEMS.filter((i) => i.status === "compliant").length} / {COMPLIANCE_ITEMS.length}</p>
              </div>
              <div className="p-4 bg-[#111827]/60 border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Last Audit</p>
                <p className="text-lg font-bold text-white">No data</p>
              </div>
              <div className="p-4 bg-[#111827]/60 border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Next Audit Due</p>
                <p className="text-lg font-bold text-white">No data</p>
              </div>
            </div>
          </Card>

          {/* Compliance Items Table */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Compliance Items</h3>
              <div className="flex gap-2">
                {["all", "compliant", "warning", "expired", "missing"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      filter === f
                        ? "bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No compliance items match the selected filter.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-[#111827]/40 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <p className="text-sm text-white font-medium">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                        {item.asset && (
                          <p className="text-xs text-gray-600 mt-0.5">Asset: {item.asset}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.dueDate && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={10} /> {item.dueDate}
                        </span>
                      )}
                      <Badge variant={getStatusVariant(item.status)} className="text-[10px]">
                        {item.status}
                      </Badge>
                      <ChevronRight size={14} className="text-gray-600" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};
