# 01 · Onderzoek: wat is MICE Operations en hoe gebruiken wij het

Bronnen: de mailbox van koen@beachclubtexel.nl (contractcorrespondentie 2024,
facturen, systeemmails, nieuwsbrieven van MICE), de publieke documentatie van
MICE Operations (helpcenter, developerpagina's, partnerpagina's) en de eigen
skills voor de offertemails van Texel en Sunsea. De websites van MICE zelf
zijn vanuit deze omgeving geblokkeerd; de inhoud is via zoekresultaten en
nieuwsbrieven gereconstrueerd. Waar iets een aanname is, staat dat erbij.

## 1. Wat MICE Operations is

MICE Operations B.V. (Breda) levert sales- en planningssoftware voor
eventlocaties: hotels, congreslocaties, restaurants, cateraars en beachclubs.
Het pakket dekt de hele keten van aanvraag tot factuur:

1. Aanvraagmodule (widget) op de website van de locatie.
2. Evenementdossier met activiteiten, ruimtes, producten en arrangementen.
3. Interactieve digitale offerte met online akkoord.
4. Klantomgeving (portal) waarin de gast offertes, berichten, bijlagen en
   facturen ziet en online kan betalen.
5. Draaiboek en werklijsten (keuken, bediening, planbord).
6. Facturatie met aanbetalingen, creditnota's, herinneringen, PDF plus UBL.
7. Berichtenmodule (e-mail in en uit, gekoppeld aan het evenement).
8. CRM (bedrijven, contactpersonen), taken en workflows.
9. Rapportages en marges.
10. Koppelingen en een REST-API.

Er zijn drie pakketten: Start, Regular en Pro. Documentsjablonen zitten in
Regular en Pro; planborden, workflows en meerdere aanvraagmodules zitten in Pro.
Prijzen zijn een vast bedrag per maand per locatie. Een "cockpit account"
schakelt tussen meerdere locaties met één login.

## 2. Hoe Texel en Sunsea MICE vandaag gebruiken

### 2.1 Tijdlijn

| Datum | Gebeurtenis |
|---|---|
| tot 1 mei 2025 | Beide locaties werkten met MagicManager (Constell). |
| april 2024 | Demo en offerte van MICE voor "Beachclub Sunsea & Beachclub Texel", met cockpit-account voor twee locaties. |
| augustus 2024 | Offerte geaccepteerd. Overgangsperiode tot 1 januari 2025 gratis, zodat het account naast Magic ingericht kon worden. |
| oktober 2024 t/m december 2024 | Implementatie in drie online sessies plus training met de implementatiespecialist van MICE. Arrangementen en draaiboeken zijn grotendeels zelf overgezet. |
| januari 2025 | Eerste offertes en facturen vanuit MICE (Sunsea nummerreeks SUN25xxxx, Texel 2025xxxx). |
| juni 2025 | API-keys aangevraagd voor de koppeling met Bonnie AI (telefonische assistent), voor beide locaties. |
| september 2025 | MICE maakt API-keys zelfbeheer; koppelingen staan onder een eigen menu "Integraties". |
| september 2026 | Zenchef-koppeling wordt geactiveerd voor Texel (€ 30 per maand). |

### 2.2 Accounts en adressen

- Texel: `beachclubtexel.miceoperations.com`, uitgaande mail vanaf
  `beachclubtexel@app.miceoperations.com`, factuurnummers `2026xxxx`.
- Sunsea: `beachclubsunsea.miceoperations.com`, uitgaande mail vanaf
  `beachclubsunsea@app.miceoperations.com`, factuurnummers `SUN26xxxx`.
- Aanvraagmodule Texel: `app.miceoperations.com/widget/<id>` (popup of
  embedded op de website, of als QR-code).
- Gebruikers Texel: Koen, de eventmanager (info@) en de administratie (admin@).
  Alle systeemmeldingen gaan naar drie adressen tegelijk; dat is een bekende
  ergernis (veel dubbele mail).

### 2.3 De werkelijke werkstroom (afgeleid uit ruim 200 systeemmails)

1. **Aanvraag** komt binnen via de widget ("Er is een nieuwe aanvraag binnen":
   naam evenement, groepsnaam, aantal gasten, datum en tijd) of per mail of
   telefoon. Circa 15 widget-aanvragen per jaar bij Texel; de meeste bruiloften
   komen via mail en via weddingplanners.
