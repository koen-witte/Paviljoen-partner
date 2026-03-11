import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  try {
    const paviljoens = await prisma.paviljoen.findMany({
      where: status ? { status } : undefined,
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: {
            deals: true,
            documenten: true,
            mysteryVisits: true,
            kopiInteresses: true,
            activities: true,
            tasks: true,
          },
        },
      },
    });

    return NextResponse.json(paviljoens);
  } catch (error) {
    console.error("Error fetching paviljoens:", error);
    return NextResponse.json(
      { error: "Fout bij ophalen paviljoens" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      naam,
      locatie,
      gemeente,
      provincie,
      status,
      omschrijving,
      typeExploitatie,
      oppervlakte,
      capaciteit,
      seizoen,
      vraagprijs,
      foto,
    } = body;

    if (!naam || !locatie) {
      return NextResponse.json(
        { error: "Naam en locatie zijn verplicht" },
        { status: 400 }
      );
    }

    const paviljoen = await prisma.paviljoen.create({
      data: {
        naam,
        locatie,
        gemeente: gemeente || null,
        provincie: provincie || null,
        status: status || "actief",
        omschrijving: omschrijving || null,
        typeExploitatie: typeExploitatie || null,
        oppervlakte: oppervlakte != null ? Number(oppervlakte) : null,
        capaciteit: capaciteit != null ? Number(capaciteit) : null,
        seizoen: seizoen || null,
        vraagprijs: vraagprijs != null ? Number(vraagprijs) : null,
        foto: foto || null,
      },
    });

    return NextResponse.json(paviljoen, { status: 201 });
  } catch (error) {
    console.error("Error creating paviljoen:", error);
    return NextResponse.json(
      { error: "Fout bij aanmaken paviljoen" },
      { status: 500 }
    );
  }
}
