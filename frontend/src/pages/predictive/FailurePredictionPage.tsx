import React from "react";
import { useParams, Link } from "react-router-dom";
import { RulChart } from "@/components/predictive/RulChart";
import { Card } from "@/components/ui/Card";
import { useOnboardingStore } from "@/store/onboarding";
import { ArrowLeft, ShieldAlert, FileText, Wrench, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FailurePredictionPage = () => {
  const { id } = useParams<{ id: string }>();
  const { hasDocuments } = useOnboardingStore();
  const navigate = useNavigate();
  const isEmpty = !hasDocuments;

  const rulData: any[] = [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <Link to="/predictive" className="text-xs text-gray-500 hover:text-white flex items-center gap-1 mb-2">
            <ArrowLeft size={12} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Asset {id || ""} Failure Analysis
          </h1>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-4">
            <ShieldAlert size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">No Failure Prediction Data</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-4">
            Upload sensor data and maintenance records to enable failure prediction.
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 h-[400px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-white">Remaining Useful Life (RUL) Curve</h3>
                  <p className="text-xs text-gray-500 mt-1">Extrapolating degradation based on current telemetry</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-bold uppercase">Est. Time to Failure</p>
                  <p className="text-2xl font-black text-gray-500">—</p>
                </div>
              </div>
              <div className="flex-1 min-h-0 flex items-center justify-center text-gray-500 text-sm">
                RUL data will appear after processing sensor telemetry.
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-0 overflow-hidden border-gray-800">
              <div className="bg-secondary-bg/50 p-4 border-b border-gray-800 flex items-center gap-2">
                <ShieldAlert className="text-gray-500" size={18} />
                <h3 className="font-bold text-white text-sm">Failure Prediction</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Likely Failure Mode</p>
                  <p className="text-lg font-bold text-gray-500">—</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Confidence Score</p>
                  <p className="text-lg font-mono text-gray-500">—</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Wrench size={16} className="text-info"/> Suggested Spare Parts</h3>
              <p className="text-gray-500 text-xs text-center py-4">
                Spare parts suggestions will appear after failure analysis.
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
