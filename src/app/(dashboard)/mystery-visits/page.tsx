import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import {
  Eye,
  Plus,
  Building2,
  User,
  Star,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface PageProps {
  searchParams: Promise<{ expanded?: string }>;
}

function getScoreColor(percentage: number): string {
  if (percentage >= 80) return "text-green-600 bg-green-50";
  if (percentage >= 60) return "text-amber-600 bg-amber-50";
  return "text-red-600 bg-red-50";
}

function getScoreBarColor(percentage: number): string {
  if (percentage >= 80) return "bg-green-500";
  if (percentage >= 60) return "bg-amber-500";
  return "bg-red-500";
}

export default async function MysteryVisitsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const expandedId = params.expanded;

  const visits = await prisma.mysteryVisit.findMany({
    orderBy: { datum: "desc" },
    include: {
      paviljoen: { select: { naam: true } },
      beoordelaar: { select: { name: true } },
      scores: true,
      bijlagen: true,
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Mystery Visits</h1>
          <p className="mt-1 text-sm text-text-muted">
            {visits.length} bezoek{visits.length !== 1 ? "en" : ""} geregistreerd
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4" />
          Nieuw Bezoek
        </button>
      </div>

      {/* Visits lijst */}
      {visits.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <Eye className="mb-4 h-12 w-12 text-text-muted/40" />
          <h3 className="text-lg font-medium text-text">
            Geen mystery visits gevonden
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            Registreer een nieuw mystery visit bezoek.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visits.map((visit) => {
            const percentage =
              visit.totaalScore != null && visit.maxScore
                ? Math.round((visit.totaalScore / visit.maxScore) * 100)
                : null;
            const isExpanded = expandedId === visit.id;

            return (
              <div
                key={visit.id}
                className="card overflow-hidden"
              >
                {/* Hoofdrij */}
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    {/* Score cirkel */}
                    <div
                      className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full ${
                        percentage !== null
                          ? getScoreColor(percentage)
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {percentage !== null ? (
                        <>
                          <span className="text-lg font-bold leading-none">
                            {percentage}
                          </span>
                          <span className="text-[10px] font-medium">%</span>
                        </>
                      ) : (
                        <span className="text-xs">n.v.t.</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-text-muted" />
                        <h3 className="font-semibold text-text">
                          {visit.paviljoen.naam}
                        </h3>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
                        <span>{formatDate(visit.datum)}</span>
                        {visit.beoordelaar && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {visit.beoordelaar.name}
                          </span>
                        )}
                        {visit.totaalScore != null && visit.maxScore && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {visit.totaalScore} / {visit.maxScore}
                          </span>
                        )}
                      </div>
                      {visit.opmerkingen && (
                        <p className="mt-2 text-sm text-text-muted line-clamp-2">
                          {visit.opmerkingen}
                        </p>
                      )}
                    </div>
                  </div>

                  <Link
                    href={
                      isExpanded
                        ? "/mystery-visits"
                        : `/mystery-visits?expanded=${visit.id}`
                    }
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-text-muted hover:bg-gray-50"
                  >
                    {isExpanded ? (
                      <>
                        Inklappen
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Details
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </Link>
                </div>

                {/* Uitklapbare details */}
                {isExpanded && (
                  <div className="border-t border-border bg-gray-50/50 p-4">
                    {/* Scores per categorie */}
                    {visit.scores.length > 0 && (
                      <div className="mb-4">
                        <h4 className="mb-3 text-sm font-semibold text-text">
                          Scores per categorie
                        </h4>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {visit.scores.map((score) => {
                            const scorePct = Math.round(
                              (score.score / score.maxScore) * 100
                            );
                            return (
                              <div
                                key={score.id}
                                className="rounded-lg bg-white p-3 shadow-sm"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-text capitalize">
                                    {score.categorie.replace(/_/g, " ")}
                                  </span>
                                  <span
                                    className={`text-sm font-semibold ${
                                      scorePct >= 80
                                        ? "text-green-600"
                                        : scorePct >= 60
                                          ? "text-amber-600"
                                          : "text-red-600"
                                    }`}
                                  >
                                    {score.score}/{score.maxScore}
                                  </span>
                                </div>
                                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                  <div
                                    className={`h-full rounded-full transition-all ${getScoreBarColor(scorePct)}`}
                                    style={{ width: `${scorePct}%` }}
                                  />
                                </div>
                                {score.opmerking && (
                                  <p className="mt-2 text-xs text-text-muted">
                                    {score.opmerking}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Verbeterpunten */}
                    {visit.verbeterpunten && (
                      <div className="rounded-lg bg-white p-3 shadow-sm">
                        <div className="mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <h4 className="text-sm font-semibold text-text">
                            Verbeterpunten
                          </h4>
                        </div>
                        <p className="text-sm text-text-muted whitespace-pre-line">
                          {visit.verbeterpunten}
                        </p>
                      </div>
                    )}

                    {/* Bijlagen */}
                    {visit.bijlagen.length > 0 && (
                      <div className="mt-3">
                        <h4 className="mb-2 text-sm font-semibold text-text">
                          Bijlagen ({visit.bijlagen.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {visit.bijlagen.map((bijlage) => (
                            <a
                              key={bijlage.id}
                              href={bijlage.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs text-primary shadow-sm hover:bg-gray-50"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              {bijlage.beschrijving || "Bijlage"}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
