import { Link } from "react-router-dom";
import { Cpu, ShieldAlert, ArrowLeft } from "lucide-react";

export const AccountLockedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1220] px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 mb-4">
            <Cpu size={28} className="text-[#3B82F6]" />
          </div>
          <h1 className="text-2xl font-bold text-white">MechaMind OS 2.0</h1>
        </div>

        {/* Card */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-8 shadow-2xl shadow-black/40 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#EF4444]/10 mb-4">
            <ShieldAlert size={28} className="text-[#EF4444]" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Account Locked</h2>
          <p className="text-sm text-gray-400 mb-6">
            Your account has been temporarily locked due to too many failed
            login attempts. Please use account recovery or contact your
            administrator for assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/forgot-password"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Recovery
            </Link>
            <Link
              to="/login"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium py-2.5 rounded-lg border border-gray-700 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
