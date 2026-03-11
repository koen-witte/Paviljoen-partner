import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  getStatusColor,
  PAVILJOEN_STATUSES,
} from "@/lib/utils";
import {
  Building2,
  MapPin,
  Plus,
  ChevronRight,
  Search,
  Umbrella,
  Globe,
  Phone,
} from "lucide-react";

interface PageProps {
  searchParams: Promise<{ status?: string; badplaats?: string }>;
}

export default async function PaviljoenOverzicht({ searchParams }: PageProps) {
  const params = await searchParams;
  const statusFilter = params.status;
  const badplaatsFilter = params.badplaats;

  const where: Record<string, unknown> = {};
  if (statusFilter) where.status = statusFilter;
  if (badplaatsFilter) where.badplaats = badplaatsFilter;

  const paviljoens = await prisma.paviljoen.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    orderBy: [{ badplaats: "asc" }, { naam: "asc" }],
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

  // Group by badplaats
  const grouped = paviljoens.reduce<Record<string, typeof paviljoens>>(
    (acc, p) => {
      const key = p.badplaats || "Overig";
      if (!acc[key]) acc[key] = [];
      acc[key].push(p);
      return acc;
    },
    {}
  );

  // Get all unique badplaatsen for filter
  const allBadplaatsen = await prisma.paviljoen.findMany({
    select: { badplaats: true },
    distinct: ["badplaats"],
    orderBy: { badplaats: "asc" },
  });
  const badplaatsList = allBadplaatsen
    .map((b) => b.badplaats)
    .filter(Boolean) as string[];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Strandpaviljoens Nederland</h1>
          <p className="mt-1 text-sm text-text-muted">
            {paviljoens.length} paviljoen{paviljoens.length !== 1 ? "s" : ""}{" "}
            {badplaatsFilter ? `in ${badplaatsFilter}` : `in ${Object.keys(grouped).length} badplaatsen`}
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4" />
          Nieuw Paviljoen
        </button>
      </div>

      {/* Badplaats filter */}
      <div className="card mb-4 p-4">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
          <MapPin className="h-4 w-4" />
          <span className="font-medium">Badplaats:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/paviljoens"
            className={`badge ${!badplaatsFilter && !statusFilter ? "badge-active" : "badge-inactive"}`}
          >
            Alle badplaatsen
          </Link>
          {badplaatsList.map((bp) => (
            <Link
              key={bp}
              href={`/paviljoens?badplaats=${encodeURIComponent(bp)}`}
              className={`badge ${badplaatsFilter === bp ? "badge-active" : "badge-inactive"}`}
            >
              {bp}
            </Link>
          ))}
        </div>
      </div>

      {/* Status filter */}
      <div className="card mb-6 flex flex-wrap items-center gap-4 p-4">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Search className="h-4 w-4" />
          <span>Status:</span>
        </div>
        <Link
          href={badplaatsFilter ? `/paviljoens?badplaats=${encodeURIComponent(badplaatsFilter)}` : "/paviljoens"}
          className={`badge ${!statusFilter ? "badge-active" : "badge-inactive"}`}
        >
          Alles
        </Link>
        {PAVILJOEN_STATUSES.map((s) => (
          <Link
            key={s.value}
            href={`/paviljoens?status=${s.value}${badplaatsFilter ? `&badplaats=${encodeURIComponent(badplaatsFilter)}` : ""}`}
            className={`badge ${statusFilter === s.value ? getStatusColor(s.value) : "badge-inactive"}`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {/* Content */}
      {paviljoens.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <Umbrella className="mb-4 h-12 w-12 text-text-muted/40" />
          <h3 className="text-lg font-medium text-text">
            Geen paviljoens gevonden
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            Pas de filters aan of voeg een nieuw paviljoen toe.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([badplaats, items]) => (
              <div key={badplaats}>
                <div className="mb-4 flex items-center gap-2">
                  <h2 className="text-lg font-bold text-text">{badplaats}</h2>
                  <span className="badge badge-inactive text-xs">
                    {items.length} paviljoen{items.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-xs text-text-muted">
                    {items[0]?.provincie}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((p) => (
                    <Link
                      key={p.id}
                      href={`/paviljoens/${p.id}`}
                      className="card group flex flex-col overflow-hidden"
                    >
                      <div className="flex flex-1 flex-col p-4">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-text group-hover:text-primary">
                              {p.naam}
                            </h3>
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">{p.locatie}</span>
                            </p>
                          </div>
                          <span className={`badge shrink-0 text-xs ${getStatusColor(p.status)}`}>
                            {PAVILJOEN_STATUSES.find((s) => s.value === p.status)?.label || p.status}
                          </span>
                        </div>

                        {/* Contact info */}
                        <div className="mb-2 space-y-1 text-xs text-text-muted">
                          {p.website && (
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3 shrink-0" />
                              <span className="truncate">{p.website.replace(/^https?:\/\//, "")}</span>
                            </span>
                          )}
                          {p.telefoon && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3 shrink-0" />
                              {p.telefoon}
                            </span>
                          )}
                        </div>

                        {/* Type */}
                        <div className="mt-auto flex items-center justify-between border-t border-border pt-2 text-xs text-text-muted">
                          {p.typeExploitatie && (
                            <span className="capitalize">{p.typeExploitatie}</span>
                          )}
                          <ChevronRight className="ml-auto h-4 w-4 text-text-muted/40 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
