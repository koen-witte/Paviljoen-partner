# 04 · Bouwplan

Uitgangspunt: het systeem wordt in fases gebouwd, elke fase levert iets
werkends op dat getest kan worden, en MICE blijft draaien tot de laatste fase
is afgerond en een parallelperiode goed is doorlopen. Geen half werk: een fase
is pas klaar als de acceptatiecriteria zijn gehaald.

## 1. Fasering

### Fase 0 · Voorbereiding (1 week)

Doel: alle externe afhankelijkheden in gang zetten, want die hebben de langste
doorlooptijd.

- Contract en opzegtermijn MICE nalezen (offerte 2024 en de algemene
  voorwaarden van augustus 2026); opzegdatum bepalen, bij voorkeur buiten het
  seizoen (november t/m februari).
- Bonnie AI: vragen welke MICE-endpoints zij gebruiken en of zij een eigen
  koppeling kunnen ondersteunen.
- Zenchef: partner-API-toegang aanvragen op naam van de beachclubs (of
  Paviljoen Partner).
- Mollie: zakelijke accounts per locatie (of controleren of die er al zijn).
- Maildienst (Postmark of Resend) aanmaken; DNS voor `mail.<domein>` per
  locatie (DKIM, SPF, DMARC, MX voor inbound).
- Hosting en database aanmaken; Sentry; bestandsopslag.
- Volledige export uit MICE maken (evenementen, contacten, producten,
  arrangementen, facturen als PDF en UBL) als nulmeting en voor de migratie.
- Beslissingen uit hoofdstuk 7 nemen.

Opgeleverd: lijst met toegangen en accounts, exportbestanden, gekozen
opzegdatum.

### Fase 1 · Fundament en inrichting (2 tot 3 weken)

- Nieuwe app opzetten (Next.js, Prisma, Postgres, Auth.js), CI met lint,
  typecheck en tests, staging en productie.
- Datamodel uit `datamodel.prisma` implementeren met migraties.
- Multi-tenant scope, rollen, gebruikersbeheer, cockpit-wissel tussen
  locaties.
- Inrichtingsschermen: locatie, ruimtes, evenementtypes, categorieën,
  producten met prijsvarianten, arrangementen met samenstelling en blauwdruk,
  betaalregelingen, voorwaarden, nummerreeksen, sjablonen (eerste versie).
- Import van de MICE-export voor producten, arrangementen en contacten.
- Back-up en hersteltest.

Acceptatie: Texel en Sunsea zijn volledig ingericht met de huidige catalogus;
een medewerker kan inloggen met de juiste rol en ziet alleen de eigen locatie.

### Fase 2 · Evenementdossier, agenda en draaiboek (3 weken)

- Dossier aanmaken en bewerken: kop, opdrachtgever, activiteiten met ruimte en
  tijden, regels uit arrangementen en losse producten, rondes binnen een
  activiteit, nacalculatieregels, notities, bijlagen, tijdlijn.
- Statusmachine met optievervaldatum en automatische vervaljob.
- Agenda (maand, week, dag, per ruimte) met bezet, optie en vrij.
- Draaiboek: automatisch gevuld uit blauwdruk, handmatig aanvulbaar; interne
  en gastversie; PDF.
- Werklijsten keuken en bediening per dag, inkooplijst per week; PDF.
- iCal-feed.
- Zoeken over dossiers en contacten.

Acceptatie: de eventmanager kan een bruiloft en een bedrijfsuitje volledig
plannen zoals nu in MICE, inclusief draaiboek en keukenlijst, sneller dan in
MICE.

### Fase 3 · Offertes, klantomgeving en berichten (3 tot 4 weken)

- Offerte-generator met snapshot, versies, geldigheid, sjabloon in huisstijl,
  PDF.
- Klantomgeving: offerte bekijken, keuzes maken, accepteren met vastlegging,
  berichten, bijlagen, aantallen en dieetwensen doorgeven.
- E-mail uit en in (inbound webhook, threading, ongekoppelde bak).
- Sjablonen per gebeurtenis en taal (NL, EN, DE), opgeslagen antwoorden,
  ingeplande berichten.
- Automatische mails: verstuurd, herinnering vóór verval, verlopen,
  geaccepteerd; "evenement over een week".
- Meldingen aan het team per gebruiker.
- Follow-upritme (dag 3, 7, 14) als taken.

Acceptatie: een testgast doorloopt aanvraag, offerte, vragen per mail en
akkoord volledig zonder tussenkomst; alle mail landt in het juiste dossier;
de acceptatie is juridisch traceerbaar.

### Fase 4 · Facturatie en betalingen (3 weken)

