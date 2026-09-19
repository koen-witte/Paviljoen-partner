# 03 · Architectuur

## 1. Techniekkeuzes

| Onderdeel | Keuze | Waarom |
|---|---|---|
| Framework | Next.js (App Router) met TypeScript, React 19, Tailwind | zelfde stack als Paviljoen Partner, één kennisbasis; server components voor dossiers, route handlers voor API en webhooks |
| Database | PostgreSQL (Neon of Vercel Postgres, of Supabase) | SQLite is niet geschikt voor productie met meerdere gebruikers, webhooks en achtergrondtaken; Postgres ondersteunt transacties voor nummerreeksen en rijniveau-beveiliging per locatie |
| ORM | Prisma | al in gebruik; migraties; type-veilig |
| Auth | Auth.js (NextAuth v5) met e-mail plus wachtwoord en passkeys later; sessies met rol per locatie | al in gebruik in de repo |
| Hosting | Vercel (app) plus beheerde Postgres; achtergrondtaken via Vercel Cron of een kleine worker | laagste beheerlast; Koen heeft al een Vercel-account |
| Achtergrondtaken | een `jobs`-tabel in Postgres plus een cron-endpoint elke 5 minuten (verval van opties, herinneringen, ingeplande mails, synchronisatie Zenchef) | geen extra infrastructuur; herhaalbaar en zichtbaar |
| E-mail uit | Postmark of Resend, met eigen domein per locatie (DKIM, SPF, DMARC) | hoge bezorgbaarheid van transactionele mail |
| E-mail in | inbound webhook van dezelfde dienst op `reply+<dossiertoken>@mail.<domein>` | antwoorden landen automatisch in het dossier |
| PDF | server-side rendering van een HTML-sjabloon naar PDF met Playwright/Chromium (of `@react-pdf/renderer` als de hosting geen Chromium toestaat) | pixelvaste huisstijl, één sjabloon voor scherm en PDF |
| UBL | eigen generator op basis van UBL 2.1 Invoice en CreditNote, gevalideerd tegen Peppol BIS 3 schematron in tests | vereist voor zakelijke klanten en boekhoudkoppeling |
| Betalingen | Mollie API (payment links en webhooks) | standaard in NL, iDEAL |
| Bestanden | S3-compatibele opslag (Vercel Blob of Cloudflare R2) met ondertekende downloadlinks met vervaldatum | bijlagen, PDF's, UBL |
| Agenda-export | eigen iCal-endpoint per locatie en ruimte met token | zelfde als MICE |
| Zoeken | Postgres full-text op dossiers, contacten en berichten | geen aparte zoekmachine nodig |
| Observability | Sentry (fouten) plus logging van elke uitgaande mail en API-call in de database | traceerbaarheid richting gasten |

## 2. Meerdere locaties (multi-tenant)

- Elke rij in de kern-tabellen heeft een `vestigingId`. Alle queries lopen via
  een `db.forVestiging(id)`-wrapper die het filter afdwingt; API-keys en
  gebruikersrollen zijn per locatie.
- Gedeelde data (gebruikers, cockpit-instellingen) staat buiten de
  locatie-scope.
- Rijniveau-beveiliging in Postgres als tweede slot (optioneel, fase 1 of
  later).
- Nummerreeksen worden per locatie en per jaar in een transactie opgehoogd
  (`SELECT ... FOR UPDATE`), zodat nummers nooit dubbel of met gaten zijn.

## 3. Domeinmodel in het kort