2. **Offerte** wordt in het evenementdossier opgebouwd uit arrangementen en
   producten en als link verstuurd ("Offerte voor <naam>"), met de algemene
   voorwaarden als bijlage. De gast opent een klantomgeving, kan reageren via
   een berichtenknop en de offerte accepteren.
3. **Optie**: de datum staat 14 dagen in optie (Texel). MICE mailt automatisch
   "De offerte van <naam> is verlopen" als de geldigheid verstrijkt, en
   "De offerte van <naam> is geaccepteerd" bij akkoord.
4. **Berichten**: antwoorden van gasten komen binnen als "Deze e-mail is
   automatisch doorgestuurd..." met de oorspronkelijke afzender erin. Koen
   beantwoordt vaak rechtstreeks vanuit Gmail, niet vanuit MICE.
5. **Draaiboek**: het programma wordt in de maanden vooraf samen gefinetuned;
   aantallen definitief één week vooraf. Een automatische mail "Uw evenement is
   over een week" vraagt de gast om laatste wijzigingen.
6. **Facturatie**: aanbetaling (Texel 30 procent of volledig vooraf met
   cadeaubon van € 500; Sunsea 25 procent, 50 procent vier weken vooraf,
   25 procent een week vooraf, of volledig vooraf met 5 procent korting of
   10 procent tegoed), tussentijdse nieuwe facturen bij wijzigingen, en een
   eindafrekening. Elke factuur gaat als PDF plus UBL-XML mee. Creditnota's
   worden gebruikt om aanpassingen te verrekenen. Herinneringen en tweede
   herinneringen worden handmatig verstuurd.
7. **Boekhouding**: verkoopfacturen worden niet automatisch naar Twinfield
   gestuurd. De kassa (Eijsink/Booq) is leidend voor de omzet en is aan
   Twinfield gekoppeld; inkoopfacturen gaan via Basecone. Groepen en partijen
   worden ook in de kassa aangeslagen.

### 2.4 Koppelingen die er nu zijn of gewenst zijn

| Koppeling | Status | Wat het doet |
|---|---|---|
| Bonnie AI | API-keys afgegeven juni 2025 | Telefonische AI-assistent leest evenementen en beschikbaarheid uit MICE. |
| Zenchef | activatie september 2026, € 30 per maand | Ruimtes in MICE worden aan zones in Zenchef gekoppeld; elke activiteit op een gekoppelde ruimte wordt een reservering in Zenchef (tafels worden automatisch gekozen). Overlappende activiteiten in dezelfde ruimte worden samengevoegd. |
| Twinfield (via BoekhoudAPI) | optioneel in de offerte, niet actief | Verkoopfacturen automatisch naar Twinfield; betaalstatus terug naar MICE. |
| Mollie | niet zichtbaar in gebruik | Betaalknop in factuurmail en klantomgeving. |
| iCal | beschikbaar | Eenrichtingsfeed van de planning naar Google Agenda of Outlook. |
| Shiftbase, Nostradamus | aangeboden, niet in gebruik | Bevestigde evenementen worden open diensten in de personeelsplanning. |
| Kassa (unTill, Pieq, Scanfie) | aangeboden, niet in gebruik | Evenementen naar de kassa, omzet terug naar MICE voor facturatie. |
| REST-API en webhooks | beschikbaar | Evenementen aanmaken vanuit andere systemen; data uitlezen. |

### 2.5 Wat MICE niet kan (uit de correspondentie)

- Tijden binnen één activiteit niet splitsbaar (bijvoorbeeld bitterballen per
  half uur); moet handmatig als losse regels.
- Geen automatische aanbetalingsfactuur bij bevestiging; geen herinneringen op
  aanbetalingsfacturen.
- Herinneringen voor eindfacturen alleen handmatig.
- Elke wijziging in de offerte leidt tot een nieuwe factuur; gasten raken het
  overzicht kwijt ("waar komt dit openstaande bedrag vandaan").
