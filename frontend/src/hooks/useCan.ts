import { useAuthStore } from "@/store/auth";

export type Permission = "view" | "create" | "edit" | "delete" | "upload" | "chat";

export function useCan(action: Permission, resource?: string): boolean {
  const user = useAuthStore((s) => s.user);

  if (!user) return false;
  if (user.role === "SUPER_ADMIN" || user.role === "Super Admin") return true;

  if (!user.permissions) return user.role === "demo" && (action === "view" || action === "upload" || action === "chat");

  if (resource) return user.permissions.includes(`${resource}.${action}`) || user.permissions.includes("*.*");
  return user.permissions.includes(`*.${action}`) || user.permissions.includes("*.*");
}

export function useCanOn(resource: string): {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canUpload: boolean;
  canChat: boolean;
} {
  const user = useAuthStore((s) => s.user);
  const isDemo = user?.role === "demo";

  return {
    canView: isDemo || !user || useCan("view", resource),
    canCreate: useCan("create", resource),
    canEdit: useCan("edit", resource),
    canDelete: useCan("delete", resource),
    canUpload: isDemo || useCan("upload"),
    canChat: isDemo || useCan("chat"),
  };
}
