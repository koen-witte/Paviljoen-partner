# 02 · Functioneel ontwerp van het eigen eventsysteem

Werktitel: **Beachclub Events** (naam is vrij te kiezen). Het systeem bedient
meerdere locaties (Texel, Sunsea, later eventueel andere paviljoens of klanten
van Paviljoen Partner) vanuit één applicatie met strikt gescheiden data per
locatie.

## 1. Uitgangspunten

1. **Eén dossier per evenement.** Alles hangt aan het evenement: aanvraag,
   activiteiten, offertes, berichten, draaiboek, facturen, betalingen, taken.
2. **De gast ziet één helder overzicht.** Geen losse facturen per wijziging
   maar een lopende afrekening: offertebedrag, betaald, openstaand, verschil
   na de laatste wijziging. Dit lost de grootste klachtenbron op.
3. **Toon van de beachclubs.** Alle uitgaande mail is per locatie instelbaar
   ("Ha Luca," in plaats van "Geachte Relatie").
4. **Automatiseren wat MICE handmatig laat.** Aanbetalingsfactuur bij
   bevestiging, herinneringen op vervaldatum (met een controle op inmiddels
   ontvangen betaling), optievervaldatum, "over een week"-mail.
5. **Koppelbaar.** Eigen REST-API en webhooks vanaf het begin, zodat de
   boekhouding en de website eraan kunnen en latere koppelingen (zoals Bonnie
   of Zenchef) mogelijk blijven.
6. **Niet meer dan nodig.** Marges, planborden en kassakoppeling komen pas als
   daar vraag naar is.

## 2. Rollen

| Rol | Kan |
|---|---|
| Eigenaar (cockpit) | alles, op alle locaties; instellingen, gebruikers, koppelingen, rapportages |
| Eventmanager | dossiers, offertes, berichten, draaiboek, facturen opstellen en versturen, binnen de eigen locatie(s) |
| Administratie | facturen, betalingen, herinneringen, creditnota's, exports; geen offertes |
| Keuken en bediening | alleen lezen: agenda, draaiboek, werklijsten van vandaag en deze week |
| Gast (klantomgeving) | eigen dossier bekijken, offerte accepteren, berichten sturen, betalen, aantallen doorgeven |
| Koppeling (API-key) | scope-gebonden lees- en schrijfrechten per locatie |

## 3. Modules en gebruikersverhalen

### 3.1 Inrichting per locatie

- Locatiegegevens: naam, rechtspersoon, adres, btw-nummer, IBAN, logo, kleuren,
  afzenderadres en reply-to, handtekening, talen.
- Ruimtes: naam, capaciteit per opstelling, binnen of buiten; veld voor een
  externe zone (bijvoorbeeld Zenchef) blijft in het datamodel, maar wordt in de
  eerste bouw niet gebruikt.
- Evenementtypes met standaard offerte-sjabloon, standaard betaalregeling,
  standaard optieduur en standaard draaiboek.
