import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate, DOCUMENT_CATEGORIES } from "@/lib/utils";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Upload,
  File,
  FileSpreadsheet,
  FileImage,
  Building2,
  FolderOpen,
} from "lucide-react";

interface PageProps {
  searchParams: Promise<{ categorie?: string; q?: string }>;
}

const categorieColors: Record<string, string> = {
  contract: "bg-blue-100 text-blue-700",
  vergunning: "bg-green-100 text-green-700",
  financieel: "bg-amber-100 text-amber-700",
  brochure: "bg-purple-100 text-purple-700",
  regelgeving: "bg-red-100 text-red-700",
  erfpacht: "bg-cyan-100 text-cyan-700",
  notitie: "bg-gray-100 text-gray-700",
  overig: "bg-slate-100 text-slate-700",
};

function getFileIcon(bestandstype: string | null) {
  if (!bestandstype) return File;
  if (bestandstype.includes("pdf")) return FileText;
  if (bestandstype.includes("xls") || bestandstype.includes("csv"))
    return FileSpreadsheet;
  if (
    bestandstype.includes("jpg") ||
    bestandstype.includes("png") ||
    bestandstype.includes("jpeg")
  )
    return FileImage;
  return File;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function DocumentenPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categorieFilter = params.categorie;
  const searchQuery = params.q;

  const documenten = await prisma.document.findMany({
    where: {
      ...(categorieFilter ? { categorie: categorieFilter } : {}),
      ...(searchQuery
        ? { naam: { contains: searchQuery } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      paviljoen: { select: { naam: true } },
      deal: { select: { titel: true } },
    },
  });

  // Groepeer per categorie
  const grouped = new Map<string, typeof documenten>();
  for (const cat of DOCUMENT_CATEGORIES) {
    grouped.set(cat.value, []);
  }
  for (const doc of documenten) {
    const list = grouped.get(doc.categorie);
    if (list) {
      list.push(doc);
    } else {
      grouped.set(doc.categorie, [doc]);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Documenten</h1>
          <p className="mt-1 text-sm text-text-muted">
            {documenten.length} document{documenten.length !== 1 ? "en" : ""}{" "}
            in het archief
          </p>
        </div>
        <button className="btn-primary">
          <Upload className="h-4 w-4" />
          Document uploaden
        </button>
      </div>

      {/* Filters & Search */}
      <div className="card mb-6 space-y-4 p-4">
        {/* Search */}
        <form className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              name="q"
              defaultValue={searchQuery || ""}
              placeholder="Zoek op documentnaam..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-text placeholder:text-text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-text hover:bg-gray-200"
          >
            Zoeken
          </button>
        </form>

        {/* Categorie filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Filter className="h-4 w-4" />
            <span>Categorie:</span>
          </div>
          <Link
            href="/documenten"
            className={`badge ${
              !categorieFilter ? "badge-active" : "badge-inactive"
            }`}
          >
            Alles
          </Link>
          {DOCUMENT_CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/documenten?categorie=${cat.value}${searchQuery ? `&q=${searchQuery}` : ""}`}
              className={`badge ${
                categorieFilter === cat.value ? "badge-active" : "badge-inactive"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Document lijst */}
      {documenten.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <FolderOpen className="mb-4 h-12 w-12 text-text-muted/40" />
          <h3 className="text-lg font-medium text-text">
            Geen documenten gevonden
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            Pas de filters aan of upload een nieuw document.
          </p>
        </div>
      ) : categorieFilter ? (
        /* Platte lijst als er gefilterd is op categorie */
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="px-4 py-3 font-medium text-text-muted">Naam</th>
                <th className="px-4 py-3 font-medium text-text-muted">
                  Categorie
                </th>
                <th className="hidden px-4 py-3 font-medium text-text-muted md:table-cell">
                  Paviljoen
                </th>
                <th className="hidden px-4 py-3 font-medium text-text-muted sm:table-cell">
                  Type
                </th>
                <th className="hidden px-4 py-3 font-medium text-text-muted lg:table-cell">
                  Grootte
                </th>
                <th className="px-4 py-3 font-medium text-text-muted">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {documenten.map((doc) => {
                const Icon = getFileIcon(doc.bestandstype);
                return (
                  <tr key={doc.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 shrink-0 text-text-muted" />
                        <span className="font-medium text-text truncate">
                          {doc.naam}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          categorieColors[doc.categorie] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {DOCUMENT_CATEGORIES.find(
                          (c) => c.value === doc.categorie
                        )?.label || doc.categorie}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-text-muted md:table-cell">
                      {doc.paviljoen?.naam || "-"}
                    </td>
                    <td className="hidden px-4 py-3 uppercase text-text-muted sm:table-cell">
                      {doc.bestandstype || "-"}
                    </td>
                    <td className="hidden px-4 py-3 text-text-muted lg:table-cell">
                      {formatFileSize(doc.grootte)}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {formatDate(doc.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Gegroepeerd per categorie */
        <div className="space-y-6">
          {DOCUMENT_CATEGORIES.map((cat) => {
            const catDocs = grouped.get(cat.value) || [];
            if (catDocs.length === 0) return null;

            return (
              <div key={cat.value} className="card overflow-hidden">
                <div className="flex items-center gap-2 border-b border-border bg-gray-50/50 px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      categorieColors[cat.value] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {cat.label}
                  </span>
                  <span className="text-sm text-text-muted">
                    ({catDocs.length})
                  </span>
                </div>
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-border">
                    {catDocs.map((doc) => {
                      const Icon = getFileIcon(doc.bestandstype);
                      return (
                        <tr key={doc.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 shrink-0 text-text-muted" />
                              <span className="font-medium text-text truncate">
                                {doc.naam}
                              </span>
                            </div>
                          </td>
                          <td className="hidden px-4 py-3 text-text-muted md:table-cell">
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {doc.paviljoen?.naam || "-"}
                            </div>
                          </td>
                          <td className="hidden px-4 py-3 uppercase text-text-muted sm:table-cell">
                            {doc.bestandstype || "-"}
                          </td>
                          <td className="hidden px-4 py-3 text-text-muted lg:table-cell">
                            {formatFileSize(doc.grootte)}
                          </td>
                          <td className="px-4 py-3 text-right text-text-muted">
                            {formatDate(doc.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
