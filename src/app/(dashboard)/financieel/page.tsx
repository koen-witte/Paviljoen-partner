import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  Euro,
  Building2,
  Star,
  BarChart3,
} from "lucide-react";
import FinancialChart from "@/components/financials/FinancialChart";

export default async function FinancieelPage() {
  const currentYear = new Date().getFullYear();

  const financials = await prisma.financial.findMany({
    where: {
      jaar: currentYear,
      maand: null, // Jaarlijkse data
    },
    include: {
      paviljoen: { select: { naam: true } },
    },
    orderBy: {
      paviljoen: { naam: "asc" },
    },
  });

  // Als er geen data is voor het huidige jaar, probeer het vorige jaar
  const data =
    financials.length > 0
      ? financials
      : await prisma.financial.findMany({
          where: {
            jaar: currentYear - 1,
            maand: null,
          },
          include: {
            paviljoen: { select: { naam: true } },
          },
          orderBy: {
            paviljoen: { naam: "asc" },
          },
        });

  const displayYear = financials.length > 0 ? currentYear : currentYear - 1;

  // Totalen berekenen
  const totals = {
    omzet: data.reduce((sum, f) => sum + (f.omzet || 0), 0),
    ebitda: data.reduce((sum, f) => sum + (f.ebitda || 0), 0),
    nettoWinst: data.reduce((sum, f) => sum + (f.nettoWinst || 0), 0),
    personeelskosten: data.reduce((sum, f) => sum + (f.personeelskosten || 0), 0),
  };

  // Gemiddelde review score
  const reviewData = data.filter((f) => f.reviewScore != null);
  const avgReviewScore =
    reviewData.length > 0
      ? reviewData.reduce((sum, f) => sum + (f.reviewScore || 0), 0) /
        reviewData.length
      : null;

  // Chart data
  const chartData = data
    .filter((f) => f.omzet != null || f.ebitda != null)
    .map((f) => ({
      naam: f.paviljoen.naam,
      omzet: f.omzet || 0,
      ebitda: f.ebitda || 0,
    }));

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Financieel Overzicht</h1>
        <p className="mt-1 text-sm text-text-muted">
          Financiële gegevens van {data.length} paviljoen{data.length !== 1 ? "s" : ""} &mdash; {displayYear}
        </p>
      </div>

      {/* Samenvatting kaarten */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Euro className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-text-muted">Totale Omzet</p>
              <p className="text-xl font-bold text-text">
                {formatCurrency(totals.omzet)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-text-muted">Totale EBITDA</p>
              <p className="text-xl font-bold text-text">
                {formatCurrency(totals.ebitda)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-text-muted">Netto Winst</p>
              <p className="text-xl font-bold text-text">
                {formatCurrency(totals.nettoWinst)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-text-muted">Gem. Review Score</p>
              <p className="text-xl font-bold text-text">
                {avgReviewScore != null ? avgReviewScore.toFixed(1) : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grafiek */}
      <div className="card mb-8 p-6">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-text-muted" />
          <h2 className="font-semibold text-text">
            Omzet & EBITDA per Paviljoen
          </h2>
        </div>
        <div className="flex items-center gap-6 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: "#1e3a5f" }} />
            <span className="text-text-muted">Omzet</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: "#d4a843" }} />
            <span className="text-text-muted">EBITDA</span>
          </div>
        </div>
        <FinancialChart data={chartData} />
      </div>

      {/* Tabel */}
      {data.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <Building2 className="mb-4 h-12 w-12 text-text-muted/40" />
          <h3 className="text-lg font-medium text-text">
            Geen financiële data gevonden
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            Er zijn nog geen financiële gegevens geregistreerd voor {displayYear}.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50/50">
                  <th className="px-4 py-3 font-medium text-text-muted">
                    Paviljoen
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-text-muted">
                    Omzet
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-text-muted">
                    EBITDA
                  </th>
                  <th className="hidden px-4 py-3 text-right font-medium text-text-muted md:table-cell">
                    Netto Winst
                  </th>
                  <th className="hidden px-4 py-3 text-right font-medium text-text-muted lg:table-cell">
                    Personeelskosten
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-text-muted">
                    Review Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((fin) => (
                  <tr key={fin.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 shrink-0 text-text-muted" />
                        <span className="font-medium text-text">
                          {fin.paviljoen.naam}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-text">
                      {formatCurrency(fin.omzet)}
                    </td>
                    <td className="px-4 py-3 text-right text-text">
                      {formatCurrency(fin.ebitda)}
                    </td>
                    <td className="hidden px-4 py-3 text-right text-text md:table-cell">
                      {formatCurrency(fin.nettoWinst)}
                    </td>
                    <td className="hidden px-4 py-3 text-right text-text lg:table-cell">
                      {formatCurrency(fin.personeelskosten)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {fin.reviewScore != null ? (
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-400" />
                          <span className="font-medium text-text">
                            {fin.reviewScore.toFixed(1)}
                          </span>
                        </span>
                      ) : (
                        <span className="text-text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-gray-50/80 font-semibold">
                  <td className="px-4 py-3 text-text">Totaal</td>
                  <td className="px-4 py-3 text-right text-text">
                    {formatCurrency(totals.omzet)}
                  </td>
                  <td className="px-4 py-3 text-right text-text">
                    {formatCurrency(totals.ebitda)}
                  </td>
                  <td className="hidden px-4 py-3 text-right text-text md:table-cell">
                    {formatCurrency(totals.nettoWinst)}
                  </td>
                  <td className="hidden px-4 py-3 text-right text-text lg:table-cell">
                    {formatCurrency(totals.personeelskosten)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {avgReviewScore != null ? (
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-400" />
                        {avgReviewScore.toFixed(1)}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
