import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const koperId = searchParams.get("koperId");
    const paviljoenId = searchParams.get("paviljoenId");

    const communications = await prisma.communication.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(koperId ? { koperId } : {}),
        ...(paviljoenId ? { paviljoenId } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        koper: { select: { id: true, naam: true, bedrijfsnaam: true } },
        paviljoen: { select: { id: true, naam: true } },
        user: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(communications);
  } catch (error) {
    console.error("Fout bij ophalen communicatie:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van communicatie." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { type, onderwerp, inhoud, richting, koperId, paviljoenId, userId } = body;

    if (!type || !inhoud) {
      return NextResponse.json(
        { error: "Type en inhoud zijn verplicht." },
        { status: 400 }
      );
    }

    const communication = await prisma.communication.create({
      data: {
        type,
        onderwerp: onderwerp || null,
        inhoud,
        richting: richting || null,
        koperId: koperId || null,
        paviljoenId: paviljoenId || null,
        userId: userId || null,
      },
      include: {
        koper: { select: { naam: true } },
        paviljoen: { select: { naam: true } },
        user: { select: { name: true } },
      },
    });

    return NextResponse.json(communication, { status: 201 });
  } catch (error) {
    console.error("Fout bij aanmaken communicatie:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het aanmaken van het bericht." },
      { status: 500 }
    );
  }
}