- Aanbetalings-, termijn-, eind- en creditfacturen volgens betaalregeling;
  lopende afrekening per dossier; cadeaubon en tegoed.
- PDF en UBL 2.1 met validatie in tests.
- Mollie-betaallinks en webhook; handmatige betalingen; deelbetalingen.
- Herinneringen 1 en 2 en aanmaning met betaalcontrole; vervaljobs.
- Overzichten openstaand, niet-gefactureerd, verwachte omzet.
- Export naar Excel.

Acceptatie: een compleet dossier van aanbetaling tot eindafrekening met een
tussentijdse wijziging en een creditnota klopt tot op de cent; de UBL wordt
door een validator geaccepteerd en door Basecone herkend.

### Fase 5 · Aanvraagwidget, API en koppelingen (3 tot 4 weken)

- Publieke aanvraagpagina per module, embed-script, QR, beschikbaarheidshint.
- REST-API v1 met API-keys en scopes; webhooks met HMAC en herlevering.
- Bonnie AI aansluiten (eigen API of compatibiliteitslaag).
- Zenchef: mapping ruimte-zone; reserveringen aanmaken, wijzigen, annuleren;
  samenvoegen van aansluitende activiteiten. Als partner-toegang uitblijft:
  terugvalscenario activeren.
- Boekhouding: UBL naar Basecone per locatie (optie A).
- Website(s) omzetten van MICE-widget naar de eigen widget.

Acceptatie: een telefonische aanvraag via Bonnie staat als dossier in het
systeem; een bevestigde activiteit staat als reservering in Zenchef; een
verzonden factuur staat als verkoopboeking in Twinfield.

### Fase 6 · CRM, taken, workflows en rapportage (2 weken)

- Bedrijven en contacten met historie; weddingplanners als tussenpersoon.
- Taken en workflows (statusgebonden acties).
- Rapportages: omzet, conversie, bezetting, openstaand.
- Dashboard per locatie en cockpit.

Acceptatie: de rapportages sluiten aan op de cijfers uit MICE over dezelfde
periode.

### Fase 7 · Migratie en parallelperiode (4 tot 6 weken, deels kalendertijd)

- Volledige migratie van lopende en toekomstige dossiers uit MICE (alle
  bevestigde bruiloften tot 2028), inclusief offertes als PDF, betaalstatus en
  historie van berichten (als bijlage-export).
- Afgesloten dossiers en facturen archiveren (PDF en UBL bewaren in het eigen
  systeem, 7 jaar).
- Twee tot vier weken parallel: nieuwe aanvragen in het eigen systeem, MICE
  alleen-lezen. Dagelijkse controle van mail, betalingen en Zenchef.
- Training van eventmanagers en administratie; handleiding met schermen.
- Opzegging MICE op de gekozen datum; laatste export en archivering.

Acceptatie: geen enkel toekomstig evenement ontbreekt; alle openstaande
facturen zijn overgenomen; team werkt een volle week zonder terug te vallen op
MICE.

### Fase 8 · Nazorg en uitbreidingen (doorlopend)

- Shiftbase, kassakoppeling, marges, review-verzoek, planbord, Twinfield API
  (optie B), passkeys, mobiele weergave voor keuken.

## 2. Tijdlijn en inzet

| Fase | Bouwtijd | Kalender |
|---|---|---|
| 0 | 1 week | direct |
| 1 | 2 tot 3 weken | week 2 t/m 4 |
| 2 | 3 weken | week 5 t/m 7 |
| 3 | 3 tot 4 weken | week 8 t/m 11 |
| 4 | 3 weken | week 12 t/m 14 |
| 5 | 3 tot 4 weken | week 15 t/m 18 |
| 6 | 2 weken | week 19 t/m 20 |
| 7 | 4 tot 6 weken | week 21 t/m 26 |

Totaal circa 5 tot 6 maanden bij één bouwer (Claude Code met Koen als
opdrachtgever en tester) die er doorlopend aan werkt. Start in oktober 2026
betekent overstap in het laagseizoen (februari of maart 2027), vóór het seizoen
van Sunsea (maart) en de zomerbruiloften.

## 3. Kosten en businesscase

| Post | Nu (MICE) | Straks (eigen) |
|---|---|---|
| Licenties | circa € 7.900 tot € 8.600 per jaar excl. btw, geïndexeerd | € 0 |
| Hosting, database, mail, opslag, foutmonitoring | in licentie | circa € 500 tot € 1.000 per jaar |
| Mollie | n.v.t. of via MICE | circa € 0,30 plus 0 tot 1,5 procent per transactie, alleen bij gebruik |
| Onderhoud en doorontwikkeling | in licentie | eigen tijd; realistisch enkele uren per maand plus incidenten |
| Bouw | n.v.t. | eenmalig, zie tijdlijn |

