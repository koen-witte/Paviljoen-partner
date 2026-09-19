# Besluitenlog

Chronologisch overzicht van besluiten over het dossier MICE-vervanger. Elk
besluit verwijst naar het nummer in hoofdstuk 7 van het
[bouwplan](04-bouwplan.md).

## 19 september 2026

Besluiten van Koen Witte na oplevering van het dossier.

| Nr | Onderwerp | Besluit | Gevolg voor het plan |
|---|---|---|---|
| 1 | Losse app of module | Akkoord met advies: losse app in eigen repo `beachclub-events` | Fase 0 start met aanmaken van de repo |
| 2 | Database en hosting | Akkoord met advies: Postgres bij Neon plus Vercel | Vastgelegd in architectuur |
| 3 | Maildienst | Akkoord met advies: Postmark | Vastgelegd in architectuur |
| 4 | PDF-techniek | Akkoord met advies: HTML naar PDF met Chromium op een aparte functie | Vastgelegd in architectuur |
| 6 | Bonnie AI | Koppeling mag vervallen | Geschrapt uit fase 5 en uit de Must-lijst; geen afstemming met Bonnie nodig; risico verplaatst naar handmatige invoer van telefonische aanvragen |
| 8 | Opzegdatum MICE | MICE wordt pas opgezegd als het eigen systeem bewezen werkt | Geen opzegdatum in fase 0; licentie loopt door tijdens bouw en parallelperiode; besparing begint na opzegging |
| 11 | Zenchef | Koppeling niet noodzakelijk | Geschrapt uit fase 5; terugvalscenario (iCal of takenlijst) is het uitgangspunt; fase 5 korter |
| 12 | Betaalwijze | Beide locaties hebben een eigen Mollie-account; betalen via overschrijving heeft de voorkeur | Bankoverschrijving wordt standaard met IBAN en betaalkenmerk per locatie; Mollie blijft aanvullend |
| 13 | MICE-export | Export halen we er later uit | Verplaatst van fase 0 naar fase 7; catalogus in fase 1 handmatig of via beperkte export |

Nog open na deze ronde: 5 (boekhoudkoppeling, advies Basecone eerst), 7 (naam
en domein), 9 (wie test en traint), 10 (geschikt maken voor andere
paviljoens).
