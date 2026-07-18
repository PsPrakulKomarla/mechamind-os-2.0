import React from "react";
import { useUserProfile } from "@/hooks/useAuthQueries";
import { useAuthStore } from "@/store/auth";
import { User, Mail, Building2, Shield, Save } from "lucide-react";

export const ProfilePage = () => {
  const { data: user, isLoading } = useUserProfile();
  const authUser = useAuthStore((s) => s.user);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-card-bg rounded" />
        <div className="h-64 bg-card-bg rounded-lg" />
      </div>
    );
  }

  const displayUser = user || authUser;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Profile Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-card-bg border border-gray-800 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="h-24 bg-gradient-to-r from-accent/20 to-blue-600/20" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end gap-4 mb-6">
            <div className="w-20 h-20 rounded-xl bg-accent/20 border-4 border-card-bg flex items-center justify-center">
              <User size={32} className="text-accent" />
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-bold text-white">
                {displayUser?.first_name} {displayUser?.last_name}
              </h2>
              <p className="text-sm text-gray-400">{displayUser?.email}</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary-bg rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <User size={14} />
                <span className="text-xs font-semibold uppercase tracking-wider">Name</span>
              </div>
              <p className="text-white font-medium">
                {displayUser?.first_name} {displayUser?.last_name}
              </p>
            </div>
            <div className="bg-primary-bg rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Mail size={14} />
                <span className="text-xs font-semibold uppercase tracking-wider">Email</span>
              </div>
              <p className="text-white font-medium">{displayUser?.email}</p>
            </div>
            <div className="bg-primary-bg rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Building2 size={14} />
                <span className="text-xs font-semibold uppercase tracking-wider">Organization</span>
              </div>
              <p className="text-white font-medium font-mono text-sm">
                {displayUser?.organization_id?.slice(0, 8)}...
              </p>
            </div>
            <div className="bg-primary-bg rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Shield size={14} />
                <span className="text-xs font-semibold uppercase tracking-wider">Status</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                <span className="w-1.5 h-1.5 bg-success rounded-full" />
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-card-bg border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-primary-bg rounded-lg border border-gray-800">
            <div>
              <p className="text-sm font-medium text-white">Password</p>
              <p className="text-xs text-gray-500">Last changed 30 days ago</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
              Change Password
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-primary-bg rounded-lg border border-gray-800">
            <div>
              <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-accent bg-accent/10 hover:bg-accent/20 rounded-lg transition-colors">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
