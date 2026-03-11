import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorie = searchParams.get("categorie");
    const q = searchParams.get("q");
    const paviljoenId = searchParams.get("paviljoenId");
    const dealId = searchParams.get("dealId");

    const documents = await prisma.document.findMany({
      where: {
        ...(categorie ? { categorie } : {}),
        ...(q ? { naam: { contains: q } } : {}),
        ...(paviljoenId ? { paviljoenId } : {}),
        ...(dealId ? { dealId } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        paviljoen: { select: { id: true, naam: true } },
        deal: { select: { id: true, titel: true } },
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Fout bij ophalen documenten:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van documenten." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { naam, categorie, bestandspad, bestandstype, grootte, paviljoenId, dealId, notities } = body;

    if (!naam || !categorie || !bestandspad) {
      return NextResponse.json(
        { error: "Naam, categorie en bestandspad zijn verplicht." },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        naam,
        categorie,
        bestandspad,
        bestandstype: bestandstype || null,
        grootte: grootte || null,
        paviljoenId: paviljoenId || null,
        dealId: dealId || null,
        notities: notities || null,
      },
      include: {
        paviljoen: { select: { naam: true } },
        deal: { select: { titel: true } },
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Fout bij aanmaken document:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het aanmaken van het document." },
      { status: 500 }
    );
  }
}