Besparing circa € 7.000 per jaar netto na hosting. De echte prijs is de bouw
en het feit dat onderhoud, beveiliging en updates voortaan bij ons liggen.
Dat is verantwoord als het systeem klein en overzichtelijk blijft en als de
code en documentatie zo zijn dat een andere ontwikkelaar het kan overnemen.

## 4. Risico's en beheersing

| Risico | Kans | Impact | Maatregel |
|---|---|---|---|
| Zenchef geeft geen partner-API-toegang | middel | middel | vroeg aanvragen (fase 0); terugvalscenario met takenlijst of iCal |
| Bonnie kan niet op eigen API | middel | hoog | fase 0 afstemmen; compatibiliteitslaag bouwen; anders Bonnie-koppeling tijdelijk via MICE-export |
| E-mailbezorging (spam) | laag | hoog | eigen subdomein, DKIM/SPF/DMARC, gerenommeerde maildienst, monitoring op bounces |
| Fouten in facturen of btw | laag | hoog | geautomatiseerde tests op afrekeningen, UBL-validatie, controle door accountant in parallelperiode |
| Team valt terug op oude gewoontes | middel | middel | training, parallelperiode, MICE alleen-lezen |
| Bouw loopt uit | middel | middel | fases met harde acceptatie; opzegdatum pas kiezen na fase 4 |
| Verlies van historie uit MICE | laag | middel | volledige export in fase 0 en fase 7, archief in eigen systeem |
| Eén persoon kent het systeem | hoog | middel | documentatie per module, tests, overdraagbare code |
| Persoonsgegevens en AVG | laag | hoog | verwerkersovereenkomsten, bewaartermijnen, toegangsbeheer, back-ups |

## 5. Testaanpak

- Unit tests voor prijsberekening, btw-splitsing, afrekeningen, nummerreeksen,
  statusovergangen.
- Integratietests voor e-mail in en uit (met testinbox), Mollie-webhooks,
  UBL-validatie.
- End-to-end test van de gastflow (aanvraag tot betaling) met Playwright.
- Handmatige acceptatietest per fase door Koen en de eventmanager aan de hand
  van echte dossiers (geanonimiseerd).
- Parallelperiode met dagelijkse vergelijking tegen MICE.

## 6. Migratie uit MICE

1. Export per locatie: evenementen (met activiteiten en regels), contacten,
   bedrijven, producten, arrangementen, offertes (PDF), facturen (PDF en UBL),
   betalingen, berichten (indien exporteerbaar), bijlagen.
2. Importscripts met mapping-tabellen (product-id's, ruimte-namen,
   evenementtypes) en een droogloop op staging.
3. Handmatige controle van alle bevestigde toekomstige evenementen.
4. Nummerreeksen laten aansluiten (volgende factuurnummer na het laatste
   MICE-nummer per locatie, per jaar).
5. Klantlinks: gasten met een lopend dossier krijgen één mail met de nieuwe
   klantomgeving.

## 7. Openstaande beslissingen

| Nr | Beslissing | Advies |
|---|---|---|
| 1 | Losse app of module in Paviljoen Partner | losse app, eigen repo `beachclub-events`, gedeelde huisstijl-componenten later |
| 2 | Database en hosting | Postgres (Neon) plus Vercel; alternatief Supabase |
| 3 | Maildienst | Postmark (beste inbound en bezorging), anders Resend |
| 4 | PDF-techniek | HTML naar PDF met Chromium op een aparte functie; anders react-pdf |
| 5 | Boekhouding | eerst Basecone via UBL, later Twinfield API |
| 6 | Bonnie | eigen API als Bonnie dat kan; anders compatibiliteitslaag |
| 7 | Naam en domein van het systeem en de klantomgeving | bijvoorbeeld `events.beachclubtexel.nl` en `events.beachclubsunsea.nl` op één app |
| 8 | Opzegdatum MICE | na acceptatie fase 4, in laagseizoen |
| 9 | Wie test en traint | Koen plus de eventmanager van Texel en Robert voor Sunsea |
| 10 | Ook geschikt maken voor andere paviljoens (product van Paviljoen Partner) | ja in ontwerp (multi-tenant), nee in scope van de eerste bouw |

## 8. Volgende stap

Na akkoord op beslissingen 1 t/m 4 start fase 0 en fase 1 direct: repo en
omgeving opzetten, datamodel implementeren, inrichting van Texel en Sunsea
invoeren. Fase 0-acties richting Bonnie, Zenchef, Mollie en de maildienst
kunnen tegelijk worden uitgezet, omdat die het kritieke pad bepalen.