```
Vestiging 1—n Ruimte, EventType, Product, Arrangement, Sjabloon, NummerReeks, ApiKey, Integratie
Vestiging 1—n Bedrijf 1—n Contact
Vestiging 1—n Evenement n—1 Contact (opdrachtgever), n—1 Bedrijf (optioneel), n—1 EventType
Evenement 1—n Activiteit n—1 Ruimte
Activiteit 1—n Regel n—1 Product (met prijs, aantal, btw, nacalculatie)
Evenement 1—n Offerte (versies) 1—n OfferteRegel (snapshot)
Evenement 1—n Factuur (aanbetaling / termijn / eind / credit) 1—n FactuurRegel, 1—n Betaling
Evenement 1—n DraaiboekItem, Taak, Bijlage, Notitie, Gebeurtenis (tijdlijn)
Evenement 1—n Conversatie 1—n Bericht (in/uit, e-mail-ids)
Evenement 1—n IntegratieKoppeling (bijv. Zenchef-reservering-id per activiteit)
Job (achtergrondtaken), Webhook, WebhookLevering
```

Het volledige concept staat in `datamodel.prisma`.

## 4. Belangrijke ontwerpbeslissingen

### 4.1 Offerte als snapshot

Een offerte kopieert de regels van het dossier op het moment van versturen
(`OfferteRegel`), inclusief prijs en btw. Het dossier kan daarna wijzigen; de
verstuurde offerte blijft exact wat de gast zag. Een nieuwe versie is een nieuwe
snapshot. Acceptatie legt vast: naam, tijdstip, IP, user-agent, versie van de
voorwaarden, en een hash van de geaccepteerde inhoud.

### 4.2 Lopende afrekening

Per dossier wordt live berekend: totaal laatste offerte (of huidige regels),
gefactureerd, betaald, openstaand, verschil sinds laatste factuur. De
eindfactuur is een afgeleide: totaal werkelijke regels minus reeds gefactureerde
aanbetalingen. Creditnota's ontstaan alleen als er meer is gefactureerd dan het
werkelijke totaal. Dit vervangt de MICE-praktijk van "elke wijziging een nieuwe
factuur".

### 4.3 E-mail als eerste klas object

Elke uitgaande mail krijgt een `Message-ID`, `References` en een
`reply-to` met dossiertoken. Inbound webhook koppelt op token, daarna op
`In-Reply-To`, daarna op afzenderadres plus onderwerp. Niet te koppelen mail
komt in een "ongekoppeld"-bak voor handmatige toewijzing. Bijlagen worden in
de bestandsopslag gezet.

### 4.4 Prijsbepaling

Prijs van een regel = gekozen prijsvariant (expliciet) of de variant die geldig
is op de peildatum (instelling: evenementdatum of offertedatum). De gekozen
prijs wordt op de regel opgeslagen, zodat latere prijswijzigingen bestaande
dossiers niet raken.

### 4.5 Statusmachine en jobs

Statusovergangen lopen door één functie die valideert, de tijdlijn schrijft,
webhooks vuurt en vervolgtaken inplant (bijvoorbeeld bij "bevestigd":
aanbetalingsfactuur maken, Zenchef-reserveringen aanmaken, taken uit workflow
aanmaken). Jobs zijn idempotent en herhaalbaar.

## 5. Ontwerp per koppeling

### 5.1 Website en widget

- `GET /w/<vestiging>/<module>`: publieke aanvraagpagina, ook embedbaar.
- `widget.js`: kleine script die een knop of iframe plaatst (zelfde patroon als
  MICE), zodat de bestaande website alleen de URL hoeft te wisselen.
- Beschikbaarheid via `GET /api/public/<vestiging>/availability?from&to`
  (alleen vrij / optie / bezet, geen namen).

### 5.2 Bonnie AI

Bonnie leest vandaag de MICE-API. Twee routes:

1. Bonnie ondersteunt een generieke of eigen koppeling: wij leveren
   `GET /api/v1/availability`, `GET /api/v1/events?search=`,
   `POST /api/v1/requests` met API-key. Af te stemmen met Bonnie.
2. Bonnie ondersteunt alleen MICE: dan bouwen wij een compatibiliteitslaag die
   de MICE-endpoints nabootst die Bonnie gebruikt. Daarvoor is de exacte set
   endpoints nodig; die halen we uit de MICE REST-referentie zodra we die
   kunnen inzien (vanuit een gewone browser), of uit het Bonnie-dashboard.

