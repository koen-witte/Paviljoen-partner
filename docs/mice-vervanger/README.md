# MICE Operations vervangen door een eigen eventsysteem

Onderzoeksdossier en bouwplan, opgesteld 19 september 2026.

Vraag: kunnen we MICE Operations (het offerte-, planning- en factuursysteem van
Beachclub Texel en Beachclub Sunsea) zelf nabouwen, inclusief alle koppelingen,
zodat de maandelijkse licentie vervalt?

Kort antwoord: ja, dat kan, maar het is geen weekendproject. MICE is een volwassen
pakket met tien samenhangende modules. De kern (aanvraag, offerte, klantomgeving,
draaiboek, facturatie, berichten) is goed na te bouwen. De koppelingen zijn het
lastigste deel, omdat we daar afhankelijk zijn van derden. Op 19 september 2026
is besloten de koppelingen met Bonnie AI en Zenchef te laten vervallen, zodat
alleen de boekhouding (Twinfield via Basecone) en Mollie overblijven, met
bankoverschrijving als standaardbetaalwijze. Het plan bouwt het systeem in acht
fases, met een parallelperiode naast MICE. MICE wordt pas opgezegd als het
eigen systeem bewezen werkt.

## Documenten

| Bestand | Inhoud |
|---|---|
| [01-onderzoek-mice-operations.md](01-onderzoek-mice-operations.md) | Wat MICE is, hoe Texel en Sunsea het vandaag gebruiken, kosten, contractfeiten, koppelingen, pijnpunten, volledige functie-inventaris |
| [02-functioneel-ontwerp.md](02-functioneel-ontwerp.md) | Wat het eigen systeem moet doen: modules, gebruikersverhalen, statussen, e-mailmatrix, betaalregels per locatie, prioriteiten |
| [03-architectuur.md](03-architectuur.md) | Techniekkeuzes, datamodel, ontwerp per koppeling, beveiliging en AVG |
| [04-bouwplan.md](04-bouwplan.md) | Acht bouwfases met opleverpunten en acceptatiecriteria, migratie vanuit MICE, risico's, openstaande beslissingen |
| [datamodel.prisma](datamodel.prisma) | Concept van het volledige datamodel (Prisma-schema), nog niet gekoppeld aan de app |
| [besluitenlog.md](besluitenlog.md) | Genomen besluiten met datum, en wat nog openstaat |

## Belangrijkste cijfers

| Post | Bedrag |
|---|---|
| MICE-licentie Beachclub Texel | € 329,00 per maand excl. btw (€ 398,09 incl.), maandelijks gefactureerd, jaarlijks geïndexeerd (CBS dienstenprijsindex) |
| MICE-licentie Beachclub Sunsea | aparte factuur aan Sunsea, bedrag niet in deze mailbox zichtbaar; aanname: gelijk aan Texel |
| Zenchef-koppeling | € 30,00 per maand excl. btw per account (activatie loopt sinds september 2026) |
| Totaal per jaar bij beide locaties | circa € 7.900 tot € 8.600 excl. btw |
| Verwachte hostingkosten eigen systeem | circa € 40 tot € 80 per maand (database, hosting, e-mail, opslag), plus Mollie-transactiekosten |

## Stand van de beslissingen

Volledig overzicht in hoofdstuk 7 van het bouwplan en in het
[besluitenlog](besluitenlog.md).

Genomen op 19 september 2026:

- Losse app in eigen repo `beachclub-events`; Postgres bij Neon plus Vercel;
  Postmark als maildienst; PDF via HTML naar Chromium.
- Bonnie-koppeling vervalt. Zenchef-koppeling is niet noodzakelijk.
- Bankoverschrijving is de standaardbetaalwijze; de bestaande Mollie-accounts
  per locatie blijven aanvullend beschikbaar.
- De export uit MICE volgt later, bij de migratie.
- MICE wordt pas opgezegd als het eigen systeem bewezen werkt.

Nog open:

1. Boekhoudkoppeling: eerst Basecone (UBL per e-mail) en later Twinfield API, of direct Twinfield. Het advies is Basecone eerst.
2. Naam en domein van het systeem en de klantomgeving.
3. Wie test en traint per locatie.
