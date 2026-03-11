import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const passwordHash = await hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@paviljoenpartner.nl" },
    update: {},
    create: {
      email: "admin@paviljoenpartner.nl",
      name: "Admin Paviljoen Partner",
      passwordHash,
      role: "admin",
    },
  });

  // Create sample paviljoens
  const paviljoen1 = await prisma.paviljoen.create({
    data: {
      naam: "Strandpaviljoen De Zeemeeuw",
      locatie: "Boulevard 1, Scheveningen",
      gemeente: "Den Haag",
      provincie: "Zuid-Holland",
      status: "in_verkoop",
      omschrijving: "Prachtig gelegen strandpaviljoen aan de Scheveningse boulevard met 200 zitplaatsen en een modern interieur. Uitstekende omzet en trouwe klantenkring.",
      typeExploitatie: "Horeca / Strandtent",
      oppervlakte: 350,
      capaciteit: 200,
      seizoen: "Maart - Oktober",
      vraagprijs: 850000,
      contactpersonen: {
        create: [
          {
            naam: "Jan van der Berg",
            rol: "Eigenaar",
            email: "jan@zeemeeuw.nl",
            telefoon: "06-12345678",
          },
        ],
      },
    },
  });

  const paviljoen2 = await prisma.paviljoen.create({
    data: {
      naam: "Beach Club Zandvoort",
      locatie: "Strandweg 15, Zandvoort",
      gemeente: "Zandvoort",
      provincie: "Noord-Holland",
      status: "actief",
      omschrijving: "Trendy beach club met uitgebreide cocktailkaart en DJ-avonden. Gelegen op een toplocatie nabij het centrum van Zandvoort.",
      typeExploitatie: "Beach Club",
      oppervlakte: 450,
      capaciteit: 300,
      seizoen: "April - September",
      vraagprijs: 1200000,
      contactpersonen: {
        create: [
          {
            naam: "Lisa de Vries",
            rol: "Eigenaar",
            email: "lisa@beachclubzandvoort.nl",
            telefoon: "06-87654321",
          },
        ],
      },
    },
  });

  const paviljoen3 = await prisma.paviljoen.create({
    data: {
      naam: "Paviljoen Duinzicht",
      locatie: "Duinweg 42, Noordwijk",
      gemeente: "Noordwijk",
      provincie: "Zuid-Holland",
      status: "actief",
      omschrijving: "Gezellig familiepaviljoen met prachtig uitzicht over de duinen. Bekend om verse vis en lokale specialiteiten.",
      typeExploitatie: "Restaurant / Strandpaviljoen",
      oppervlakte: 280,
      capaciteit: 150,
      seizoen: "Maart - November",
      vraagprijs: 650000,
      contactpersonen: {
        create: [
          {
            naam: "Pieter Jansen",
            rol: "Eigenaar",
            email: "pieter@duinzicht.nl",
            telefoon: "06-11223344",
          },
        ],
      },
    },
  });

  // Create sample kopers
  const koper1 = await prisma.koper.create({
    data: {
      naam: "Mark Hendriks",
      email: "mark@hendriks-invest.nl",
      telefoon: "06-99887766",
      bedrijfsnaam: "Hendriks Investments B.V.",
      type: "investeerder",
      budget: 800000,
      budgetMax: 1500000,
      regio: "Zuid-Holland",
      status: "warm",
      bron: "Netwerk",
      notities: "Ervaren horeca-investeerder, zoekt rendabele strandlocaties.",
    },
  });

  const koper2 = await prisma.koper.create({
    data: {
      naam: "Sandra Bakker",
      email: "sandra@bakker.nl",
      telefoon: "06-55443322",
      type: "exploitant",
      budget: 500000,
      budgetMax: 750000,
      regio: "Noord-Holland",
      status: "actief",
      bron: "Website",
      notities: "Heeft 5 jaar horeca-ervaring, zoekt eerste eigen paviljoen.",
    },
  });

  // Create interests
  await prisma.koperInteresse.create({
    data: {
      koperId: koper1.id,
      paviljoenId: paviljoen1.id,
      niveau: "bezichtiging",
      notities: "Zeer geïnteresseerd, wil financiële cijfers inzien.",
    },
  });

  await prisma.koperInteresse.create({
    data: {
      koperId: koper2.id,
      paviljoenId: paviljoen3.id,
      niveau: "interesse",
    },
  });

  // Create a deal
  await prisma.deal.create({
    data: {
      paviljoenId: paviljoen1.id,
      koperId: koper1.id,
      titel: "Verkoop De Zeemeeuw aan Hendriks Investments",
      fase: "bezichtiging",
      ndaStatus: "ondertekend",
      ndaDatum: new Date("2026-02-15"),
      status: "actief",
      notities: "Koper is enthousiast na eerste gesprek. Bezichtiging gepland.",
    },
  });

  // Create financial data
  await prisma.financial.createMany({
    data: [
      {
        paviljoenId: paviljoen1.id,
        jaar: 2025,
        omzet: 1250000,
        ebitda: 312500,
        nettoWinst: 225000,
        personeelskosten: 375000,
        inkoopkosten: 375000,
        gemiddeldeBesteding: 32.5,
        aantalBezoekers: 38461,
        klantwaardering: 8.2,
        reviewScore: 4.3,
        aantalReviews: 487,
      },
      {
        paviljoenId: paviljoen1.id,
        jaar: 2024,
        omzet: 1100000,
        ebitda: 264000,
        nettoWinst: 187000,
        personeelskosten: 352000,
        inkoopkosten: 341000,
        gemiddeldeBesteding: 29.8,
        aantalBezoekers: 36912,
        klantwaardering: 7.9,
        reviewScore: 4.1,
        aantalReviews: 412,
      },
      {
        paviljoenId: paviljoen2.id,
        jaar: 2025,
        omzet: 1800000,
        ebitda: 504000,
        nettoWinst: 378000,
        personeelskosten: 468000,
        inkoopkosten: 504000,
        gemiddeldeBesteding: 45.0,
        aantalBezoekers: 40000,
        klantwaardering: 8.5,
        reviewScore: 4.5,
        aantalReviews: 623,
      },
    ],
  });

  // Create mystery visit
  const visit = await prisma.mysteryVisit.create({
    data: {
      paviljoenId: paviljoen1.id,
      beoordelaarId: admin.id,
      datum: new Date("2026-01-15"),
      totaalScore: 7.8,
      maxScore: 10,
      opmerkingen: "Over het algemeen een goede ervaring. Service was vriendelijk maar soms traag bij drukte.",
      verbeterpunten: "Wachttijd bij drukte verminderen. Menukaart vernieuwen. Toiletten vaker schoonmaken.",
      scores: {
        create: [
          { categorie: "Ontvangst", score: 8, maxScore: 10, opmerking: "Warm welkom, snel een tafel toegewezen" },
          { categorie: "Sfeer & Inrichting", score: 8.5, maxScore: 10, opmerking: "Mooi interieur, fijne muziek" },
          { categorie: "Service", score: 7, maxScore: 10, opmerking: "Vriendelijk maar wachttijd te lang" },
          { categorie: "Eten & Drinken", score: 8, maxScore: 10, opmerking: "Goede kwaliteit, verse ingrediënten" },
          { categorie: "Hygiëne", score: 7, maxScore: 10, opmerking: "Toiletten kunnen schoner" },
          { categorie: "Prijs-kwaliteit", score: 8, maxScore: 10, opmerking: "Redelijk geprijsd voor de locatie" },
        ],
      },
    },
  });

  // Create tasks
  await prisma.task.createMany({
    data: [
      {
        titel: "Bezichtiging plannen De Zeemeeuw",
        beschrijving: "Bezichtiging plannen met Mark Hendriks voor Strandpaviljoen De Zeemeeuw",
        deadline: new Date("2026-03-20"),
        prioriteit: "hoog",
        status: "open",
        userId: admin.id,
        paviljoenId: paviljoen1.id,
        koperId: koper1.id,
      },
      {
        titel: "Brochure updaten Beach Club Zandvoort",
        beschrijving: "Nieuwe foto's en financiële cijfers toevoegen aan de brochure",
        deadline: new Date("2026-03-25"),
        prioriteit: "normaal",
        status: "open",
        userId: admin.id,
        paviljoenId: paviljoen2.id,
      },
      {
        titel: "Follow-up Sandra Bakker",
        beschrijving: "Sandra terugbellen over haar interesse in Paviljoen Duinzicht",
        deadline: new Date("2026-03-15"),
        prioriteit: "normaal",
        status: "open",
        userId: admin.id,
        koperId: koper2.id,
      },
    ],
  });

  // Create activities
  await prisma.activity.createMany({
    data: [
      {
        type: "created",
        beschrijving: "Paviljoen De Zeemeeuw toegevoegd aan portfolio",
        paviljoenId: paviljoen1.id,
        userId: admin.id,
      },
      {
        type: "status_change",
        beschrijving: "Status gewijzigd naar 'In verkoop'",
        paviljoenId: paviljoen1.id,
        userId: admin.id,
      },
      {
        type: "deal_update",
        beschrijving: "NDA ondertekend door Mark Hendriks",
        paviljoenId: paviljoen1.id,
        koperId: koper1.id,
        userId: admin.id,
      },
      {
        type: "communication",
        beschrijving: "Telefonisch contact met Sandra Bakker over Paviljoen Duinzicht",
        koperId: koper2.id,
        paviljoenId: paviljoen3.id,
        userId: admin.id,
      },
    ],
  });

  // Create communications
  await prisma.communication.createMany({
    data: [
      {
        type: "telefoon",
        onderwerp: "Introductiegesprek",
        inhoud: "Mark gebeld om portfolio te bespreken. Hij is specifiek geïnteresseerd in strandpaviljoens in Zuid-Holland met een omzet boven €1M.",
        richting: "uitgaand",
        koperId: koper1.id,
        userId: admin.id,
      },
      {
        type: "email",
        onderwerp: "Informatiememorandum De Zeemeeuw",
        inhoud: "Informatiememorandum en NDA verstuurd naar Mark Hendriks voor Strandpaviljoen De Zeemeeuw.",
        richting: "uitgaand",
        koperId: koper1.id,
        paviljoenId: paviljoen1.id,
        userId: admin.id,
      },
      {
        type: "whatsapp",
        onderwerp: "Vraag over Duinzicht",
        inhoud: "Sandra vraagt of Paviljoen Duinzicht ook winterseizoen open is en wat de exacte erfpachtconditie zijn.",
        richting: "inkomend",
        koperId: koper2.id,
        paviljoenId: paviljoen3.id,
        userId: admin.id,
      },
    ],
  });

  console.log("Seed data created successfully!");
  console.log(`Admin login: admin@paviljoenpartner.nl / admin123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
