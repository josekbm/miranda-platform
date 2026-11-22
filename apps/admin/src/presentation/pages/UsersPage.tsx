import { UserRound } from "lucide-react";
import type { AdminRole, AdminUserStatus } from "../../domain/users/types";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { useUsers } from "../hooks/useAdminData";

const roleLabels: Record<AdminRole, string> = {
  ADMIN: "Administrador",
  MANAGER: "Manager",
  RECEPTIONIST: "Recepción",
};

const roleTone: Record<AdminRole, "info" | "accent" | "neutral"> = {
  ADMIN: "info",
  MANAGER: "accent",
  RECEPTIONIST: "neutral",
};

const statusLabel: Record<AdminUserStatus, string> = {
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
};

const skeletonRows = ["s1", "s2", "s3", "s4", "s5"];

export function UsersPage() {
  const users = useUsers();
  const data = users.data ?? [];

  return (
    <div className="space-y-6 animate-admin-fade">
      <PageHeader
        eyebrow="Equipo"
        title="Equipo"
        description="Personas con acceso al panel, roles y estado. La gestión de usuarios se conectará al API de administración."
      />

      {users.isLoading ? (
        <div className="space-y-3">
          {skeletonRows.map((key) => (
            <div key={key} className="h-16 animate-pulse rounded-2xl bg-surface-muted" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          icon={UserRound}
          title="No hay usuarios"
          description="Cuando añadas personal aparecerá aquí."
        />
      ) : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-surface-muted/60">
              <tr>
                <th className="admin-table-head px-4 py-3">Persona</th>
                <th className="admin-table-head px-4 py-3">Rol</th>
                <th className="admin-table-head px-4 py-3">Contacto</th>
                <th className="admin-table-head px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-border transition hover:bg-surface-muted/40"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} src={user.avatarUrl} />
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="mt-0.5 text-[11px] text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={roleTone[user.role]}>{roleLabels[user.role]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted">{user.phone}</td>
                  <td className="px-4 py-3">
                    <Badge tone={user.status === "ACTIVE" ? "success" : "neutral"}>
                      {statusLabel[user.status]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
