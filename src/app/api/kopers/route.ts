import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  try {
    const kopers = await prisma.koper.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(q
          ? {
              OR: [
                { naam: { contains: q } },
                { bedrijfsnaam: { contains: q } },
              ],
            }
          : {}),
      },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: {
            interesses: true,
            deals: true,
            communications: true,
            activities: true,
            tasks: true,
          },
        },
      },
    });

    return NextResponse.json(kopers);
  } catch (error) {
    console.error("Error fetching kopers:", error);
    return NextResponse.json(
      { error: "Fout bij ophalen kopers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      naam,
      email,
      telefoon,
      bedrijfsnaam,
      type,
      budget,
      budgetMax,
      regio,
      status,
      bron,
      notities,
    } = body;

    if (!naam) {
      return NextResponse.json(
        { error: "Naam is verplicht" },
        { status: 400 }
      );
    }

    const koper = await prisma.koper.create({
      data: {
        naam,
        email: email || null,
        telefoon: telefoon || null,
        bedrijfsnaam: bedrijfsnaam || null,
        type: type || null,
        budget: budget != null ? Number(budget) : null,
        budgetMax: budgetMax != null ? Number(budgetMax) : null,
        regio: regio || null,
        status: status || "nieuw",
        bron: bron || null,
        notities: notities || null,
      },
    });

    return NextResponse.json(koper, { status: 201 });
  } catch (error) {
    console.error("Error creating koper:", error);
    return NextResponse.json(
      { error: "Fout bij aanmaken koper" },
      { status: 500 }
    );
  }
}