Dit is de eerste externe afhankelijkheid die geregeld moet zijn vóór opzegging.

### 5.3 Zenchef

- Zenchef heeft een partner-API; MICE gebruikt die om reserveringen aan te
  maken. Toegang vereist aanmelding als integratiepartner bij Zenchef.
- Ontwerp: mapping `Ruimte → Zenchef zone` per locatie; bij status bevestigd
  en bij elke wijziging van een activiteit: reservering aanmaken, bijwerken of
  annuleren; aansluitende activiteiten in dezelfde ruimte worden één
  reservering; het Zenchef-reservering-id wordt bij de activiteit bewaard.
- Terugvalscenario als partner-toegang uitblijft: iCal- of e-mailmelding naar
  het reserveringsteam, of handmatige blokkade in Zenchef vanuit een dagelijkse
  takenlijst. Dat is functioneel minder, maar houdt de planning kloppend.

### 5.4 Boekhouding (Twinfield of Basecone)

- Optie A, Basecone: elke verzonden factuur en creditnota wordt als PDF plus
  UBL naar het Basecone-inleveradres van de juiste administratie gemaild
  (Texel en Sunsea hebben elk een eigen adres). Basecone herkent UBL en boekt
  in Twinfield. Geen API-registratie nodig; sluit aan op hoe inkoopfacturen nu
  al gaan. Betaalstatus komt niet terug.
- Optie B, Twinfield API: OAuth-registratie bij Twinfield, verkoopboeking per
  factuur met debiteur, grootboek per btw-tarief en omzetgroep; betaalstatus
  ophalen. Meer werk, wel volledig.
- Advies: start met A in fase 5, B als latere uitbreiding.

### 5.5 Mollie

- Per locatie een Mollie-profiel en API-key. Betaallink per factuur;
  webhook `POST /api/webhooks/mollie` zet de betaling op betaald en triggert
  bevestigingsmail en tijdlijn. Terugbetalingen bij creditnota's handmatig
  vanuit het dashboard, of later via API.

### 5.6 iCal

- `GET /ical/<token>.ics` per locatie en per ruimte; bevat bevestigde en
  optionele evenementen met status in de titel; alleen-lezen.

### 5.7 Eigen REST-API en webhooks

- `/api/v1/*` met API-keys (scope per locatie: lezen, schrijven), JSON,
  paginering, rate limiting. Resources: events, activities, quotes, invoices,
  contacts, companies, products, packages, rooms, availability, requests.
- Webhooks: per locatie URL's inschrijven op gebeurtenissen
  (event.created, event.status_changed, quote.accepted, invoice.sent,
  payment.received) met HMAC-handtekening en herleveringen.

## 6. Beveiliging en AVG

- Verwerkersovereenkomsten met maildienst, hosting, database, Mollie.
- Persoonsgegevens: minimaliseren, bewaartermijn per locatie instelbaar
  (bijvoorbeeld dossiers na 7 jaar anonimiseren, facturen 7 jaar bewaren).
- Klantomgeving-links: lange willekeurige tokens, vervallen na de
  evenementdatum plus x maanden, optioneel e-mailcode.
- Rollen en locatie-scope op elke query; audit-tijdlijn op elk dossier.
- Back-ups: dagelijkse database-snapshots plus bestandsopslag met versies;
  hersteltest in fase 1.
- Geheimen (API-keys van derden) versleuteld opgeslagen, nooit in de repo.
- Export: op elk moment alles per locatie naar CSV en JSON (ook om nooit meer
  "vast" te zitten in een systeem).

## 7. Plaats in de repo

Advies: een aparte applicatie (eigen repo of eigen map `apps/events` in een
monorepo). Redenen: ander publiek (beachclub-teams en gasten), andere
beveiligingseisen (publieke klantomgeving, webhooks), eigen deploy en domein.
Paviljoen Partner blijft de interne CRM. Gedeelde UI-componenten en
hulpfuncties kunnen later in een gedeeld pakket.
