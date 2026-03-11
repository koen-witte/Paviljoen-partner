import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  formatCurrency,
  getStatusColor,
  PAVILJOEN_STATUSES,
} from "@/lib/utils";
import {
  Building2,
  MapPin,
  Plus,
  FileText,
  Handshake,
  ClipboardCheck,
  ChevronRight,
  Search,
  Umbrella,
} from "lucide-react";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function PaviljoenOverzicht({ searchParams }: PageProps) {
  const params = await searchParams;
  const statusFilter = params.status;

  const paviljoens = await prisma.paviljoen.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: {
          deals: true,
          documenten: true,
          mysteryVisits: true,
          kopiInteresses: true,
        },
      },
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Paviljoens</h1>
          <p className="mt-1 text-sm text-text-muted">
            {paviljoens.length} paviljoen{paviljoens.length !== 1 ? "s" : ""} in
            portefeuille
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4" />
          Nieuw Paviljoen
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6 flex flex-wrap items-center gap-4 p-4">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Search className="h-4 w-4" />
          <span>Filter:</span>
        </div>
        <Link
          href="/paviljoens"
          className={`badge ${
            !statusFilter ? "badge-active" : "badge-inactive"
          }`}
        >
          Alles
        </Link>
        {PAVILJOEN_STATUSES.map((s) => (
          <Link
            key={s.value}
            href={`/paviljoens?status=${s.value}`}
            className={`badge ${
              statusFilter === s.value
                ? getStatusColor(s.value)
                : "badge-inactive"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {paviljoens.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <Umbrella className="mb-4 h-12 w-12 text-text-muted/40" />
          <h3 className="text-lg font-medium text-text">
            Geen paviljoens gevonden
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            {statusFilter
              ? "Pas de filters aan of voeg een nieuw paviljoen toe."
              : "Voeg je eerste paviljoen toe om te beginnen."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {paviljoens.map((p) => (
            <Link
              key={p.id}
              href={`/paviljoens/${p.id}`}
              className="card group flex flex-col overflow-hidden"
            >
              {/* Image / placeholder */}
              <div
                className="flex h-40 items-center justify-center"
                style={{ backgroundColor: "#eef2f7" }}
              >
                {p.foto ? (
                  <img
                    src={p.foto}
                    alt={p.naam}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-10 w-10 text-text-muted/30" />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-text group-hover:text-primary">
                      {p.naam}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 text-sm text-text-muted">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{p.locatie}</span>
                    </p>
                  </div>
                  <span className={`badge shrink-0 ${getStatusColor(p.status)}`}>
                    {PAVILJOEN_STATUSES.find((s) => s.value === p.status)
                      ?.label || p.status}
                  </span>
                </div>

                {/* Meta */}
                <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                  {p.typeExploitatie && (
                    <span className="capitalize">{p.typeExploitatie}</span>
                  )}
                  {p.vraagprijs != null && (
                    <span className="font-medium text-text">
                      {formatCurrency(p.vraagprijs)}
                    </span>
                  )}
                </div>

                {/* Counts */}
                <div className="mt-auto flex items-center gap-4 border-t border-border pt-3 text-xs text-text-muted">
                  <span className="flex items-center gap-1" title="Deals">
                    <Handshake className="h-3.5 w-3.5" />
                    {p._count.deals}
                  </span>
                  <span className="flex items-center gap-1" title="Documenten">
                    <FileText className="h-3.5 w-3.5" />
                    {p._count.documenten}
                  </span>
                  <span
                    className="flex items-center gap-1"
                    title="Mystery Visits"
                  >
                    <ClipboardCheck className="h-3.5 w-3.5" />
                    {p._count.mysteryVisits}
                  </span>
                  <ChevronRight className="ml-auto h-4 w-4 text-text-muted/40 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
