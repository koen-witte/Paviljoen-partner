import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const fase = searchParams.get("fase");

    const deals = await prisma.deal.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(fase ? { fase } : {}),
      },
      orderBy: { updatedAt: "desc" },
      include: {
        paviljoen: { select: { id: true, naam: true, locatie: true } },
        koper: { select: { id: true, naam: true, bedrijfsnaam: true } },
        documenten: {
          select: { id: true, naam: true, categorie: true },
        },
        activities: {
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            type: true,
            beschrijving: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error("Fout bij ophalen deals:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van deals." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { paviljoenId, koperId, titel, fase, notities } = body;

    if (!paviljoenId || !titel) {
      return NextResponse.json(
        { error: "Paviljoen en titel zijn verplicht." },
        { status: 400 }
      );
    }

    const deal = await prisma.deal.create({
      data: {
        paviljoenId,
        koperId: koperId || null,
        titel,
        fase: fase || "oriëntatie",
        status: "actief",
        notities: notities || null,
      },
      include: {
        paviljoen: { select: { naam: true } },
        koper: { select: { naam: true } },
      },
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    console.error("Fout bij aanmaken deal:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het aanmaken van de deal." },
      { status: 500 }
    );
  }
}
