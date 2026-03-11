import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jaar = searchParams.get("jaar");
    const paviljoenId = searchParams.get("paviljoenId");
    const maandelijk = searchParams.get("maandelijk");

    const financials = await prisma.financial.findMany({
      where: {
        ...(jaar ? { jaar: parseInt(jaar) } : {}),
        ...(paviljoenId ? { paviljoenId } : {}),
        ...(maandelijk === "true" ? { maand: { not: null } } : maandelijk === "false" ? { maand: null } : {}),
      },
      orderBy: [{ jaar: "desc" }, { maand: "desc" }],
      include: {
        paviljoen: { select: { id: true, naam: true, locatie: true } },
      },
    });

    return NextResponse.json(financials);
  } catch (error) {
    console.error("Fout bij ophalen financiële data:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van financiële data." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      paviljoenId,
      jaar,
      maand,
      omzet,
      ebitda,
      nettoWinst,
      personeelskosten,
      inkoopkosten,
      huisvestingskosten,
      marketingkosten,
      gemiddeldeBesteding,
      aantalBezoekers,
      klantwaardering,
      reviewScore,
      aantalReviews,
      notities,
    } = body;

    if (!paviljoenId || !jaar) {
      return NextResponse.json(
        { error: "Paviljoen en jaar zijn verplicht." },
        { status: 400 }
      );
    }

    const financial = await prisma.financial.create({
      data: {
        paviljoenId,
        jaar,
        maand: maand ?? null,
        omzet: omzet ?? null,
        ebitda: ebitda ?? null,
        nettoWinst: nettoWinst ?? null,
        personeelskosten: personeelskosten ?? null,
        inkoopkosten: inkoopkosten ?? null,
        huisvestingskosten: huisvestingskosten ?? null,
        marketingkosten: marketingkosten ?? null,
        gemiddeldeBesteding: gemiddeldeBesteding ?? null,
        aantalBezoekers: aantalBezoekers ?? null,
        klantwaardering: klantwaardering ?? null,
        reviewScore: reviewScore ?? null,
        aantalReviews: aantalReviews ?? null,
        notities: notities || null,
      },
      include: {
        paviljoen: { select: { naam: true } },
      },
    });

    return NextResponse.json(financial, { status: 201 });
  } catch (error) {
    console.error("Fout bij aanmaken financiële data:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het aanmaken van financiële data." },
      { status: 500 }
    );
  }
}
