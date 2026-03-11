import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [
      paviljoenCount,
      activeDealCount,
      koperCount,
      openTaskCount,
      totalDocuments,
      recentActivities,
      dealsByFase,
      dealsByStatus,
      upcomingTasks,
      latestVisits,
    ] = await Promise.all([
      prisma.paviljoen.count(),
      prisma.deal.count({ where: { status: "actief" } }),
      prisma.koper.count(),
      prisma.task.count({
        where: { status: { in: ["open", "in_progress"] } },
      }),
      prisma.document.count(),
      prisma.activity.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: { select: { name: true } },
          paviljoen: { select: { naam: true } },
          koper: { select: { naam: true } },
        },
      }),
      prisma.deal.groupBy({
        by: ["fase"],
        where: { status: "actief" },
        _count: { id: true },
      }),
      prisma.deal.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.task.findMany({
        where: {
          status: { in: ["open", "in_progress"] },
          deadline: { not: null },
        },
        orderBy: { deadline: "asc" },
        take: 5,
        select: {
          id: true,
          titel: true,
          deadline: true,
          prioriteit: true,
          status: true,
        },
      }),
      prisma.mysteryVisit.findMany({
        orderBy: { datum: "desc" },
        take: 5,
        select: {
          id: true,
          datum: true,
          totaalScore: true,
          maxScore: true,
          paviljoen: { select: { naam: true } },
        },
      }),
    ]);

    return NextResponse.json({
      overzicht: {
        paviljoens: paviljoenCount,
        actieveDeals: activeDealCount,
        kopers: koperCount,
        openTaken: openTaskCount,
        documenten: totalDocuments,
      },
      pipeline: dealsByFase.map((d) => ({
        fase: d.fase,
        aantal: d._count.id,
      })),
      dealStatussen: dealsByStatus.map((d) => ({
        status: d.status,
        aantal: d._count.id,
      })),
      recenteActiviteiten: recentActivities,
      aankomendeTaken: upcomingTasks,
      laatsteVisits: latestVisits,
    });
  } catch (error) {
    console.error("Fout bij ophalen dashboard data:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van dashboard data." },
      { status: 500 }
    );
  }
}
