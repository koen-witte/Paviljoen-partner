import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "-";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    actief: "badge-active",
    nieuw: "badge-active",
    warm: "badge-pending",
    in_verkoop: "badge-pending",
    verkocht: "badge-sold",
    deal: "badge-sold",
    inactief: "badge-inactive",
    afgewezen: "badge-inactive",
    afgebroken: "badge-inactive",
  };
  return colors[status] || "badge-inactive";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const PAVILJOEN_STATUSES = [
  { value: "actief", label: "Actief" },
  { value: "in_verkoop", label: "In verkoop" },
  { value: "verkocht", label: "Verkocht" },
  { value: "inactief", label: "Inactief" },
];

export const KOPER_STATUSES = [
  { value: "nieuw", label: "Nieuw" },
  { value: "actief", label: "Actief" },
  { value: "warm", label: "Warm" },
  { value: "afgewezen", label: "Afgewezen" },
  { value: "deal", label: "Deal" },
];

export const DEAL_FASES = [
  { value: "oriëntatie", label: "Oriëntatie" },
  { value: "nda", label: "NDA" },
  { value: "documenten", label: "Documenten" },
  { value: "bezichtiging", label: "Bezichtiging" },
  { value: "bieding", label: "Bieding" },
  { value: "onderhandeling", label: "Onderhandeling" },
  { value: "due_diligence", label: "Due Diligence" },
  { value: "afgerond", label: "Afgerond" },
  { value: "afgebroken", label: "Afgebroken" },
];

export const DOCUMENT_CATEGORIES = [
  { value: "contract", label: "Contract" },
  { value: "vergunning", label: "Vergunning" },
  { value: "financieel", label: "Financieel" },
  { value: "brochure", label: "Brochure" },
  { value: "regelgeving", label: "Regelgeving" },
  { value: "erfpacht", label: "Erfpacht" },
  { value: "notitie", label: "Notitie" },
  { value: "overig", label: "Overig" },
];

export const COMMUNICATION_TYPES = [
  { value: "email", label: "E-mail" },
  { value: "telefoon", label: "Telefoon" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "notitie", label: "Notitie" },
  { value: "vergadering", label: "Vergadering" },
  { value: "intern", label: "Intern" },
];