- Gasten begrijpen de klantomgeving niet altijd ("ik ben in dit systeem even
  kwijt", "het lukt maar niet met het online systeem").
- Facturen kunnen naar de verkeerde contactpersoon gaan als twee gasten
  dezelfde voornaam hebben (contactkoppeling is fragiel).
- Systeemmeldingen gaan altijd naar alle gekoppelde adressen.
- Betalingen via automatische incasso werken niet voor oudere facturen.

Dit zijn meteen de punten waar een eigen systeem beter kan zijn.

## 3. Kosten

| Post | Bedrag | Bron |
|---|---|---|
| Licentie Texel | € 398,09 per maand incl. btw = € 329,00 excl. btw | facturen 202501785 t/m 202601921, elke maand hetzelfde bedrag |
| Licentie Sunsea | wordt aan Sunsea gefactureerd; bedrag onbekend | aanname gelijk aan Texel |
| Zenchef-koppeling | € 30 per maand excl. btw | activatiemail MICE support |
| Indexatie | jaarlijks per 1 januari, CBS dienstenprijsindex | factuurmail |
| Prijswijzigingen laten doorvoeren | € 50 per keer | nieuwsbrief december 2025 |

Jaartotaal voor beide locaties: circa € 7.900 tot € 8.600 excl. btw, oplopend
met indexatie.

Let op: in het contract van 2024 staat een opzegtermijn en looptijd. Die staan
in de door MICE opgestelde offerte (link in de mail van 6 augustus 2024) en in
de algemene voorwaarden. Dit moet worden nagelezen voordat een opzegdatum wordt
gekozen; de nieuwe voorwaarden en verwerkersovereenkomst van augustus 2026
gelden ook.

## 4. Volledige functie-inventaris van MICE

Dit is de checklist waar het eigen systeem tegen wordt afgezet. Per module de
functies die MICE biedt, en of wij ze gebruiken (G), nodig hebben (N) of
kunnen laten vallen (L).

### 4.1 Inrichting

| Functie | Wij |
|---|---|
| Meerdere locaties (cockpit) met eigen huisstijl, nummerreeksen, mailadres | G |
| Ruimtes met capaciteit, opstellingen, beschikbaarheid | G |
| Evenementtypes (bruiloft, bedrijfsuitje, feest, vergadering, diner) met eigen offerte-sjabloon | G |
| Producten met categorieën, btw-tarief per product, interne en externe omschrijving, foto's | G |
| Prijsvarianten per product (bijvoorbeeld 2026 en 2027, of laag- en hoogseizoen) | G |
| Arrangementen (pakketten) met prijs per persoon, samenstelling, keuzeproducten en suggesties; blauwdruk-draaiboek dat automatisch in het evenement komt | G |
| Groepsgroottestaffels en kortingen | N |
| Extra velden (custom fields) per evenement of contact | N |
| Algemene voorwaarden en bijlagen die bij offerte worden meegestuurd en geaccepteerd | G |
| Document- en offertesjablonen met variabelen, beelden en huisstijl | G |
| Bericht-sjablonen (offerte, herinnering, aanmaning, evenement over een week) | G |
| Gebruikers, rollen, crew-teams, ondersteuningstoegang | G |
| Meertaligheid klantcommunicatie (NL, EN, DE) | G |

### 4.2 Aanvragen en widget

| Functie | Wij |
|---|---|
| Aanvraagmodule als popup, embedded of losse pagina; meerdere modules per locatie; QR-code | G |
| Gast configureert zelf: evenementtype, datum, tijd, aantal gasten, arrangement, extra's, opmerkingen | G |
| Melding wanneer geen aanbod beschikbaar is op de zoekcriteria | N |
| Automatische bevestiging aan gast en melding aan team | G |
| Aanvraag wordt evenement in status "aanvraag" met concept-offerte | G |
| Aanvragen via API of webhook aanmaken (vanuit website of Bonnie) | G |

### 4.3 Evenementdossier

| Functie | Wij |
|---|---|
| Kerngegevens: naam, type, datum, tijden, gasten, opdrachtgever, contactpersoon, ruimte(s), status, eigenaar | G |
| Activiteiten (tijdblokken) met ruimte, aantal gasten en producten per activiteit | G |
| Statussen: aanvraag, optie (met vervaldatum), offerte verstuurd, bevestigd, geannuleerd, afgerond | G |
| Optiebeheer: automatische vervalmail, vrijgeven van datum | G |
| Meerdaagse evenementen | N |
| Interne notities, bijlagen, tijdlijn van wijzigingen | G |
| Dieetwensen en allergieën, tafelindeling, gastenlijst | N |
| Taken gekoppeld aan evenement, bedrijf of contact | G |
| Workflows: bij statuswijziging automatisch taken aanmaken of interne mails sturen | N |

### 4.4 Offertes en klantomgeving

| Functie | Wij |
|---|---|
| Interactieve offerte per link, met versies, geldigheidsdatum en online akkoord | G |
| Gast kan in de klantomgeving keuzes maken binnen de offerte (opties aan- en uitzetten) | N |
| Akkoord met voorwaarden en digitale handtekening met tijdstempel | G |
| Klantomgeving: berichten, bijlagen, offertes, facturen, betaalstatus, draaiboek voor de gast | G |
| Automatische mails bij verstuurd, geaccepteerd, verlopen | G |
| PDF-export van de offerte | G |

### 4.5 Planning en operatie

| Functie | Wij |
|---|---|
| Agenda per dag, week, maand; per ruimte; filters op status en type | G |
| Aangepaste planningsweergaven per afdeling | N |
| Draaiboek per evenement met tijdlijn, verantwoordelijke en opmerkingen | G |
| Werklijsten: keukenlijst, bedieningslijst, inkooplijst per dag of week (productaantallen) | G |
| Planbord: welke producten en ruimtes wanneer nodig zijn | N |
| Export naar PDF en Excel | G |
| iCal-feed | G |

### 4.6 Facturatie

| Functie | Wij |
|---|---|
| Factuur vanuit evenement met één klik; conceptstatus | G |
| Aanbetalingsfactuur als percentage of vast bedrag; verrekening op eindfactuur | G |
| Creditnota's | G |
| Nummerreeksen per locatie, btw-splitsing per tarief, kostensamenvatting | G |
| PDF plus UBL 2.1 XML als bijlage | G |
| Herinnering en aanmaning met sjabloon; vervaldatum | G |
| Betaalstatus, deelbetalingen, betaalknop (Mollie) | G |
| Externe facturen registreren (bijvoorbeeld uit de kassa) | N |
| Overzicht "welke evenementen zijn nog niet gefactureerd" | G |
| Koppeling naar boekhouding | N |

### 4.7 Berichten en CRM

| Functie | Wij |
|---|---|
| E-mail vanuit het systeem met eigen afzenderadres per locatie; antwoorden komen terug in het dossier | G |
| Opgeslagen antwoorden en ingeplande berichten | N |
| Conversaties markeren als behandeld | N |
| Bedrijven en contactpersonen met historie | G |
| Leadbronnen en pijplijn (aanvraag naar bevestigd, conversie) | N |

### 4.8 Rapportage

| Functie | Wij |
|---|---|
| Omzet per periode, per type, per ruimte; verwachte omzet uit opties en bevestigingen | G |
| Marges per product en arrangement (inkoopprijs) | L |
| Conversie van aanvragen | N |
| Exports | G |

### 4.9 Koppelingen en API

| Functie | Wij |
|---|---|
| REST-API met API-keys per locatie (evenementen, offertes, contacten uitlezen; evenementen aanmaken) | G (Bonnie) |
| Webhooks | N |
| Zenchef | G |
| Twinfield of Basecone | N |
| Mollie | N |
| Shiftbase | L (nu) |
| Kassa | L (nu) |

Legenda: G = in gebruik of duidelijk nodig, N = nodig of nuttig voor het
eigen systeem, L = kan (voorlopig) vervallen.

## 5. Conclusie van het onderzoek

1. MICE wordt intensief en dagelijks gebruikt; het is de ruggengraat van de
   groepsomzet van beide locaties. Een vervanger moet op dag één minstens de
   functies met een G bieden, anders ontstaat er dubbel werk.
2. De functies zijn stuk voor stuk bekend terrein: dossiers, offertes, PDF's,
   e-mail, facturen, agenda. Er zit geen technisch onmogelijke component in.
3. De echte afhankelijkheden zitten bij derden: Zenchef (partner-API vereist
   toestemming van Zenchef), Bonnie AI (moet onze API leren lezen of via een
   MICE-compatibele API werken), Twinfield (API-registratie) en Mollie
   (eenvoudig). Die moeten vroeg in het traject worden aangevraagd.
4. Een eigen systeem kan de bekende irritaties oplossen: overzichtelijke
   verrekening van aanbetalingen en wijzigingen, automatische
   aanbetalingsfacturen en herinneringen, slimmere meldingen, en een
   klantomgeving in de toon van de beachclubs in plaats van "Geachte Relatie".
5. Het besparingsdoel (circa € 8.000 per jaar) is realistisch, maar de
   terugverdientijd hangt af van de bouwtijd en van wie het onderhoud doet. Dat
   staat uitgewerkt in het bouwplan.