- Productcatalogus: categorieën (welkomst, lunch, diner, drank, activiteiten,
  techniek, extra's), producten met btw-tarief (9 of 21 procent, of 0), eenheid
  (per persoon, per stuk, per uur, vast), interne en externe omschrijving,
  foto, actief of inactief.
- Prijsvarianten: per product meerdere prijzen met geldigheidsperiode, zodat
  2027-prijzen alvast klaarstaan en offertes de prijs pakken die op de
  evenementdatum geldt (instelbaar: prijs op offertedatum of op evenementdatum).
- Arrangementen: naam, prijs per persoon of vaste prijs, samenstelling
  (inbegrepen producten), keuzeproducten, suggesties (upsell), staffels op
  groepsgrootte, blauwdruk-draaiboek (tijdblokken relatief aan starttijd).
- Betaalregelingen als herbruikbare regels, per locatie:
  - Texel: 30 procent aanbetaling bij vastleggen; of 100 procent vooraf met
    cadeaubon van € 500; eindafrekening op basis van definitieve aantallen,
    minder gasten wordt gecrediteerd.
  - Sunsea: 25 procent bij boeking, 50 procent vier weken vooraf, 25 procent
    een week vooraf; of 100 procent vooraf met 5 procent korting of 10 procent
    tegoed voor horeca-upgrades.
- Sjablonen: offerte (opmaak, intro, beelden), factuur, draaiboek voor gast,
  e-mailsjablonen per gebeurtenis en per taal.
- Voorwaarden: algemene voorwaarden per locatie als PDF, versie en datum;
  akkoord wordt vastgelegd bij acceptatie.
- Nummerreeksen: offertes, facturen, creditnota's, per locatie en per jaar
  (bijvoorbeeld `2026-0068` en `SUN26-0284`), aaneengesloten en niet te
  wijzigen na verzending.

### 3.2 Aanvragen en widget

- Publieke aanvraagpagina per locatie en per module (bijvoorbeeld "Bruiloft",
  "Bedrijfsuitje", "Feest", "Vergadering"), embedbaar als iframe of popup via
  één scripttag, en als losse URL of QR-code.
- Stappen: type, datum en dagdeel, aantal gasten, arrangement (optioneel),
  extra's, wensen, contactgegevens, akkoord privacy.
- Beschikbaarheidshint: per datum zichtbaar of de locatie al bezet of in optie
  is (instelbaar: tonen of niet).
- Bij verzenden: evenement in status "aanvraag", automatische bevestiging aan
  de gast (per locatie instelbaar), melding aan het team (per gebruiker
  instelbaar, niet standaard naar iedereen), optioneel concept-offerte op
  basis van het gekozen arrangement.
- Aanvragen kunnen ook handmatig, per API of per inkomende e-mail worden
  aangemaakt.

### 3.3 Evenementdossier

- Kop: naam, type, status, datum, start en eind, verwachte en definitieve
  gasten, opdrachtgever (bedrijf of particulier), contactpersoon, taal,
  eigenaar (eventmanager), bron.
- Activiteiten: tijdblokken met ruimte, aantal gasten, omschrijving; producten
  hangen aan een activiteit; tijden binnen een activiteit zijn splitsbaar in
  rondes (bijvoorbeeld hapjes om 18:00, 18:30, 19:00).
- Regels: product, aantal, eenheid, prijs, btw, optioneel "op nacalculatie"
  (drank, DJ) met later ingevuld werkelijk aantal.
- Statussen en overgangen:
  - aanvraag → optie (met vervaldatum, standaard 14 dagen)
  - optie → offerte verstuurd (kan samenvallen)
  - offerte verstuurd → bevestigd (gast accepteert, of handmatig)
  - optie of offerte → verlopen (automatisch op vervaldatum, met mail)
  - elke status → geannuleerd (met reden en eventuele annuleringskosten)
  - bevestigd → afgerond (na evenementdatum, na eindfactuur)
- Datumconflicten: bij het plannen zichtbaar welke ruimtes bezet, in optie of
  vrij zijn; dubbele boeking op dezelfde ruimte vereist expliciete bevestiging.
- Dossieronderdelen: notities, bijlagen (speeches, plattegronden), dieetwensen
  en allergieën per aantal, tijdlijn van alle wijzigingen (wie, wat, wanneer),
  taken.
- Meerdaagse evenementen: een evenement kan meerdere dagen beslaan met
  activiteiten per dag.

### 3.4 Offertes en klantomgeving

- Offerte is een versie van het dossier op een moment: regels, totalen per
  btw-tarief, betaalregeling, geldigheidsdatum, voorwaarden, intro-tekst en
  beelden. Versie 1, 2, 3 blijven bewaard; de gast ziet de laatste, eerdere
  versies zijn zichtbaar als historie.
- Versturen: e-mail met beveiligde link (token), PDF als bijlage optioneel.
- Klantomgeving (per dossier, via link zonder wachtwoord, optioneel met
  e-mailcode): offerte bekijken en accepteren (naam, datum, tijd, IP-adres
  vastgelegd, voorwaarden aangevinkt), berichten sturen en lezen, bijlagen
  downloaden en uploaden, draaiboek voor de gast, aantallen en dieetwensen
  doorgeven tot een instelbare deadline, facturen en betaalstatus, betalen via
  Mollie.
- Interactieve keuzes: producten in de offerte die de gast zelf mag aan- of
  uitzetten (bijvoorbeeld ijscokar erbij). Optioneel per regel.
- Automatische mails: offerte verstuurd, herinnering vóór verval (bijvoorbeeld
  drie dagen), verlopen, geaccepteerd (aan gast en team).
- Follow-upritme uit de offerte-skills (dag 3, dag 7, dag 14) als taken of als
  ingeplande berichten die de eventmanager kan goedkeuren.

### 3.5 Berichten

- Eigen mailadres per locatie (bijvoorbeeld `events@beachclubtexel.nl` of een
  subdomein), verzending via een transactionele maildienst met inbound
  parsing. Elke uitgaande mail krijgt een dossier-referentie in de headers en
  in het reply-to-adres, zodat antwoorden automatisch in het juiste dossier
  landen, ook als de gast vanaf een ander adres antwoordt.
- Threads per dossier, met status open of behandeld, toewijzing aan gebruiker.
- Interne notities naast klantberichten.
- Sjablonen met variabelen en per taal; opgeslagen antwoorden; berichten
  inplannen.
- Meldingen aan het team per gebruiker instelbaar (nieuwe aanvraag, bericht van
  gast, offerte geaccepteerd, betaling ontvangen), per mail en in de app.

### 3.6 Planning en operatie

- Agenda: maand, week, dag; per locatie en per ruimte; kleur op status; filter
  op type.
- Draaiboek per evenement: tijdlijn met verantwoordelijke afdeling, ruimte,
  aantallen, opmerkingen; automatisch gevuld vanuit arrangement-blauwdruk en
  activiteiten, daarna handmatig aan te vullen; versie voor intern en versie
  voor de gast.
- Werklijsten: keukenlijst en bedieningslijst per dag (welke producten, hoeveel,
  hoe laat, welke ruimte, dieetwensen), inkooplijst per week; printbaar en als
  PDF.
- iCal-feed per locatie en per ruimte (alleen-lezen, token in de URL).
- Eén-week-vooraf-mail aan de gast en interne taak "definitieve aantallen
  ophalen".

### 3.7 Facturatie en betalingen

- Facturen vanuit het dossier: aanbetaling (percentage of bedrag volgens
  betaalregeling), termijnfactuur, eindfactuur (verrekent alle
  aanbetalingen), creditnota. Conceptstatus vóór verzending; na verzending
  onveranderlijk.
- Eindfactuur toont: offertebedrag laatste versie, wijzigingen sinds vorige
  factuur, nacalculatieregels, reeds betaald, openstaand. Dit is de
  "lopende afrekening" die de gast ook in de klantomgeving ziet.
- Cadeaubon of tegoed als saldo op het dossier of de relatie.
- Btw-splitsing per tarief, factuurnummerreeks per locatie, betaaltermijn per
  locatie of per factuur.
- Bijlagen: PDF en UBL 2.1 (Peppol BIS 3 compatibel), zodat zakelijke klanten
  en de boekhouding ze kunnen inlezen.
- Betalingen: bankoverschrijving als standaard (IBAN en betaalkenmerk per
  locatie op factuur en in klantomgeving, handmatige registratie van ontvangen
  betalingen); Mollie-betaallink (iDEAL, creditcard, Bancontact) als
  aanvullende optie met status betaald bij webhook; deelbetalingen.
- Herinneringen: automatisch op vervaldatum plus x dagen, met controle dat er
  geen betaling is binnengekomen; tweede herinnering en aanmaning met eigen
  sjabloon; alles zichtbaar in de tijdlijn.
- Overzichten: openstaand per locatie, verwachte omzet uit bevestigde
  evenementen, niet-gefactureerde evenementen na de datum.

### 3.8 CRM en taken

- Bedrijven en contactpersonen met adres, btw-nummer, factuuradres, taal,
  voorkeuren, historie van evenementen en omzet.
- Weddingplanners en bureaus als tussenpersoon op een dossier (met eigen
  contactpersoon naast het bruidspaar).
- Taken met deadline, verantwoordelijke, gekoppeld aan dossier of relatie;
  automatisch aangemaakt door workflows (bij bevestiging: proefdiner plannen,
  bij een week vooraf: aantallen checken).
- Leadbronnen (website, telefoon via Bonnie, weddingplanner, herhaalklant).

### 3.9 Rapportage

- Omzet en verwachte omzet per maand, per type, per ruimte, per locatie.
- Conversie: aanvragen, offertes, bevestigingen, verlopen; doorlooptijd.
- Bezetting per ruimte per maand.
- Openstaande posten en betaalgedrag.
- Exports naar Excel.

### 3.10 Koppelingen (functioneel)

| Koppeling | Gedrag |
|---|---|
| Website (widget) | aanvraagpagina embedden; beschikbaarheid tonen |
| Bonnie AI | **vervallen** (besluit 19 sep 2026): koppeling wordt niet gebouwd; telefonische aanvragen worden handmatig ingevoerd. De REST-API maakt een latere koppeling mogelijk |
| Zenchef | **vervallen** (besluit 19 sep 2026): niet noodzakelijk; het reserveringsteam krijgt evenementen via iCal-feed of dagelijkse takenlijst |
| Twinfield of Basecone | verzonden facturen en creditnota's als verkoopboeking aanleveren; betaalstatus terug (bij Twinfield) |
| Mollie | betaallinks en webhooks, aanvullend op bankoverschrijving |
| Google Agenda en Outlook | iCal-feed |
| Shiftbase (later) | bevestigde evenementen als open diensten |
| Kassa Eijsink (later) | groepsomzet uit de kassa koppelen aan een dossier voor nacalculatie |
| Eigen REST-API en webhooks | alles hierboven, plus voor toekomstige tools |

## 4. E-mailmatrix

| Moment | Aan | Standaard aan/uit |
|---|---|---|
| Aanvraag ontvangen | gast | aan |
| Nieuwe aanvraag | team (per gebruiker) | aan voor eventmanager |
| Offerte verstuurd | gast | aan |
| Offerte verloopt over 3 dagen | gast | uit (keuze) |
| Offerte verlopen | gast en team | aan |
| Offerte geaccepteerd | gast en team | aan |
| Aanbetalingsfactuur | gast | aan bij bevestiging |
| Termijnfactuur | gast | volgens betaalregeling |
| Factuur vervallen, herinnering 1 en 2, aanmaning | gast | aan, met betaalcontrole |
| Betaling ontvangen | gast en administratie | aan |
| Evenement over een week | gast | aan |
| Nieuw bericht van gast | toegewezen gebruiker | aan |
| Bedankt en review-verzoek na afloop | gast | uit (keuze) |

## 5. Prioriteiten (MoSCoW)

- **Must** (nodig om MICE op te zeggen): inrichting, dossiers, activiteiten,
  offertes met online akkoord, klantomgeving, berichten met inbound e-mail,
  agenda, draaiboek, werklijsten, facturatie met PDF en UBL, aanbetalingen en
  verrekening, betaalregistratie (bankoverschrijving standaard, Mollie
  aanvullend), herinneringen, CRM-basis, iCal, REST-API v1, export van alle
  data.
- **Should**: workflows en taken, interactieve keuzes in offertes, prijsvarianten
  met periode, rapportages, boekhoudkoppeling, meertalige sjablonen (DE, EN).
- **Could**: planbord, Shiftbase, kassakoppeling, marges, review-verzoek,
  gastenlijst en tafelindeling, Bonnie- en Zenchef-koppeling (beide op
  19 september 2026 uit de eerste bouw gehaald).
- **Won't (nu)**: ticketverkoop, kamerreservering, kassa-functionaliteit.
