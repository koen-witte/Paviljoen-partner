import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate, COMMUNICATION_TYPES } from "@/lib/utils";
import {
  Mail,
  Phone,
  MessageSquare,
  StickyNote,
  Users,
  Megaphone,
  Plus,
  Filter,
  Building2,
  User,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";

interface PageProps {
  searchParams: Promise<{ type?: string }>;
}

const typeIcons: Record<string, typeof Mail> = {
  email: Mail,
  telefoon: Phone,
  whatsapp: MessageSquare,
  notitie: StickyNote,
  vergadering: Users,
  intern: Megaphone,
};

const typeColors: Record<string, string> = {
  email: "bg-blue-100 text-blue-600",
  telefoon: "bg-green-100 text-green-600",
  whatsapp: "bg-emerald-100 text-emerald-600",
  notitie: "bg-amber-100 text-amber-600",
  vergadering: "bg-purple-100 text-purple-600",
  intern: "bg-gray-100 text-gray-600",
};

const richtingIcons: Record<string, typeof ArrowDownLeft> = {
  inkomend: ArrowDownLeft,
  uitgaand: ArrowUpRight,
  intern: RotateCcw,
};

export default async function CommunicatiePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const typeFilter = params.type;

  const communications = await prisma.communication.findMany({
    where: typeFilter ? { type: typeFilter } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      koper: { select: { naam: true } },
      paviljoen: { select: { naam: true } },
      user: { select: { name: true } },
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Communicatie</h1>
          <p className="mt-1 text-sm text-text-muted">
            {communications.length} bericht{communications.length !== 1 ? "en" : ""} in het overzicht
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4" />
          Nieuw Bericht
        </button>
      </div>

      {/* Type Filter */}
      <div className="card mb-6 flex flex-wrap items-center gap-3 p-4">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Filter className="h-4 w-4" />
          <span>Type:</span>
        </div>
        <Link
          href="/communicatie"
          className={`badge ${!typeFilter ? "badge-active" : "badge-inactive"}`}
        >
          Alles
        </Link>
        {COMMUNICATION_TYPES.map((ct) => (
          <Link
            key={ct.value}
            href={`/communicatie?type=${ct.value}`}
            className={`badge ${
              typeFilter === ct.value ? "badge-active" : "badge-inactive"
            }`}
          >
            {ct.label}
          </Link>
        ))}
      </div>

      {/* Tijdlijn */}
      {communications.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <Mail className="mb-4 h-12 w-12 text-text-muted/40" />
          <h3 className="text-lg font-medium text-text">
            Geen berichten gevonden
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            Pas de filters aan of voeg een nieuw bericht toe.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Verticale lijn */}
          <div className="absolute left-6 top-0 hidden h-full w-px bg-gray-200 sm:block" />

          <div className="space-y-4">
            {communications.map((comm) => {
              const Icon = typeIcons[comm.type] || Mail;
              const colorClass = typeColors[comm.type] || "bg-gray-100 text-gray-600";
              const RichtingIcon = comm.richting
                ? richtingIcons[comm.richting]
                : null;

              return (
                <div key={comm.id} className="relative flex gap-4">
                  {/* Icoon */}
                  <div
                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${colorClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Inhoud */}
                  <div className="card flex-1 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-text truncate">
                            {comm.onderwerp || "Geen onderwerp"}
                          </h3>
                          {RichtingIcon && (
                            <RichtingIcon className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                          )}
                        </div>
                        <p className="mt-1 text-sm text-text-muted line-clamp-2">
                          {comm.inhoud}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-text-muted">
                        {formatDate(comm.createdAt)}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}
                      >
                        {COMMUNICATION_TYPES.find((t) => t.value === comm.type)
                          ?.label || comm.type}
                      </span>
                      {comm.koper && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {comm.koper.naam}
                        </span>
                      )}
                      {comm.paviljoen && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {comm.paviljoen.naam}
                        </span>
                      )}
                      {comm.user && (
                        <span className="text-text-muted/60">
                          door {comm.user.name}
                        </span>
                      )}
                    </div>
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
