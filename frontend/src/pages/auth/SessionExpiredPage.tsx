import { Link } from "react-router-dom";
import { Cpu, Clock } from "lucide-react";

export const SessionExpiredPage = () => {
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#F59E0B]/10 mb-4">
            <Clock size={28} className="text-[#F59E0B]" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Session Expired
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Your session has expired due to inactivity. For your security,
            please sign in again to continue.
          </p>
          <Link
            to="/login"
            className="block w-full text-center bg-[#3B82F6] hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Sign in again
          </Link>
        </div>
      </div>
    </div>
  );
};
