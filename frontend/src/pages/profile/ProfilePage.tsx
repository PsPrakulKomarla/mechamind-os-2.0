import React from "react";
import { useUserProfile } from "@/hooks/useAuthQueries";

export const ProfilePage = () => {
  const { data: user, isLoading } = useUserProfile();

  if (isLoading) {
    return <div className="p-8 text-gray-400">Loading user profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-secondary-bg border border-gray-800 rounded-lg mt-8">
      <h1 className="text-2xl font-bold text-white mb-6">Profile Settings</h1>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">First Name</label>
            <div className="bg-primary-bg border border-gray-700 rounded px-3 py-2 text-white">
              {user?.first_name}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Last Name</label>
            <div className="bg-primary-bg border border-gray-700 rounded px-3 py-2 text-white">
              {user?.last_name}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
          <div className="bg-primary-bg border border-gray-700 rounded px-3 py-2 text-white">
            {user?.email}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Organization ID</label>
          <div className="bg-primary-bg border border-gray-700 rounded px-3 py-2 text-white">
            {user?.organization_id}
          </div>
        </div>
      </div>
      
      <div className="mt-12 border-t border-gray-800 pt-8">
        <h2 className="text-xl font-bold text-white mb-4">Security</h2>
        <div className="bg-primary-bg border border-gray-800 rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="text-md font-semibold text-white">Two-Factor Authentication (MFA)</h3>
            <p className="text-sm text-gray-400 mt-1">Add an extra layer of security to your account.</p>
          </div>
          <button 
            onClick={() => alert("MFA Enrollment flow would open here")}
            className="bg-accent hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Enable MFA
          </button>
        </div>
      </div>
    </div>
  );
};
