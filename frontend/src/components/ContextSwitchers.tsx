import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const OrganizationSwitcher = () => {
  const { data: orgs } = useQuery({
    queryKey: ["userOrgs"],
    queryFn: async () => {
      const res = await api.get("/organizations");
      return res.data.data;
    }
  });

  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    localStorage.setItem("selected_org_id", e.target.value);
    window.location.reload(); // Refresh app context
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Org:</span>
      <select
        onChange={handleOrgChange}
        defaultValue={localStorage.getItem("selected_org_id") || ""}
        className="bg-primary-bg border border-gray-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-accent"
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
  const currentOrg = localStorage.getItem("selected_org_id");
  const { data: factories } = useQuery({
    queryKey: ["orgFactories", currentOrg],
    queryFn: async () => {
      if (!currentOrg) return [];
      const res = await api.get(`/factories?organization_id=${currentOrg}`);
      return res.data.data;
    },
    enabled: !!currentOrg
  });

  const handleFactoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    localStorage.setItem("selected_factory_id", e.target.value);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Factory:</span>
      <select
        onChange={handleFactoryChange}
        defaultValue={localStorage.getItem("selected_factory_id") || ""}
        className="bg-primary-bg border border-gray-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-accent"
      >
        <option value="">Select Factory</option>
        {factories?.map((fact: any) => (
          <option key={fact.id} value={fact.id}>{fact.name}</option>
        ))}
      </select>
    </div>
  );
};
