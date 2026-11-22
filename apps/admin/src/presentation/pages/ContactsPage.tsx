import { Archive, ChevronRight, Mail, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AdminContact, AdminContactStatus } from "../../domain/contacts/types";
import { formatDate } from "../../domain/shared/format";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { ContactStatusBadge } from "../components/ui/StatusBadge";
import { useContacts, useUpdateContactStatus } from "../hooks/useAdminData";

const tabs: { key: AdminContactStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "Todos" },
  { key: "NEW", label: "Nuevos" },
  { key: "READ", label: "Leídos" },
  { key: "ARCHIVED", label: "Archivados" },
];

const localeLabel = { es: "ES", en: "EN" } as const;

const skeletonRows = ["s1", "s2", "s3", "s4", "s5"];

export function ContactsPage() {
  const [tab, setTab] = useState<AdminContactStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminContact | null>(null);
  const [updating, setUpdating] = useState(false);
  const contacts = useContacts();
  const updateStatus = useUpdateContactStatus();

  const all = contacts.data ?? [];
  const filtered = all.filter((contact) => {
    if (tab !== "ALL" && contact.status !== tab) return false;
    const query = search.trim().toLowerCase();
    if (
      query &&
      !`${contact.name} ${contact.email} ${contact.subject} ${contact.message}`
        .toLowerCase()
        .includes(query)
    ) {
      return false;
    }
    return true;
  });

  const handleStatus = async (contact: AdminContact, status: AdminContactStatus) => {
    setUpdating(true);

    try {
      await updateStatus.mutateAsync({ id: contact.id, status });
      toast.success("Contacto actualizado");
      setSelected(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el contacto");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 animate-admin-fade">
      <PageHeader
        eyebrow="Bandeja"
        title="Contactos"
        description="Mensajes de huéspedes, dudas y solicitudes. Responde rápido y no pierdas el contexto."
      />

      <div className="admin-card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {tabs.map((item) => {
              const count =
                item.key === "ALL"
                  ? all.length
                  : all.filter((contact) => contact.status === item.key).length;
              const active = tab === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTab(item.key)}
                  className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                    active
                      ? "bg-primary text-background"
                      : "text-muted hover:bg-surface-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                  <span className={`ml-1.5 ${active ? "text-background/60" : "text-muted/60"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <label className="relative w-full lg:w-72">
            <span className="sr-only">Buscar contactos</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, email o asunto"
              className="admin-input pl-9"
            />
          </label>
        </div>

        {contacts.isLoading ? (
          <div className="space-y-3 p-4">
            {skeletonRows.map((key) => (
              <div key={key} className="h-20 animate-pulse rounded-xl bg-surface-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Archive}
              title="No hay mensajes en esta vista"
              description="Prueba con otra categoría o limpia la búsqueda."
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    setTab("ALL");
                    setSearch("");
                  }}
                >
                  Limpiar filtros
                </Button>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((contact) => (
              <button
                key={contact.id}
                type="button"
                onClick={() => setSelected(contact)}
                className="flex w-full items-start gap-4 p-4 text-left transition hover:bg-surface-muted/40"
              >
                <Avatar name={contact.name} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{contact.subject}</p>
                    <span className="rounded-full border border-border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
                      {localeLabel[contact.locale]}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted">
                    {contact.name} · {contact.email}
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted/80">{contact.message}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <ContactStatusBadge status={contact.status} />
                  <span className="text-[10px] text-muted">{formatDate(contact.createdAt)}</span>
                </div>
                <ChevronRight className="mt-4 h-4 w-4 shrink-0 text-muted" />
              </button>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title={selected?.subject ?? ""}
        description={selected ? `${selected.name} · ${formatDate(selected.createdAt)}` : undefined}
        footer={
          selected ? (
            <>
              {selected.status !== "READ" && (
                <Button
                  variant="secondary"
                  disabled={updating}
                  onClick={() => void handleStatus(selected, "READ")}
                >
                  Marcar leído
                </Button>
              )}
              {selected.status !== "ARCHIVED" ? (
                <Button
                  variant="danger"
                  disabled={updating}
                  onClick={() => void handleStatus(selected, "ARCHIVED")}
                >
                  Archivar
                </Button>
              ) : (
                <Button
                  variant="primary"
                  disabled={updating}
                  onClick={() => void handleStatus(selected, "NEW")}
                >
                  Desarchivar
                </Button>
              )}
              <Button variant="ghost" onClick={() => setSelected(null)}>
                Cerrar
              </Button>
            </>
          ) : null
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <ContactStatusBadge status={selected.status} />
              <span className="text-xs text-muted">{localeLabel[selected.locale]}</span>
            </div>
            <p className="rounded-xl border border-border bg-surface-muted/50 p-4 text-sm leading-7 text-foreground">
              {selected.message}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-surface-muted/60 p-4">
                <p className="admin-label">Email</p>
                <a
                  href={`mailto:${selected.email}`}
                  className="mt-1 block text-sm text-foreground hover:text-accent"
                >
                  {selected.email}
                </a>
              </div>
              <div className="rounded-xl bg-surface-muted/60 p-4">
                <p className="admin-label">Teléfono</p>
                <a
                  href={`tel:${selected.phone.replace(/\s/g, "")}`}
                  className="mt-1 block text-sm text-foreground hover:text-accent"
                >
                  {selected.phone}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <Mail className="h-4 w-4" />
              Responder por email o teléfono
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
