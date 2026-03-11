import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q || q.trim().length === 0) {
      return NextResponse.json(
        { error: "Zoekterm (q) is verplicht." },
        { status: 400 }
      );
    }

    const query = q.trim();

    const [paviljoens, kopers, deals, documents] = await Promise.all([
      prisma.paviljoen.findMany({
        where: {
          OR: [
            { naam: { contains: query } },
            { locatie: { contains: query } },
            { gemeente: { contains: query } },
          ],
        },
        select: {
          id: true,
          naam: true,
          locatie: true,
          status: true,
        },
        take: 10,
      }),
      prisma.koper.findMany({
        where: {
          OR: [
            { naam: { contains: query } },
            { bedrijfsnaam: { contains: query } },
            { email: { contains: query } },
          ],
        },
        select: {
          id: true,
          naam: true,
          bedrijfsnaam: true,
          status: true,
        },
        take: 10,
      }),
      prisma.deal.findMany({
        where: {
          OR: [
            { titel: { contains: query } },
            { notities: { contains: query } },
          ],
        },
        select: {
          id: true,
          titel: true,
          fase: true,
          status: true,
        },
        take: 10,
      }),
      prisma.document.findMany({
        where: {
          OR: [
            { naam: { contains: query } },
            { notities: { contains: query } },
          ],
        },
        select: {
          id: true,
          naam: true,
          categorie: true,
          bestandstype: true,
        },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      query,
      resultaten: {
        paviljoens: {
          aantal: paviljoens.length,
          items: paviljoens,
        },
        kopers: {
          aantal: kopers.length,
          items: kopers,
        },
        deals: {
          aantal: deals.length,
          items: deals,
        },
        documenten: {
          aantal: documents.length,
          items: documents,
        },
      },
      totaal: paviljoens.length + kopers.length + deals.length + documents.length,
    });
  } catch (error) {
    console.error("Fout bij zoeken:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het zoeken." },
      { status: 500 }
    );
  }
}
