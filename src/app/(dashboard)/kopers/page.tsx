import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  formatCurrency,
  getStatusColor,
  getInitials,
  KOPER_STATUSES,
} from "@/lib/utils";
import {
  Plus,
  Search,
  Users,
  Building2,
  MapPin,
  Heart,
  ChevronRight,
  Euro,
} from "lucide-react";

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

export default async function KopersOverzicht({ searchParams }: PageProps) {
  const params = await searchParams;
  const statusFilter = params.status;
  const searchQuery = params.q;

  const kopers = await prisma.koper.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(searchQuery
        ? {
            OR: [
              { naam: { contains: searchQuery } },
              { bedrijfsnaam: { contains: searchQuery } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: {
          interesses: true,
          deals: true,
          communications: true,
        },
      },
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Kopers</h1>
          <p className="mt-1 text-sm text-text-muted">
            {kopers.length} koper{kopers.length !== 1 ? "s" : ""} in CRM
          </p>
        </div>
        <Link href="/kopers" className="btn-primary">
          <Plus className="h-4 w-4" />
          Nieuwe Koper
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-6 flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Search className="h-4 w-4" />
            <span>Status:</span>
          </div>
          <Link
            href={`/kopers${searchQuery ? `?q=${searchQuery}` : ""}`}
            className={`badge ${!statusFilter ? "badge-active" : "badge-inactive"}`}
          >
            Alles
          </Link>
          {KOPER_STATUSES.map((s) => (
            <Link
              key={s.value}
              href={`/kopers?status=${s.value}${searchQuery ? `&q=${searchQuery}` : ""}`}
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

        {/* Search */}
        <form className="sm:ml-auto" action="/kopers" method="GET">
          {statusFilter && (
            <input type="hidden" name="status" value={statusFilter} />
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              name="q"
              placeholder="Zoek op naam..."
              defaultValue={searchQuery || ""}
              className="pl-9 pr-4 py-2 text-sm w-full sm:w-64"
            />
          </div>
        </form>
      </div>

      {/* List */}
      {kopers.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <Users className="mb-4 h-12 w-12 text-text-muted/40" />
          <h3 className="text-lg font-medium text-text">
            Geen kopers gevonden
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            {statusFilter || searchQuery
              ? "Pas de filters aan of voeg een nieuwe koper toe."
              : "Voeg je eerste koper toe om te beginnen."}
          </p>
        </div>
      ) : (
        <div className="card divide-y divide-border overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-5 py-3 text-xs font-medium uppercase tracking-wider text-text-muted bg-bg">
            <div className="col-span-3">Naam</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Budget</div>
            <div className="col-span-2">Regio</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-center">Interesses</div>
            <div className="col-span-1"></div>
          </div>

          {kopers.map((koper) => (
            <Link
              key={koper.id}
              href={`/kopers/${koper.id}`}
              className="group flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-bg/50 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4"
            >
              {/* Name + company */}
              <div className="col-span-3 flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {getInitials(koper.naam)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text group-hover:text-primary">
                    {koper.naam}
                  </p>
                  {koper.bedrijfsnaam && (
                    <p className="truncate text-xs text-text-muted flex items-center gap-1">
                      <Building2 className="h-3 w-3 shrink-0" />
                      {koper.bedrijfsnaam}
                    </p>
                  )}
                </div>
              </div>

              {/* Type */}
              <div className="col-span-2 text-sm text-text-muted capitalize">
                {koper.type || "-"}
              </div>

              {/* Budget */}
              <div className="col-span-2 text-sm text-text">
                <span className="flex items-center gap-1">
                  <Euro className="h-3.5 w-3.5 text-text-muted sm:hidden" />
                  {koper.budget
                    ? `${formatCurrency(koper.budget)}${koper.budgetMax ? ` - ${formatCurrency(koper.budgetMax)}` : ""}`
                    : "-"}
                </span>
              </div>

              {/* Regio */}
              <div className="col-span-2 text-sm text-text-muted">
                {koper.regio ? (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{koper.regio}</span>
                  </span>
                ) : (
                  "-"
                )}
              </div>

              {/* Status */}
              <div className="col-span-1">
                <span className={`badge ${getStatusColor(koper.status)}`}>
                  {KOPER_STATUSES.find((s) => s.value === koper.status)?.label ||
                    koper.status}
                </span>
              </div>

              {/* Interest count */}
              <div className="col-span-1 flex justify-center">
                <span
                  className="flex items-center gap-1 text-sm text-text-muted"
                  title="Interesses"
                >
                  <Heart className="h-3.5 w-3.5" />
                  {koper._count.interesses}
                </span>
              </div>

              {/* Arrow */}
              <div className="col-span-1 hidden sm:flex sm:justify-end">
                <ChevronRight className="h-4 w-4 text-text-muted/40 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
