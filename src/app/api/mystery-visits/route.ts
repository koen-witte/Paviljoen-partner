import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paviljoenId = searchParams.get("paviljoenId");

    const visits = await prisma.mysteryVisit.findMany({
      where: paviljoenId ? { paviljoenId } : undefined,
      orderBy: { datum: "desc" },
      include: {
        paviljoen: { select: { id: true, naam: true, locatie: true } },
        beoordelaar: { select: { id: true, name: true } },
        scores: {
          select: {
            id: true,
            categorie: true,
            score: true,
            maxScore: true,
            opmerking: true,
          },
        },
        bijlagen: {
          select: {
            id: true,
            url: true,
            beschrijving: true,
          },
        },
      },
    });

    return NextResponse.json(visits);
  } catch (error) {
    console.error("Fout bij ophalen mystery visits:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van mystery visits." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      paviljoenId,
      beoordelaarId,
      datum,
      totaalScore,
      maxScore,
      opmerkingen,
      verbeterpunten,
      scores,
    } = body;

    if (!paviljoenId || !datum) {
      return NextResponse.json(
        { error: "Paviljoen en datum zijn verplicht." },
        { status: 400 }
      );
    }

    const visit = await prisma.mysteryVisit.create({
      data: {
        paviljoenId,
        beoordelaarId: beoordelaarId || null,
        datum: new Date(datum),
        totaalScore: totaalScore ?? null,
        maxScore: maxScore ?? null,
        opmerkingen: opmerkingen || null,
        verbeterpunten: verbeterpunten || null,
        scores: scores
          ? {
              create: scores.map(
                (s: { categorie: string; score: number; maxScore: number; opmerking?: string }) => ({
                  categorie: s.categorie,
                  score: s.score,
                  maxScore: s.maxScore,
                  opmerking: s.opmerking || null,
                })
              ),
            }
          : undefined,
      },
      include: {
        paviljoen: { select: { naam: true } },
        beoordelaar: { select: { name: true } },
        scores: true,
      },
    });

    return NextResponse.json(visit, { status: 201 });
  } catch (error) {
    console.error("Fout bij aanmaken mystery visit:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het aanmaken van het mystery visit." },
      { status: 500 }
    );
  }
}
