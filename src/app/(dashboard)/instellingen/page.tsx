import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Mail,
} from "lucide-react";

export default async function InstellingenPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Instellingen</h1>
        <p className="mt-1 text-sm text-text-muted">
          Beheer je account en platforminstellingen
        </p>
      </div>

      <div className="space-y-8">
        {/* Profiel sectie */}
        <div className="card overflow-hidden">
          <div className="border-b border-border bg-gray-50/50 px-6 py-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-text-muted" />
              <h2 className="font-semibold text-text">Profiel</h2>
            </div>
            <p className="mt-1 text-sm text-text-muted">
              Je persoonlijke accountgegevens
            </p>
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              {/* Avatar placeholder */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                PP
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text">
                      Naam
                    </label>
                    <input
                      type="text"
                      defaultValue="Paviljoen Partner"
                      disabled
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-text"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text">
                      E-mailadres
                    </label>
                    <input
                      type="email"
                      defaultValue="info@paviljoenpartner.nl"
                      disabled
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-text"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text">
                      Telefoon
                    </label>
                    <input
                      type="tel"
                      defaultValue="+31 6 12345678"
                      disabled
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-text"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text">
                      Rol
                    </label>
                    <input
                      type="text"
                      defaultValue="Beheerder"
                      disabled
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-text"
                    />
                  </div>
                </div>
                <button
                  disabled
                  className="rounded-lg bg-primary/80 px-4 py-2 text-sm font-medium text-white cursor-not-allowed"
                >
                  Profiel bijwerken
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Platform instellingen */}
        <div className="card overflow-hidden">
          <div className="border-b border-border bg-gray-50/50 px-6 py-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-text-muted" />
              <h2 className="font-semibold text-text">Platform</h2>
            </div>
            <p className="mt-1 text-sm text-text-muted">
              Algemene platforminstellingen
            </p>
          </div>
          <div className="divide-y divide-border">
            {/* Notificaties */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">Notificaties</p>
                  <p className="text-xs text-text-muted">
                    E-mail- en pushnotificaties beheren
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-text-muted">
                Binnenkort
              </span>
            </div>

            {/* Beveiliging */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">Beveiliging</p>
                  <p className="text-xs text-text-muted">
                    Wachtwoord en tweefactorauthenticatie
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-text-muted">
                Binnenkort
              </span>
            </div>

            {/* Weergave */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <Palette className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">Weergave</p>
                  <p className="text-xs text-text-muted">
                    Thema en taalinstellingen
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-text-muted">
                Binnenkort
              </span>
            </div>

            {/* Integraties */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">Integraties</p>
                  <p className="text-xs text-text-muted">
                    Koppelingen met externe systemen
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-text-muted">
                Binnenkort
              </span>
            </div>

            {/* E-mail templates */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">
                    E-mail Templates
                  </p>
                  <p className="text-xs text-text-muted">
                    Standaard e-mailtemplates beheren
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-text-muted">
                Binnenkort
              </span>
            </div>

            {/* Database */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <Database className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">
                    Data & Back-ups
                  </p>
                  <p className="text-xs text-text-muted">
                    Database exporteren en back-ups beheren
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-text-muted">
                Binnenkort
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
