import {
  Building2,
  Handshake,
  Users,
  ListTodo,
  TrendingUp,
  Clock,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate, DEAL_FASES } from "@/lib/utils";

async function getDashboardData() {
  const [
    paviljoenCount,
    activeDealCount,
    koperCount,
    openTaskCount,
    recentActivities,
    upcomingTasks,
    dealsByFase,
    recentDeals,
  ] = await Promise.all([
    prisma.paviljoen.count(),
    prisma.deal.count({ where: { status: "actief" } }),
    prisma.koper.count(),
    prisma.task.count({ where: { status: { in: ["open", "in_progress"] } } }),
    prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        user: { select: { name: true } },
        paviljoen: { select: { naam: true } },
        koper: { select: { naam: true } },
      },
    }),
    prisma.task.findMany({
      where: {
        status: { in: ["open", "in_progress"] },
        deadline: { not: null },
      },
      orderBy: { deadline: "asc" },
      take: 5,
      include: {
        paviljoen: { select: { naam: true } },
        koper: { select: { naam: true } },
      },
    }),
    prisma.deal.groupBy({
      by: ["fase"],
      where: { status: "actief" },
      _count: { id: true },
    }),
    prisma.deal.findMany({
      where: { status: "actief" },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: {
        paviljoen: { select: { naam: true } },
        koper: { select: { naam: true } },
      },
    }),
  ]);

  return {
    paviljoenCount,
    activeDealCount,
    koperCount,
    openTaskCount,
    recentActivities,
    upcomingTasks,
    dealsByFase,
    recentDeals,
  };
}

const priorityColors: Record<string, string> = {
  urgent: "bg-red-100 text-red-700",
  hoog: "bg-orange-100 text-orange-700",
  normaal: "bg-blue-100 text-blue-700",
  laag: "bg-gray-100 text-gray-600",
};

const activityTypeIcons: Record<string, string> = {
  created: "bg-green-100 text-green-600",
  updated: "bg-blue-100 text-blue-600",
  status_change: "bg-amber-100 text-amber-600",
  document_added: "bg-purple-100 text-purple-600",
  communication: "bg-cyan-100 text-cyan-600",
  deal_update: "bg-indigo-100 text-indigo-600",
  visit: "bg-pink-100 text-pink-600",
};

export default async function DashboardPage() {
  const data = await getDashboardData();

  const faseMap = new Map(
    data.dealsByFase.map((d) => [d.fase, d._count.id])
  );

  const pipelineStages = DEAL_FASES.filter(
    (f) => f.value !== "afgerond" && f.value !== "afgebroken"
  ).map((f) => ({
    label: f.label,
    value: f.value,
    count: faseMap.get(f.value) || 0,
  }));

  const totalPipelineDeals = pipelineStages.reduce((s, p) => s + p.count, 0);

  const stats = [
    {
      label: "Paviljoens",
      value: data.paviljoenCount,
      icon: Building2,
      href: "/paviljoens",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Actieve deals",
      value: data.activeDealCount,
      icon: Handshake,
      href: "/deals",
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Kopers",
      value: data.koperCount,
      icon: Users,
      href: "/kopers",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Open taken",
      value: data.openTaskCount,
      icon: ListTodo,
      href: "#taken",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overzicht van je strandpaviljoen-portfolio
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-gray-500" />
              </div>
              <p className="mt-4 text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Deal Pipeline + Recent Deals */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pipeline Overview */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-400" />
              <h2 className="font-semibold text-gray-900">Deal Pipeline</h2>
            </div>
            <Link
              href="/deals"
              className="text-sm font-medium hover:underline"
              style={{ color: "#1e3a5f" }}
            >
              Bekijk alle deals
            </Link>
          </div>

          {totalPipelineDeals === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              Nog geen actieve deals in de pipeline
            </p>
          ) : (
            <div className="space-y-3">
              {pipelineStages.map((stage) => {
                const pct =
                  totalPipelineDeals > 0
                    ? (stage.count / totalPipelineDeals) * 100
                    : 0;
                return (
                  <div key={stage.value} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-sm text-gray-600">
                      {stage.label}
                    </span>
                    <div className="flex-1">
                      <div className="h-6 w-full overflow-hidden rounded-md bg-gray-50">
                        <div
                          className="flex h-full items-center rounded-md px-2 text-xs font-medium text-white transition-all"
                          style={{
                            width: `${Math.max(pct, stage.count > 0 ? 8 : 0)}%`,
                            backgroundColor: "#1e3a5f",
                          }}
                        >
                          {stage.count > 0 && stage.count}
                        </div>
                      </div>
                    </div>
                    <span className="w-8 text-right text-sm font-medium text-gray-500">
                      {stage.count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Deals */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Recente Deals</h2>
          {data.recentDeals.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">
              Geen actieve deals
            </p>
          ) : (
            <div className="space-y-3">
              {data.recentDeals.map((deal) => (
                <Link
                  key={deal.id}
                  href={`/deals/${deal.id}`}
                  className="block rounded-lg border border-gray-50 p-3 transition-colors hover:bg-gray-50"
                >
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {deal.titel}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {DEAL_FASES.find((f) => f.value === deal.fase)?.label ||
                        deal.fase}
                    </span>
                    {deal.paviljoen && (
                      <span className="truncate text-xs text-gray-400">
                        {deal.paviljoen.naam}
                      </span>
                    )}
                  </div>
                  {deal.biedingBedrag && (
                    <p className="mt-1 text-xs font-medium text-gray-600">
                      {formatCurrency(deal.biedingBedrag)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activities + Tasks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900">
              Recente Activiteiten
            </h2>
          </div>
          {data.recentActivities.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              Nog geen activiteiten
            </p>
          ) : (
            <div className="space-y-4">
              {data.recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      activityTypeIcons[activity.type] ||
                      "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {activity.type.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-700">
                      {activity.beschrijving}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                      <span>{formatDate(activity.createdAt)}</span>
                      {activity.user && (
                        <>
                          <span>&middot;</span>
                          <span>{activity.user.name}</span>
                        </>
                      )}
                      {activity.paviljoen && (
                        <>
                          <span>&middot;</span>
                          <span className="truncate">
                            {activity.paviljoen.naam}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900">
              Aankomende Taken & Deadlines
            </h2>
          </div>
          {data.upcomingTasks.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              Geen openstaande taken met deadline
            </p>
          ) : (
            <div className="space-y-3">
              {data.upcomingTasks.map((task) => {
                const isOverdue =
                  task.deadline && new Date(task.deadline) < new Date();
                return (
                  <div
                    key={task.id}
                    className={`rounded-lg border p-3 ${
                      isOverdue ? "border-red-200 bg-red-50/50" : "border-gray-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {task.titel}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                          priorityColors[task.prioriteit] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {task.prioriteit}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-400">
                      {task.deadline && (
                        <span
                          className={
                            isOverdue ? "font-medium text-red-600" : ""
                          }
                        >
                          {isOverdue ? "Verlopen: " : "Deadline: "}
                          {formatDate(task.deadline)}
                        </span>
                      )}
                      {task.paviljoen && (
                        <>
                          <span>&middot;</span>
                          <span>{task.paviljoen.naam}</span>
                        </>
                      )}
                      {task.koper && (
                        <>
                          <span>&middot;</span>
                          <span>{task.koper.naam}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
