import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useOnboardingStore } from "@/store/onboarding";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Search,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Upload,
  ChevronRight,
  Clock,
  Wrench,
  Shield,
  Lightbulb,
  Target,
  GitBranch,
} from "lucide-react";

interface FailureIncident {
  id: string;
  title: string;
  asset: string;
  date: string;
  severity: "critical" | "high" | "medium" | "low";
  rootCause: string;
  preventiveAction: string;
  category: string;
  resolvedBy: string;
  downtimeHours: number;
  similarCount: number;
}

interface PreventiveRecommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  affectedAssets: string[];
  basedOn: string;
}

const INCIDENTS: FailureIncident[] = [];
const RECOMMENDATIONS: PreventiveRecommendation[] = [];

export const LessonsLearnedPage = () => {
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIncident, setSelectedIncident] = useState<FailureIncident | null>(null);

  const isEmpty = !hasDocuments && INCIDENTS.length === 0;

  const categories = ["all", ...Array.from(new Set(INCIDENTS.map((i) => i.category)))];

  const filteredIncidents = INCIDENTS.filter((incident) => {
    const matchesSearch =
      !searchTerm ||
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.rootCause.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || incident.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "danger";
      case "high":
        return "warning";
      case "medium":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="text-[#8B5CF6]" /> Lessons Learned Engine
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse previous failures, find similar incidents, and apply preventive actions
          </p>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
            <BookOpen size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No Incident Data</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-4">
            Upload maintenance records and failure reports to build the lessons learned knowledge base.
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium hover:bg-[#3B82F6]/15 transition-colors"
          >
            <Upload size={12} />
            Upload Data
          </button>
        </div>
      ) : (
        <>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search incidents, assets, root causes..."
                className="w-full bg-[#111827] border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-[#3B82F6] transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30"
                      : "bg-[#111827] border border-gray-800 text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {cat === "all" ? "All Categories" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Incidents List */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-sm font-bold text-white mb-2">
                Previous Failures ({filteredIncidents.length})
              </h3>
              {filteredIncidents.length === 0 ? (
                <Card className="p-8 text-center text-gray-500 text-sm">
                  No incidents match your search criteria.
                </Card>
              ) : (
                filteredIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    onClick={() => setSelectedIncident(incident)}
                    className={`p-4 bg-[#111827]/60 border rounded-lg cursor-pointer transition-all hover:border-gray-700 ${
                      selectedIncident?.id === incident.id
                        ? "border-[#3B82F6]/50 bg-[#3B82F6]/5"
                        : "border-gray-800"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className="text-[#F59E0B]" />
                        <h4 className="text-sm font-bold text-white">{incident.title}</h4>
                      </div>
                      <Badge variant={getSeverityColor(incident.severity)} className="text-[10px]">
                        {incident.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Wrench size={10} /> {incident.asset}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {incident.date}
                      </span>
                      <span>{incident.downtimeHours}h downtime</span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{incident.rootCause}</p>
                    {incident.similarCount > 0 && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-[#8B5CF6]">
                        <GitBranch size={10} />
                        {incident.similarCount} similar incidents found
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Detail Panel */}
            <div className="space-y-6">
              {selectedIncident ? (
                <>
                  <Card className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-gray-800 bg-[#111827]/80">
                      <h3 className="text-sm font-bold text-white">Incident Details</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Asset</p>
                        <p className="text-sm text-white font-medium">{selectedIncident.asset}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Root Cause</p>
                        <p className="text-xs text-gray-300">{selectedIncident.rootCause}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Preventive Action</p>
                        <p className="text-xs text-gray-300">{selectedIncident.preventiveAction}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Resolved By</p>
                        <p className="text-xs text-gray-300">{selectedIncident.resolvedBy}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Downtime</p>
                        <p className="text-xs text-[#EF4444] font-bold">{selectedIncident.downtimeHours} hours</p>
                      </div>
                    </div>
                  </Card>
                </>
              ) : (
                <Card className="p-6 text-center text-gray-500 text-sm">
                  <Target size={24} className="mx-auto mb-2 text-gray-600" />
                  Select an incident to view details
                </Card>
              )}

              {/* Proactive Recommendations */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={16} className="text-[#F59E0B]" />
                  <h3 className="text-sm font-bold text-white">Proactive Recommendations</h3>
                </div>
                {RECOMMENDATIONS.length === 0 ? (
                  <p className="text-gray-500 text-xs text-center py-4">
                    No recommendations yet. Data will appear once incident patterns are analyzed.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {RECOMMENDATIONS.map((rec) => (
                      <div key={rec.id} className="p-3 bg-[#111827]/60 border border-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold text-white">{rec.title}</p>
                          <Badge variant={rec.priority === "high" ? "danger" : rec.priority === "medium" ? "warning" : "secondary"} className="text-[10px]">
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-gray-400 mb-1">{rec.description}</p>
                        <p className="text-[10px] text-gray-600">Based on: {rec.basedOn}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Similar Incidents */}
              {selectedIncident && selectedIncident.similarCount > 0 && (
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <GitBranch size={16} className="text-[#8B5CF6]" />
                    <h3 className="text-sm font-bold text-white">Similar Incidents</h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    Found {selectedIncident.similarCount} incidents with similar root causes.
                  </p>
                  <div className="space-y-2">
                    {INCIDENTS.filter(
                      (i) =>
                        i.id !== selectedIncident.id &&
                        i.category === selectedIncident.category
                    )
                      .slice(0, 3)
                      .map((i) => (
                        <div
                          key={i.id}
                          className="p-2 bg-[#111827]/40 border border-gray-800 rounded text-xs cursor-pointer hover:border-gray-700 transition-colors"
                          onClick={() => setSelectedIncident(i)}
                        >
                          <p className="text-white font-medium">{i.title}</p>
                          <p className="text-gray-500">{i.asset} — {i.date}</p>
                        </div>
                      ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
