import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getInitials,
  KOPER_STATUSES,
} from "@/lib/utils";
import Tabs from "@/components/ui/Tabs";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  MapPin,
  User,
  Users,
  Euro,
  Tag,
  Heart,
  Handshake,
  MessageSquare,
  CheckSquare,
  ExternalLink,
  Clock,
  FileText,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function KoperDetailPage({ params }: PageProps) {
  const { id } = await params;

  const koper = await prisma.koper.findUnique({
    where: { id },
    include: {
      interesses: {
        include: { paviljoen: true },
        orderBy: { createdAt: "desc" },
      },
      deals: {
        include: { paviljoen: true },
        orderBy: { createdAt: "desc" },
      },
      communications: {
        orderBy: { createdAt: "desc" },
      },
      tasks: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!koper) {
    notFound();
  }

  const statusLabel =
    KOPER_STATUSES.find((s) => s.value === koper.status)?.label || koper.status;

  return (
    <div>
      {/* Back button */}
      <Link
        href="/kopers"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Terug naar kopers
      </Link>

      {/* Header */}
      <div className="card mb-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {getInitials(koper.naam)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text">{koper.naam}</h1>
              {koper.bedrijfsnaam && (
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-text-muted">
                  <Building2 className="h-4 w-4" />
                  {koper.bedrijfsnaam}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className={`badge ${getStatusColor(koper.status)}`}>
                  {statusLabel}
                </span>
                {koper.type && (
                  <span className="badge badge-inactive capitalize">
                    {koper.type}
                  </span>
                )}
                {koper.bron && (
                  <span className="text-xs text-text-muted">
                    Bron: {koper.bron}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-text">
                {koper.interesses.length}
              </p>
              <p className="text-xs text-text-muted">Interesses</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text">
                {koper.deals.length}
              </p>
              <p className="text-xs text-text-muted">Deals</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text">
                {koper.communications.length}
              </p>
              <p className="text-xs text-text-muted">Berichten</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card p-6">
        <Tabs
          tabs={[
            {
              id: "overzicht",
              label: "Overzicht",
              icon: <User className="h-4 w-4" />,
              content: <OverzichtTab koper={koper} />,
            },
            {
              id: "interesses",
              label: `Interesses (${koper.interesses.length})`,
              icon: <Heart className="h-4 w-4" />,
              content: <InteressesTab interesses={koper.interesses} />,
            },
            {
              id: "deals",
              label: `Deals (${koper.deals.length})`,
              icon: <Handshake className="h-4 w-4" />,
              content: <DealsTab deals={koper.deals} />,
            },
            {
              id: "communicatie",
              label: `Communicatie (${koper.communications.length})`,
              icon: <MessageSquare className="h-4 w-4" />,
              content: (
                <CommunicatieTab communications={koper.communications} />
              ),
            },
            {
              id: "taken",
              label: `Taken (${koper.tasks.length})`,
              icon: <CheckSquare className="h-4 w-4" />,
              content: <TakenTab tasks={koper.tasks} />,
            },
          ]}
        />
      </div>
    </div>
  );
}

/* ==================== TAB COMPONENTS ==================== */

function OverzichtTab({ koper }: { koper: any }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Contact info */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
          Contactgegevens
        </h3>
        <div className="space-y-3">
          {koper.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 shrink-0 text-text-muted" />
              <a
                href={`mailto:${koper.email}`}
                className="text-primary hover:underline"
              >
                {koper.email}
              </a>
            </div>
          )}
          {koper.telefoon && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 shrink-0 text-text-muted" />
              <a
                href={`tel:${koper.telefoon}`}
                className="text-primary hover:underline"
              >
                {koper.telefoon}
              </a>
            </div>
          )}
          {koper.bedrijfsnaam && (
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="h-4 w-4 shrink-0 text-text-muted" />
              <span>{koper.bedrijfsnaam}</span>
            </div>
          )}
          {koper.type && (
            <div className="flex items-center gap-3 text-sm">
              <Tag className="h-4 w-4 shrink-0 text-text-muted" />
              <span className="capitalize">{koper.type}</span>
            </div>
          )}
          {koper.regio && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 shrink-0 text-text-muted" />
              <span>{koper.regio}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Euro className="h-4 w-4 shrink-0 text-text-muted" />
            <span>
              {koper.budget
                ? `${formatCurrency(koper.budget)}${koper.budgetMax ? ` - ${formatCurrency(koper.budgetMax)}` : ""}`
                : "Niet opgegeven"}
            </span>
          </div>
        </div>
      </div>

      {/* Notities */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
          Notities
        </h3>
        {koper.notities ? (
          <p className="whitespace-pre-wrap text-sm text-text leading-relaxed">
            {koper.notities}
          </p>
        ) : (
          <p className="text-sm text-text-muted italic">Geen notities</p>
        )}
      </div>

      {/* Metadata */}
      <div className="lg:col-span-2 border-t border-border pt-4">
        <div className="flex flex-wrap gap-6 text-xs text-text-muted">
          <span>Aangemaakt: {formatDate(koper.createdAt)}</span>
          <span>Laatst bijgewerkt: {formatDate(koper.updatedAt)}</span>
          {koper.bron && <span>Bron: {koper.bron}</span>}
        </div>
      </div>
    </div>
  );
}

function InteressesTab({ interesses }: { interesses: any[] }) {
  const niveauColors: Record<string, string> = {
    interesse: "badge-inactive",
    bezichtiging: "badge-pending",
    bieding: "badge-active",
    onderhandeling: "badge-sold",
  };

  if (interesses.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <Heart className="mb-3 h-10 w-10 text-text-muted/30" />
        <p className="text-sm text-text-muted">
          Nog geen interesses geregistreerd
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {interesses.map((interesse) => (
        <div
          key={interesse.id}
          className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
        >
          <div className="min-w-0">
            <Link
              href={`/paviljoens/${interesse.paviljoen.id}`}
              className="flex items-center gap-2 text-sm font-medium text-text hover:text-primary"
            >
              {interesse.paviljoen.naam}
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </Link>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
              <MapPin className="h-3 w-3" />
              {interesse.paviljoen.locatie}
            </p>
            {interesse.notities && (
              <p className="mt-1 text-xs text-text-muted">
                {interesse.notities}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span
              className={`badge ${niveauColors[interesse.niveau] || "badge-inactive"}`}
            >
              {interesse.niveau}
            </span>
            <span className="text-xs text-text-muted">
              {formatDate(interesse.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DealsTab({ deals }: { deals: any[] }) {
  if (deals.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <Handshake className="mb-3 h-10 w-10 text-text-muted/30" />
        <p className="text-sm text-text-muted">Nog geen deals</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {deals.map((deal) => (
        <div
          key={deal.id}
          className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-text">{deal.titel}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
              <Building2 className="h-3 w-3" />
              {deal.paviljoen.naam}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`badge ${getStatusColor(deal.status)}`}>
              {deal.status}
            </span>
            <span className="badge badge-inactive">{deal.fase}</span>
            {deal.biedingBedrag && (
              <span className="text-sm font-medium text-text">
                {formatCurrency(deal.biedingBedrag)}
              </span>
            )}
            <span className="text-xs text-text-muted">
              {formatDate(deal.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CommunicatieTab({ communications }: { communications: any[] }) {
  const typeIcons: Record<string, React.ReactNode> = {
    email: <Mail className="h-4 w-4" />,
    telefoon: <Phone className="h-4 w-4" />,
    whatsapp: <MessageSquare className="h-4 w-4" />,
    notitie: <FileText className="h-4 w-4" />,
    vergadering: <Users className="h-4 w-4" />,
    intern: <MessageSquare className="h-4 w-4" />,
  };

  if (communications.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <MessageSquare className="mb-3 h-10 w-10 text-text-muted/30" />
        <p className="text-sm text-text-muted">Nog geen communicatie</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-6">
        {communications.map((comm) => (
          <div key={comm.id} className="relative flex gap-4 pl-2">
            {/* Timeline dot */}
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface border border-border text-text-muted">
              {typeIcons[comm.type] || <MessageSquare className="h-4 w-4" />}
            </div>

            <div className="min-w-0 flex-1 pb-2">
              <div className="flex items-center gap-2">
                <span className="badge badge-inactive capitalize">
                  {comm.type}
                </span>
                {comm.richting && (
                  <span className="text-xs text-text-muted capitalize">
                    {comm.richting}
                  </span>
                )}
                <span className="ml-auto flex items-center gap-1 text-xs text-text-muted">
                  <Clock className="h-3 w-3" />
                  {formatDate(comm.createdAt)}
                </span>
              </div>
              {comm.onderwerp && (
                <p className="mt-1 text-sm font-medium text-text">
                  {comm.onderwerp}
                </p>
              )}
              <p className="mt-1 whitespace-pre-wrap text-sm text-text-muted leading-relaxed">
                {comm.inhoud}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TakenTab({ tasks }: { tasks: any[] }) {
  const prioriteitColors: Record<string, string> = {
    laag: "badge-inactive",
    normaal: "badge-sold",
    hoog: "badge-pending",
    urgent: "bg-red-100 text-red-800",
  };

  const statusIcons: Record<string, string> = {
    open: "bg-yellow-400",
    in_progress: "bg-blue-400",
    afgerond: "bg-green-400",
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <CheckSquare className="mb-3 h-10 w-10 text-text-muted/30" />
        <p className="text-sm text-text-muted">Geen taken gekoppeld</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
        >
          <div
            className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${statusIcons[task.status] || "bg-gray-400"}`}
            title={task.status}
          />
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-medium ${task.status === "afgerond" ? "text-text-muted line-through" : "text-text"}`}
            >
              {task.titel}
            </p>
            {task.beschrijving && (
              <p className="mt-0.5 text-xs text-text-muted">
                {task.beschrijving}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`badge ${prioriteitColors[task.prioriteit] || "badge-inactive"}`}
              >
                {task.prioriteit}
              </span>
              <span className="badge badge-inactive">{task.status}</span>
              {task.deadline && (
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Clock className="h-3 w-3" />
                  {formatDate(task.deadline)}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
