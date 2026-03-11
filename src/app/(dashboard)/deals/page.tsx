import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  formatCurrency,
  getStatusColor,
  DEAL_FASES,
} from "@/lib/utils";
import {
  Handshake,
  Plus,
  Search,
  Filter,
  Building2,
  User,
  Euro,
} from "lucide-react";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

const faseColors: Record<string, string> = {
  "oriëntatie": "bg-slate-100 border-slate-300",
  nda: "bg-sky-50 border-sky-300",
  documenten: "bg-blue-50 border-blue-300",
  bezichtiging: "bg-indigo-50 border-indigo-300",
  bieding: "bg-amber-50 border-amber-300",
  onderhandeling: "bg-orange-50 border-orange-300",
  due_diligence: "bg-purple-50 border-purple-300",
  afgerond: "bg-green-50 border-green-300",
  afgebroken: "bg-red-50 border-red-300",
};

const statusFilters = [
  { value: undefined, label: "Alles" },
  { value: "actief", label: "Actief" },
  { value: "succesvol", label: "Succesvol" },
  { value: "afgebroken", label: "Afgebroken" },
];

export default async function DealsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const statusFilter = params.status;

  const deals = await prisma.deal.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    orderBy: { updatedAt: "desc" },
    include: {
      paviljoen: { select: { naam: true } },
      koper: { select: { naam: true } },
    },
  });

  // Groepeer deals per fase
  const dealsByFase = new Map<string, typeof deals>();
  for (const fase of DEAL_FASES) {
    dealsByFase.set(fase.value, []);
  }
  for (const deal of deals) {
    const list = dealsByFase.get(deal.fase);
    if (list) {
      list.push(deal);
    } else {
      dealsByFase.set(deal.fase, [deal]);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Deals</h1>
          <p className="mt-1 text-sm text-text-muted">
            {deals.length} deal{deals.length !== 1 ? "s" : ""} in de pipeline
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4" />
          Nieuwe Deal
        </button>
      </div>

      {/* Status Filter */}
      <div className="card mb-6 flex flex-wrap items-center gap-4 p-4">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Filter className="h-4 w-4" />
          <span>Status:</span>
        </div>
        {statusFilters.map((s) => (
          <Link
            key={s.label}
            href={s.value ? `/deals?status=${s.value}` : "/deals"}
            className={`badge ${
              statusFilter === s.value || (!statusFilter && !s.value)
                ? "badge-active"
                : "badge-inactive"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {/* Kanban Pipeline */}
      {deals.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <Handshake className="mb-4 h-12 w-12 text-text-muted/40" />
          <h3 className="text-lg font-medium text-text">
            Geen deals gevonden
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            Pas de filters aan of maak een nieuwe deal aan.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4" style={{ minWidth: "fit-content" }}>
            {DEAL_FASES.map((fase) => {
              const faseDeals = dealsByFase.get(fase.value) || [];
              const colorClass =
                faseColors[fase.value] || "bg-gray-50 border-gray-300";

              return (
                <div
                  key={fase.value}
                  className={`w-72 shrink-0 rounded-xl border-t-4 ${colorClass} bg-white shadow-sm`}
                >
                  {/* Kolom header */}
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <h3 className="text-sm font-semibold text-text">
                      {fase.label}
                    </h3>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-text-muted">
                      {faseDeals.length}
                    </span>
                  </div>

                  {/* Deal kaarten */}
                  <div className="space-y-3 p-3">
                    {faseDeals.length === 0 ? (
                      <p className="py-4 text-center text-xs text-text-muted/60">
                        Geen deals
                      </p>
                    ) : (
                      faseDeals.map((deal) => (
                        <Link
                          key={deal.id}
                          href={`/deals/${deal.id}`}
                          className="block rounded-lg border border-gray-100 bg-white p-3 shadow-sm transition-all hover:shadow-md"
                        >
                          <p className="text-sm font-medium text-text truncate">
                            {deal.titel}
                          </p>

                          <div className="mt-2 space-y-1">
                            {deal.paviljoen && (
                              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                                <Building2 className="h-3 w-3 shrink-0" />
                                <span className="truncate">
                                  {deal.paviljoen.naam}
                                </span>
                              </div>
                            )}
                            {deal.koper && (
                              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                                <User className="h-3 w-3 shrink-0" />
                                <span className="truncate">
                                  {deal.koper.naam}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <span
                              className={`badge ${getStatusColor(deal.status)}`}
                            >
                              {deal.status}
                            </span>
                            {deal.biedingBedrag != null && (
                              <span className="flex items-center gap-0.5 text-xs font-semibold text-text">
                                <Euro className="h-3 w-3" />
                                {formatCurrency(deal.biedingBedrag)}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
