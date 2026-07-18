import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const OrganizationSwitcher = () => {
  const queryClient = useQueryClient();
  const { data: orgs } = useQuery({
    queryKey: ["userOrgs"],
    queryFn: async () => {
      try {
        const res = await api.get("/organizations");
        return res.data.data || [];
      } catch {
        return [];
      }
    },
  });

  const selectedOrg = localStorage.getItem("selected_org_id") || "";

  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      localStorage.setItem("selected_org_id", value);
    } else {
      localStorage.removeItem("selected_org_id");
    }
    queryClient.invalidateQueries({ queryKey: ["executiveKPIs"] });
    queryClient.invalidateQueries({ queryKey: ["orgFactories"] });
  };

  if (!orgs || orgs.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:inline">Org:</span>
      <select
        onChange={handleOrgChange}
        value={selectedOrg}
        className="bg-primary-bg border border-gray-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-accent transition-colors cursor-pointer"
      >
        <option value="">Default Organization</option>
        {orgs?.map((org: any) => (
          <option key={org.id} value={org.id}>{org.name}</option>
        ))}
      </select>
    </div>
  );
};

export const FactorySwitcher = () => {
  const queryClient = useQueryClient();
  const currentOrg = localStorage.getItem("selected_org_id");
  const selectedFactory = localStorage.getItem("selected_factory_id") || "";

  const { data: factories } = useQuery({
    queryKey: ["orgFactories", currentOrg],
    queryFn: async () => {
      if (!currentOrg) return [];
      try {
        const res = await api.get(`/factories?organization_id=${currentOrg}`);
        return res.data.data || [];
      } catch {
        return [];
      }
    },
    enabled: !!currentOrg,
  });

  const handleFactoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      localStorage.setItem("selected_factory_id", value);
    } else {
      localStorage.removeItem("selected_factory_id");
    }
    queryClient.invalidateQueries({ queryKey: ["executiveKPIs"] });
  };

  if (!currentOrg || !factories || factories.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:inline">Factory:</span>
      <select
        onChange={handleFactoryChange}
        value={selectedFactory}
        className="bg-primary-bg border border-gray-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-accent transition-colors cursor-pointer"
      >
        <option value="">Select Factory</option>
        {factories?.map((fact: any) => (
          <option key={fact.id} value={fact.id}>{fact.name}</option>
        ))}
      </select>
    </div>
  );
};
