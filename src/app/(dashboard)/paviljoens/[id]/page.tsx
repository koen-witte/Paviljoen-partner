import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getInitials,
  PAVILJOEN_STATUSES,
  DOCUMENT_CATEGORIES,
} from "@/lib/utils";
import Tabs from "@/components/ui/Tabs";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  FileText,
  ClipboardCheck,
  TrendingUp,
  Handshake,
  MessageSquare,
  Activity,
  Calendar,
  Ruler,
  UsersRound,
  Sun,
  Euro,
  Mail,
  Phone,
  Star,
  ExternalLink,
  Download,
  AlertCircle,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PaviljoenDetailPage({ params }: PageProps) {
  const { id } = await params;

  const paviljoen = await prisma.paviljoen.findUnique({
    where: { id },
    include: {
      contactpersonen: {
        orderBy: { createdAt: "desc" },
      },
      documenten: {
        orderBy: { createdAt: "desc" },
      },
      mysteryVisits: {
        orderBy: { datum: "desc" },
        include: {
          beoordelaar: true,
          scores: true,
        },
      },
      financials: {
        orderBy: [{ jaar: "desc" }, { maand: "asc" }],
      },
      kopiInteresses: {
        include: {
          koper: true,
        },
        orderBy: { updatedAt: "desc" },
      },
      deals: {
        include: {
          koper: true,
        },
        orderBy: { updatedAt: "desc" },
      },
      communications: {
        include: {
          user: true,
          koper: true,
        },
        orderBy: { createdAt: "desc" },
      },
      activities: {
        include: {
          user: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      fotos: {
        orderBy: { volgorde: "asc" },
      },
    },
  });

  if (!paviljoen) {
    notFound();
  }

  const statusLabel =
    PAVILJOEN_STATUSES.find((s) => s.value === paviljoen.status)?.label ||
    paviljoen.status;

  return (
    <div>
      {/* Back button + header */}
      <div className="mb-6">
        <Link
          href="/paviljoens"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar overzicht
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            {/* Photo / placeholder */}
            <div
              className="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: "#eef2f7" }}
            >
              {paviljoen.foto ? (
                <img
                  src={paviljoen.foto}
                  alt={paviljoen.naam}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <Building2 className="h-8 w-8 text-text-muted/30" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-text">
                  {paviljoen.naam}
                </h1>
                <span
                  className={`badge ${getStatusColor(paviljoen.status)}`}
                >
                  {statusLabel}
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-text-muted">
                <MapPin className="h-4 w-4 shrink-0" />
                {paviljoen.locatie}
                {paviljoen.gemeente && `, ${paviljoen.gemeente}`}
                {paviljoen.provincie && ` (${paviljoen.provincie})`}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn-secondary text-sm">Bewerken</button>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Vraagprijs",
            value: formatCurrency(paviljoen.vraagprijs),
            icon: <Euro className="h-4 w-4" />,
          },
          {
            label: "Oppervlakte",
            value: paviljoen.oppervlakte
              ? `${paviljoen.oppervlakte} m\u00B2`
              : "-",
            icon: <Ruler className="h-4 w-4" />,
          },
          {
            label: "Capaciteit",
            value: paviljoen.capaciteit
              ? `${paviljoen.capaciteit} personen`
              : "-",
            icon: <UsersRound className="h-4 w-4" />,
          },
          {
            label: "Seizoen",
            value: paviljoen.seizoen || "-",
            icon: <Sun className="h-4 w-4" />,
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
              {stat.icon}
              {stat.label}
            </div>
            <p className="text-lg font-semibold text-text">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs
        defaultTab="overzicht"
        tabs={[
          {
            id: "overzicht",
            label: "Overzicht",
            icon: <Building2 className="h-4 w-4" />,
            content: (
              <OverzichtTab
                paviljoen={paviljoen}
              />
            ),
          },
          {
            id: "documenten",
            label: `Documenten (${paviljoen.documenten.length})`,
            icon: <FileText className="h-4 w-4" />,
            content: <DocumentenTab documenten={paviljoen.documenten} />,
          },
          {
            id: "mystery-visits",
            label: `Mystery Visits (${paviljoen.mysteryVisits.length})`,
            icon: <ClipboardCheck className="h-4 w-4" />,
            content: <MysteryVisitsTab visits={paviljoen.mysteryVisits} />,
          },
          {
            id: "financieel",
            label: `Financieel (${paviljoen.financials.length})`,
            icon: <TrendingUp className="h-4 w-4" />,
            content: <FinancieelTab financials={paviljoen.financials} />,
          },
          {
            id: "kopers-deals",
            label: `Kopers & Deals (${paviljoen.deals.length})`,
            icon: <Handshake className="h-4 w-4" />,
            content: (
              <KopersDealsTab
                interesses={paviljoen.kopiInteresses}
                deals={paviljoen.deals}
              />
            ),
          },
          {
            id: "communicatie",
            label: `Communicatie (${paviljoen.communications.length})`,
            icon: <MessageSquare className="h-4 w-4" />,
            content: (
              <CommunicatieTab communications={paviljoen.communications} />
            ),
          },
          {
            id: "activiteiten",
            label: `Activiteiten`,
            icon: <Activity className="h-4 w-4" />,
            content: <ActiviteitenTab activities={paviljoen.activities} />,
          },
        ]}
      />
    </div>
  );
}

/* ========================================
   TAB CONTENT COMPONENTS
   ======================================== */

function OverzichtTab({ paviljoen }: { paviljoen: any }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left column - main info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Omschrijving */}
        <div className="card p-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
            Omschrijving
          </h3>
          {paviljoen.omschrijving ? (
            <p className="text-sm leading-relaxed text-text whitespace-pre-line">
              {paviljoen.omschrijving}
            </p>
          ) : (
            <p className="text-sm text-text-muted italic">
              Geen omschrijving beschikbaar.
            </p>
          )}
        </div>

        {/* Details grid */}
        <div className="card p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
            Details
          </h3>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            {[
              { label: "Type exploitatie", value: paviljoen.typeExploitatie },
              { label: "Oppervlakte", value: paviljoen.oppervlakte ? `${paviljoen.oppervlakte} m\u00B2` : null },
              { label: "Capaciteit", value: paviljoen.capaciteit ? `${paviljoen.capaciteit} personen` : null },
              { label: "Seizoen", value: paviljoen.seizoen },
              { label: "Gemeente", value: paviljoen.gemeente },
              { label: "Provincie", value: paviljoen.provincie },
              { label: "Vraagprijs", value: paviljoen.vraagprijs != null ? formatCurrency(paviljoen.vraagprijs) : null },
              { label: "Aangemaakt", value: formatDate(paviljoen.createdAt) },
            ].map((item) => (
              <div key={item.label}>
                <dt className="text-text-muted">{item.label}</dt>
                <dd className="mt-0.5 font-medium text-text capitalize">
                  {item.value || "-"}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Foto's */}
        {paviljoen.fotos.length > 0 && (
          <div className="card p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
              Foto&apos;s ({paviljoen.fotos.length})
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {paviljoen.fotos.map((foto: any) => (
                <div
                  key={foto.id}
                  className="aspect-video overflow-hidden rounded-lg bg-gray-100"
                >
                  <img
                    src={foto.url}
                    alt={foto.beschrijving || "Foto"}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right column - contactpersonen */}
      <div className="space-y-6">
        <div className="card p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
            Contactpersonen ({paviljoen.contactpersonen.length})
          </h3>
          {paviljoen.contactpersonen.length === 0 ? (
            <p className="text-sm text-text-muted italic">
              Geen contactpersonen gekoppeld.
            </p>
          ) : (
            <ul className="space-y-4">
              {paviljoen.contactpersonen.map((contact: any) => (
                <li
                  key={contact.id}
                  className="flex items-start gap-3 rounded-lg border border-border p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {getInitials(contact.naam)}
                  </div>
                  <div className="min-w-0 text-sm">
                    <p className="font-medium text-text">{contact.naam}</p>
                    {contact.rol && (
                      <p className="text-xs text-text-muted capitalize">
                        {contact.rol}
                      </p>
                    )}
                    {contact.email && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-text-muted truncate">
                        <Mail className="h-3 w-3 shrink-0" />
                        {contact.email}
                      </p>
                    )}
                    {contact.telefoon && (
                      <p className="flex items-center gap-1 text-xs text-text-muted">
                        <Phone className="h-3 w-3 shrink-0" />
                        {contact.telefoon}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function DocumentenTab({ documenten }: { documenten: any[] }) {
  const getCategorieLabel = (cat: string) =>
    DOCUMENT_CATEGORIES.find((c) => c.value === cat)?.label || cat;

  if (documenten.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <FileText className="mb-4 h-12 w-12 text-text-muted/40" />
        <h3 className="text-lg font-medium text-text">Geen documenten</h3>
        <p className="mt-1 text-sm text-text-muted">
          Er zijn nog geen documenten aan dit paviljoen gekoppeld.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-gray-50/50">
            <th className="px-5 py-3 text-left font-medium text-text-muted">
              Document
            </th>
            <th className="px-5 py-3 text-left font-medium text-text-muted">
              Categorie
            </th>
            <th className="px-5 py-3 text-left font-medium text-text-muted">
              Type
            </th>
            <th className="px-5 py-3 text-left font-medium text-text-muted">
              Datum
            </th>
            <th className="px-5 py-3 text-right font-medium text-text-muted">
              Actie
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {documenten.map((doc) => (
            <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-text-muted shrink-0" />
                  <span className="font-medium text-text">{doc.naam}</span>
                </div>
              </td>
              <td className="px-5 py-3">
                <span className="badge badge-inactive">
                  {getCategorieLabel(doc.categorie)}
                </span>
              </td>
              <td className="px-5 py-3 text-text-muted uppercase">
                {doc.bestandstype || "-"}
              </td>
              <td className="px-5 py-3 text-text-muted">
                {formatDate(doc.createdAt)}
              </td>
              <td className="px-5 py-3 text-right">
                <button className="text-primary hover:text-primary-light transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MysteryVisitsTab({ visits }: { visits: any[] }) {
  if (visits.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <ClipboardCheck className="mb-4 h-12 w-12 text-text-muted/40" />
        <h3 className="text-lg font-medium text-text">Geen mystery visits</h3>
        <p className="mt-1 text-sm text-text-muted">
          Er zijn nog geen mystery visits uitgevoerd voor dit paviljoen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {visits.map((visit) => {
        const scorePercentage =
          visit.totaalScore != null && visit.maxScore
            ? Math.round((visit.totaalScore / visit.maxScore) * 100)
            : null;

        return (
          <div key={visit.id} className="card p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-text">
                    {formatDate(visit.datum)}
                  </h4>
                  {scorePercentage !== null && (
                    <span
                      className={`badge ${
                        scorePercentage >= 80
                          ? "badge-active"
                          : scorePercentage >= 60
                            ? "badge-pending"
                            : "badge-inactive"
                      }`}
                    >
                      <Star className="mr-1 inline h-3 w-3" />
                      {scorePercentage}%
                    </span>
                  )}
                </div>
                {visit.beoordelaar && (
                  <p className="mt-1 text-sm text-text-muted">
                    Beoordelaar: {visit.beoordelaar.name}
                  </p>
                )}
              </div>
              <div className="text-right">
                {visit.totaalScore != null && (
                  <p className="text-2xl font-bold text-primary">
                    {visit.totaalScore}
                    <span className="text-sm font-normal text-text-muted">
                      /{visit.maxScore}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Score breakdown */}
            {visit.scores.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {visit.scores.map((score: any) => (
                  <div
                    key={score.id}
                    className="rounded-lg border border-border p-2.5"
                  >
                    <p className="text-xs text-text-muted capitalize">
                      {score.categorie.replace(/_/g, " ")}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-text">
                      {score.score}
                      <span className="text-xs font-normal text-text-muted">
                        /{score.maxScore}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}

            {visit.opmerkingen && (
              <div className="mt-4 rounded-lg bg-gray-50 p-3">
                <p className="text-xs font-medium text-text-muted mb-1">
                  Opmerkingen
                </p>
                <p className="text-sm text-text whitespace-pre-line">
                  {visit.opmerkingen}
                </p>
              </div>
            )}

            {visit.verbeterpunten && (
              <div className="mt-2 rounded-lg bg-warning/5 border border-warning/20 p-3">
                <p className="text-xs font-medium text-warning flex items-center gap-1 mb-1">
                  <AlertCircle className="h-3 w-3" />
                  Verbeterpunten
                </p>
                <p className="text-sm text-text whitespace-pre-line">
                  {visit.verbeterpunten}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FinancieelTab({ financials }: { financials: any[] }) {
  if (financials.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <TrendingUp className="mb-4 h-12 w-12 text-text-muted/40" />
        <h3 className="text-lg font-medium text-text">
          Geen financiele gegevens
        </h3>
        <p className="mt-1 text-sm text-text-muted">
          Er zijn nog geen financiele gegevens beschikbaar voor dit paviljoen.
        </p>
      </div>
    );
  }

  // Group by year for display
  const yearly = financials.filter((f) => f.maand == null);

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-gray-50/50">
            <th className="px-5 py-3 text-left font-medium text-text-muted">
              Jaar
            </th>
            <th className="px-5 py-3 text-right font-medium text-text-muted">
              Omzet
            </th>
            <th className="px-5 py-3 text-right font-medium text-text-muted">
              EBITDA
            </th>
            <th className="px-5 py-3 text-right font-medium text-text-muted">
              Netto winst
            </th>
            <th className="px-5 py-3 text-right font-medium text-text-muted">
              Personeelskosten
            </th>
            <th className="px-5 py-3 text-right font-medium text-text-muted">
              Inkoopkosten
            </th>
            <th className="px-5 py-3 text-right font-medium text-text-muted">
              Bezoekers
            </th>
            <th className="px-5 py-3 text-right font-medium text-text-muted">
              Gem. besteding
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {(yearly.length > 0 ? yearly : financials).map((fin) => (
            <tr
              key={fin.id}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <td className="px-5 py-3 font-semibold text-text">
                {fin.jaar}
                {fin.maand != null && (
                  <span className="ml-1 text-text-muted font-normal">
                    / M{fin.maand}
                  </span>
                )}
              </td>
              <td className="px-5 py-3 text-right text-text">
                {formatCurrency(fin.omzet)}
              </td>
              <td className="px-5 py-3 text-right text-text">
                {formatCurrency(fin.ebitda)}
              </td>
              <td className="px-5 py-3 text-right text-text">
                {formatCurrency(fin.nettoWinst)}
              </td>
              <td className="px-5 py-3 text-right text-text-muted">
                {formatCurrency(fin.personeelskosten)}
              </td>
              <td className="px-5 py-3 text-right text-text-muted">
                {formatCurrency(fin.inkoopkosten)}
              </td>
              <td className="px-5 py-3 text-right text-text-muted">
                {fin.aantalBezoekers?.toLocaleString("nl-NL") ?? "-"}
              </td>
              <td className="px-5 py-3 text-right text-text-muted">
                {formatCurrency(fin.gemiddeldeBesteding)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KopersDealsTab({
  interesses,
  deals,
}: {
  interesses: any[];
  deals: any[];
}) {
  return (
    <div className="space-y-6">
      {/* Deals */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          Deals ({deals.length})
        </h3>
        {deals.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-sm text-text-muted italic">
              Geen deals gekoppeld aan dit paviljoen.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {deals.map((deal) => (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="card flex items-center justify-between p-4 group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-text group-hover:text-primary truncate">
                      {deal.titel}
                    </h4>
                    <span
                      className={`badge ${getStatusColor(deal.status)}`}
                    >
                      {deal.status}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                    {deal.koper && <span>Koper: {deal.koper.naam}</span>}
                    <span className="capitalize">Fase: {deal.fase}</span>
                    {deal.biedingBedrag != null && (
                      <span>
                        Bieding: {formatCurrency(deal.biedingBedrag)}
                      </span>
                    )}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-text-muted/40 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Koper Interesses */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          Geinteresseerde kopers ({interesses.length})
        </h3>
        {interesses.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-sm text-text-muted italic">
              Geen kopers hebben interesse getoond.
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50/50">
                  <th className="px-5 py-3 text-left font-medium text-text-muted">
                    Koper
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-text-muted">
                    Niveau
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-text-muted">
                    Notities
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-text-muted">
                    Datum
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {interesses.map((interesse) => (
                  <tr
                    key={interesse.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/kopers/${interesse.koper.id}`}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {getInitials(interesse.koper.naam)}
                        </div>
                        <span className="font-medium">
                          {interesse.koper.naam}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <span className="badge badge-pending capitalize">
                        {interesse.niveau}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-text-muted max-w-xs truncate">
                      {interesse.notities || "-"}
                    </td>
                    <td className="px-5 py-3 text-text-muted">
                      {formatDate(interesse.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function CommunicatieTab({
  communications,
}: {
  communications: any[];
}) {
  if (communications.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <MessageSquare className="mb-4 h-12 w-12 text-text-muted/40" />
        <h3 className="text-lg font-medium text-text">Geen communicatie</h3>
        <p className="mt-1 text-sm text-text-muted">
          Er is nog geen communicatie vastgelegd voor dit paviljoen.
        </p>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "telefoon":
        return <Phone className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-3">
      {communications.map((comm) => (
        <div key={comm.id} className="card p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              {getTypeIcon(comm.type)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-inactive capitalize text-xs">
                  {comm.type}
                </span>
                {comm.richting && (
                  <span className="text-xs text-text-muted capitalize">
                    {comm.richting}
                  </span>
                )}
                {comm.onderwerp && (
                  <span className="font-medium text-sm text-text">
                    {comm.onderwerp}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm text-text whitespace-pre-line">
                {comm.inhoud}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-text-muted">
                <span>{formatDate(comm.createdAt)}</span>
                {comm.user && <span>Door: {comm.user.name}</span>}
                {comm.koper && <span>Koper: {comm.koper.naam}</span>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActiviteitenTab({ activities }: { activities: any[] }) {
  if (activities.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <Activity className="mb-4 h-12 w-12 text-text-muted/40" />
        <h3 className="text-lg font-medium text-text">Geen activiteiten</h3>
        <p className="mt-1 text-sm text-text-muted">
          Er zijn nog geen activiteiten geregistreerd.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-4">
        {activities.map((act) => (
          <div key={act.id} className="relative flex gap-4 pl-10">
            {/* Dot */}
            <div className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-surface" />

            <div className="card flex-1 p-4">
              <p className="text-sm text-text">{act.beschrijving}</p>
              <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(act.createdAt)}
                </span>
                {act.user && <span>Door: {act.user.name}</span>}
                <span className="badge badge-inactive text-xs capitalize">
                  {act.type.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
