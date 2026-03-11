import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

interface PaviljoenData {
  naam: string;
  locatie: string;
  badplaats: string;
  gemeente: string;
  provincie: string;
  website?: string;
  telefoon?: string;
  typeExploitatie?: string;
  status?: string;
}

const paviljoens: PaviljoenData[] = [
  // ========== SCHEVENINGEN ==========
  { naam: "Aloha Beach Club", locatie: "Strandweg 1, Scheveningen", badplaats: "Scheveningen", gemeente: "Den Haag", provincie: "Zuid-Holland", website: "https://www.alohabeach.nl", telefoon: "070-3543600", typeExploitatie: "Beach Club" },
  { naam: "Hart Beach", locatie: "Vissershaven, Scheveningen", badplaats: "Scheveningen", gemeente: "Den Haag", provincie: "Zuid-Holland", website: "https://www.hartbeach.nl", telefoon: "070-3584590", typeExploitatie: "Beach Club" },
  { naam: "De Waterreus", locatie: "Dr. Lelykade 33, Scheveningen", badplaats: "Scheveningen", gemeente: "Den Haag", provincie: "Zuid-Holland", website: "https://www.dewaterreus.nl", telefoon: "070-3543048", typeExploitatie: "Restaurant / Strandpaviljoen" },
  { naam: "Barbarossa Beach Bar", locatie: "Zwarte Pad, Scheveningen", badplaats: "Scheveningen", gemeente: "Den Haag", provincie: "Zuid-Holland", website: "https://www.barbarossa.nl", typeExploitatie: "Beach Club" },
  { naam: "Indigo", locatie: "Zwarte Pad, Scheveningen", badplaats: "Scheveningen", gemeente: "Den Haag", provincie: "Zuid-Holland", website: "https://www.indigoscheveningen.nl", typeExploitatie: "Beach Club" },
  { naam: "Strandpaviljoen Buiten", locatie: "Zwarte Pad, Scheveningen", badplaats: "Scheveningen", gemeente: "Den Haag", provincie: "Zuid-Holland", website: "https://www.ganaarbuiten.nl", typeExploitatie: "Strandpaviljoen" },
  { naam: "SummerTime", locatie: "Strandweg, Scheveningen", badplaats: "Scheveningen", gemeente: "Den Haag", provincie: "Zuid-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "El Niño", locatie: "Strandweg, Scheveningen", badplaats: "Scheveningen", gemeente: "Den Haag", provincie: "Zuid-Holland", website: "https://www.elnino.nl", typeExploitatie: "Beach Club" },
  { naam: "Solbeach", locatie: "Strandweg, Scheveningen", badplaats: "Scheveningen", gemeente: "Den Haag", provincie: "Zuid-Holland", website: "https://www.solbeach.nl", typeExploitatie: "Beach Club" },
  { naam: "Zanzibar Beach Club", locatie: "Strandweg, Scheveningen", badplaats: "Scheveningen", gemeente: "Den Haag", provincie: "Zuid-Holland", website: "https://www.zanzibar.nl", typeExploitatie: "Beach Club" },
  { naam: "Boomerang Beach Club", locatie: "Strandweg, Scheveningen", badplaats: "Scheveningen", gemeente: "Den Haag", provincie: "Zuid-Holland", website: "https://www.boomerangbeach.nl", typeExploitatie: "Beach Club" },
  { naam: "Beach Club WOW", locatie: "Strandweg, Scheveningen", badplaats: "Scheveningen", gemeente: "Den Haag", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },
  { naam: "The Shore", locatie: "Strandweg, Scheveningen", badplaats: "Scheveningen", gemeente: "Den Haag", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },
  { naam: "Copacabana", locatie: "Strandweg, Scheveningen", badplaats: "Scheveningen", gemeente: "Den Haag", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },
  { naam: "ChouChou", locatie: "Strandweg, Scheveningen", badplaats: "Scheveningen", gemeente: "Den Haag", provincie: "Zuid-Holland", typeExploitatie: "Strandpaviljoen" },

  // ========== KIJKDUIN ==========
  { naam: "Strandtent 14", locatie: "Strand Kijkduin, Den Haag", badplaats: "Kijkduin", gemeente: "Den Haag", provincie: "Zuid-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Dunes", locatie: "Strand Kijkduin, Den Haag", badplaats: "Kijkduin", gemeente: "Den Haag", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },
  { naam: "Strandpaviljoen Zuid", locatie: "Zuiderstrand, Den Haag", badplaats: "Kijkduin", gemeente: "Den Haag", provincie: "Zuid-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "De Staat", locatie: "Zuiderstrand, Den Haag", badplaats: "Kijkduin", gemeente: "Den Haag", provincie: "Zuid-Holland", typeExploitatie: "Strandpaviljoen" },

  // ========== ZANDVOORT ==========
  { naam: "Tijn Akersloot", locatie: "Boulevard Barnaart, Zandvoort", badplaats: "Zandvoort", gemeente: "Zandvoort", provincie: "Noord-Holland", website: "https://www.tijnakersloot.nl", typeExploitatie: "Restaurant / Strandpaviljoen" },
  { naam: "NIUS Beach House", locatie: "Zuid Boulevard, Zandvoort", badplaats: "Zandvoort", gemeente: "Zandvoort", provincie: "Noord-Holland", website: "https://www.niusbeachhouse.nl", typeExploitatie: "Beach Club" },
  { naam: "De Haven van Zandvoort", locatie: "Boulevard Barnaart, Zandvoort", badplaats: "Zandvoort", gemeente: "Zandvoort", provincie: "Noord-Holland", website: "https://www.dehavenvanzandvoort.nl", typeExploitatie: "Restaurant / Beach Club" },
  { naam: "Thalassa", locatie: "Boulevard Barnaart, Zandvoort", badplaats: "Zandvoort", gemeente: "Zandvoort", provincie: "Noord-Holland", website: "https://www.thalassazandvoort.nl", typeExploitatie: "Restaurant / Strandpaviljoen" },
  { naam: "Piatti", locatie: "Boulevard Barnaart, Zandvoort", badplaats: "Zandvoort", gemeente: "Zandvoort", provincie: "Noord-Holland", typeExploitatie: "Restaurant / Strandpaviljoen" },
  { naam: "Hippie Fish", locatie: "Boulevard Barnaart, Zandvoort", badplaats: "Zandvoort", gemeente: "Zandvoort", provincie: "Noord-Holland", website: "https://www.hippiefish.nl", typeExploitatie: "Beach Club" },
  { naam: "Noosa Beach", locatie: "Boulevard Barnaart, Zandvoort", badplaats: "Zandvoort", gemeente: "Zandvoort", provincie: "Noord-Holland", typeExploitatie: "Beach Club" },
  { naam: "Ubuntu Beach", locatie: "Boulevard Barnaart, Zandvoort", badplaats: "Zandvoort", gemeente: "Zandvoort", provincie: "Noord-Holland", typeExploitatie: "Beach Club" },
  { naam: "Club Nautique", locatie: "Noord Boulevard, Zandvoort", badplaats: "Zandvoort", gemeente: "Zandvoort", provincie: "Noord-Holland", website: "https://www.clubnautique.nl", typeExploitatie: "Beach Club" },
  { naam: "Ohana Beach", locatie: "Boulevard Barnaart, Zandvoort", badplaats: "Zandvoort", gemeente: "Zandvoort", provincie: "Noord-Holland", typeExploitatie: "Beach Club" },
  { naam: "Bodhi Beach", locatie: "Zuid Boulevard, Zandvoort", badplaats: "Zandvoort", gemeente: "Zandvoort", provincie: "Noord-Holland", website: "https://bodhibeach.nl", typeExploitatie: "Beach Club" },
  { naam: "Havana aan Zee", locatie: "Boulevard Barnaart, Zandvoort", badplaats: "Zandvoort", gemeente: "Zandvoort", provincie: "Noord-Holland", website: "https://havana-zandvoort.nl", typeExploitatie: "Beach Club" },
  { naam: "Bernie's Beach Club", locatie: "Boulevard Barnaart, Zandvoort", badplaats: "Zandvoort", gemeente: "Zandvoort", provincie: "Noord-Holland", typeExploitatie: "Beach Club" },
  { naam: "Kayuca", locatie: "Boulevard Barnaart, Zandvoort", badplaats: "Zandvoort", gemeente: "Zandvoort", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Aan Zee", locatie: "Boulevard Barnaart, Zandvoort", badplaats: "Zandvoort", gemeente: "Zandvoort", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },

  // ========== NOORDWIJK ==========
  { naam: "Branding Beachclub", locatie: "Koningin Astrid Boulevard 105, Noordwijk", badplaats: "Noordwijk", gemeente: "Noordwijk", provincie: "Zuid-Holland", website: "https://www.brandingbeachclub.nl", typeExploitatie: "Beach Club" },
  { naam: "Strandpaviljoen De Zeemeeuw", locatie: "Strandopgang 18, Noordwijk", badplaats: "Noordwijk", gemeente: "Noordwijk", provincie: "Zuid-Holland", website: "https://www.zeemeeuw.com", typeExploitatie: "Strandpaviljoen" },
  { naam: "Breakers Beach House", locatie: "Koningin Astrid Boulevard, Noordwijk", badplaats: "Noordwijk", gemeente: "Noordwijk", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },
  { naam: "Alexander Beach Club", locatie: "Koningin Astrid Boulevard, Noordwijk", badplaats: "Noordwijk", gemeente: "Noordwijk", provincie: "Zuid-Holland", website: "https://www.alexanderbeachclub.nl", typeExploitatie: "Beach Club" },
  { naam: "Beachclub O.", locatie: "Koningin Astrid Boulevard, Noordwijk", badplaats: "Noordwijk", gemeente: "Noordwijk", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },
  { naam: "Beachclub Bries", locatie: "Koningin Astrid Boulevard, Noordwijk", badplaats: "Noordwijk", gemeente: "Noordwijk", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },
  { naam: "Witsand", locatie: "Koningin Astrid Boulevard, Noordwijk", badplaats: "Noordwijk", gemeente: "Noordwijk", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },
  { naam: "Tulum Noordwijk", locatie: "Koningin Astrid Boulevard, Noordwijk", badplaats: "Noordwijk", gemeente: "Noordwijk", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },
  { naam: "B.E.A.C.H.", locatie: "Koningin Astrid Boulevard, Noordwijk", badplaats: "Noordwijk", gemeente: "Noordwijk", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },
  { naam: "Nomade Beach House", locatie: "Koningin Wilhelmina Boulevard 104, Noordwijk", badplaats: "Noordwijk", gemeente: "Noordwijk", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },
  { naam: "Strandpaviljoen Van Roon", locatie: "Koningin Wilhelminablvd. 105, Afrit 14, Noordwijk", badplaats: "Noordwijk", gemeente: "Noordwijk", provincie: "Zuid-Holland", website: "https://strandjvanroon.nl", typeExploitatie: "Strandpaviljoen" },
  { naam: "Salt Seafood Restaurant", locatie: "Koningin Astrid Boulevard, Noordwijk", badplaats: "Noordwijk", gemeente: "Noordwijk", provincie: "Zuid-Holland", typeExploitatie: "Restaurant / Strandpaviljoen" },
  { naam: "Nederzandt", locatie: "Koningin Astrid Boulevard, Noordwijk", badplaats: "Noordwijk", gemeente: "Noordwijk", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },
  { naam: "De Koele Costa", locatie: "Noord Strand, Noordwijk", badplaats: "Noordwijk", gemeente: "Noordwijk", provincie: "Zuid-Holland", typeExploitatie: "Strandpaviljoen" },

  // ========== KATWIJK ==========
  { naam: "Strandpaviljoen De Watering", locatie: "Boulevard Zeezijde 3, Katwijk", badplaats: "Katwijk", gemeente: "Katwijk", provincie: "Zuid-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Surf en Beach", locatie: "Boulevard Zeezijde 9, Katwijk", badplaats: "Katwijk", gemeente: "Katwijk", provincie: "Zuid-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Beachhouse Key West", locatie: "Boulevard Zeezijde 11, Katwijk", badplaats: "Katwijk", gemeente: "Katwijk", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },
  { naam: "Strandpaviljoen 't Centrum", locatie: "Boulevard Zeezijde 17, Katwijk", badplaats: "Katwijk", gemeente: "Katwijk", provincie: "Zuid-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Zee en Zon", locatie: "Boulevard Zeezijde 19, Katwijk", badplaats: "Katwijk", gemeente: "Katwijk", provincie: "Zuid-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Beachclub Zomers", locatie: "Boulevard Zeezijde 21, Katwijk", badplaats: "Katwijk", gemeente: "Katwijk", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },
  { naam: "Restaurant aan Zee Het Strand", locatie: "Boulevard Zeezijde 23, Katwijk", badplaats: "Katwijk", gemeente: "Katwijk", provincie: "Zuid-Holland", typeExploitatie: "Restaurant / Strandpaviljoen" },
  { naam: "Zand Katwijk", locatie: "Boulevard Zeezijde 35, Katwijk", badplaats: "Katwijk", gemeente: "Katwijk", provincie: "Zuid-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Strandpaviljoen Zilt", locatie: "Boulevard Zeezijde 37, Katwijk", badplaats: "Katwijk", gemeente: "Katwijk", provincie: "Zuid-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Strandpaviljoen Westpunt", locatie: "Boulevard Zeezijde 41, Katwijk", badplaats: "Katwijk", gemeente: "Katwijk", provincie: "Zuid-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Beachclub Wantveld", locatie: "Strandvak 22, Noordduinseweg 6, Katwijk", badplaats: "Katwijk", gemeente: "Katwijk", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },

  // ========== BLOEMENDAAL ==========
  { naam: "Woodstock 69", locatie: "Zeeweg, Bloemendaal aan Zee", badplaats: "Bloemendaal aan Zee", gemeente: "Bloemendaal", provincie: "Noord-Holland", website: "https://www.woodstock69.nl", typeExploitatie: "Beach Club" },
  { naam: "San Blas", locatie: "Zeeweg, Bloemendaal aan Zee", badplaats: "Bloemendaal aan Zee", gemeente: "Bloemendaal", provincie: "Noord-Holland", typeExploitatie: "Beach Club" },
  { naam: "Parnassia aan Zee", locatie: "Zeeweg, Bloemendaal aan Zee", badplaats: "Bloemendaal aan Zee", gemeente: "Bloemendaal", provincie: "Noord-Holland", website: "https://www.parnassiaaanzee.nl", typeExploitatie: "Strandpaviljoen" },
  { naam: "Manii", locatie: "Zeeweg, Bloemendaal aan Zee", badplaats: "Bloemendaal aan Zee", gemeente: "Bloemendaal", provincie: "Noord-Holland", typeExploitatie: "Beach Club" },

  // ========== IJMUIDEN ==========
  { naam: "Zeezicht IJmuiden", locatie: "Strand IJmuiden aan Zee", badplaats: "IJmuiden", gemeente: "Velsen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Zilt aan Zee", locatie: "Strand IJmuiden aan Zee", badplaats: "IJmuiden", gemeente: "Velsen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Noordzee IJmuiden", locatie: "Strand IJmuiden aan Zee", badplaats: "IJmuiden", gemeente: "Velsen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Zuidpier", locatie: "Strand IJmuiden aan Zee", badplaats: "IJmuiden", gemeente: "Velsen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Makai Beach", locatie: "Strand IJmuiden aan Zee", badplaats: "IJmuiden", gemeente: "Velsen", provincie: "Noord-Holland", typeExploitatie: "Beach Club" },
  { naam: "Beach Inn", locatie: "IJmuiderslag", badplaats: "IJmuiden", gemeente: "Velsen", provincie: "Noord-Holland", typeExploitatie: "Beach Club" },
  { naam: "Timbuktu", locatie: "Strand Noordpier, IJmuiden", badplaats: "IJmuiden", gemeente: "Velsen", provincie: "Noord-Holland", typeExploitatie: "Beach Club" },

  // ========== BERGEN AAN ZEE ==========
  { naam: "Hemingway's Beach Restaurant", locatie: "Strand Bergen aan Zee", badplaats: "Bergen aan Zee", gemeente: "Bergen", provincie: "Noord-Holland", typeExploitatie: "Restaurant / Beach Club" },
  { naam: "Strandpaviljoen Noorderlicht", locatie: "Strand Bergen aan Zee", badplaats: "Bergen aan Zee", gemeente: "Bergen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Strandpaviljoen Blonde", locatie: "Strand Bergen aan Zee", badplaats: "Bergen aan Zee", gemeente: "Bergen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Bada Bing", locatie: "Strand Bergen aan Zee", badplaats: "Bergen aan Zee", gemeente: "Bergen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Bossa Nova Beach", locatie: "Strand Bergen aan Zee", badplaats: "Bergen aan Zee", gemeente: "Bergen", provincie: "Noord-Holland", typeExploitatie: "Beach Club" },
  { naam: "Soul Beach", locatie: "Strand Bergen aan Zee", badplaats: "Bergen aan Zee", gemeente: "Bergen", provincie: "Noord-Holland", typeExploitatie: "Beach Club" },
  { naam: "De Jongens", locatie: "Strand Bergen aan Zee", badplaats: "Bergen aan Zee", gemeente: "Bergen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },

  // ========== EGMOND AAN ZEE ==========
  { naam: "De Zilvermeeuw", locatie: "Strand Egmond aan Zee", badplaats: "Egmond aan Zee", gemeente: "Bergen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Strandpaviljoen Nautilus", locatie: "Strand Egmond aan Zee", badplaats: "Egmond aan Zee", gemeente: "Bergen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Beachrestaurant 't Zeepaardje", locatie: "Strand Egmond aan Zee", badplaats: "Egmond aan Zee", gemeente: "Bergen", provincie: "Noord-Holland", typeExploitatie: "Restaurant / Strandpaviljoen" },
  { naam: "Bad Egmond", locatie: "Strand Egmond aan Zee", badplaats: "Egmond aan Zee", gemeente: "Bergen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "De Uitkijk", locatie: "Strand Egmond aan Zee", badplaats: "Egmond aan Zee", gemeente: "Bergen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Evi Beach", locatie: "Strand Egmond aan Zee", badplaats: "Egmond aan Zee", gemeente: "Bergen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "'t Zilverzand", locatie: "Strand Egmond aan Zee", badplaats: "Egmond aan Zee", gemeente: "Bergen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "De Zeester Bad Noord", locatie: "Strand Egmond aan Zee", badplaats: "Egmond aan Zee", gemeente: "Bergen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },

  // ========== TEXEL ==========
  { naam: "Strandpaal 21", locatie: "Paal 21, De Koog, Texel", badplaats: "Texel", gemeente: "Texel", provincie: "Noord-Holland", website: "https://www.strandpaal21.nl", typeExploitatie: "Strandpaviljoen" },
  { naam: "Paal 28", locatie: "Paal 28, De Cocksdorp, Texel", badplaats: "Texel", gemeente: "Texel", provincie: "Noord-Holland", website: "https://www.paal28.nl", typeExploitatie: "Strandpaviljoen" },
  { naam: "Kaap Noord", locatie: "De Cocksdorp, Texel", badplaats: "Texel", gemeente: "Texel", provincie: "Noord-Holland", website: "https://www.strandpaviljoenkaapnoord.nl", typeExploitatie: "Strandpaviljoen" },
  { naam: "Paal 9", locatie: "Paal 9, Den Hoorn, Texel", badplaats: "Texel", gemeente: "Texel", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },

  // ========== CALLANTSOOG ==========
  { naam: "De Strandtent Callantsoog", locatie: "Kiefteglop 2, Callantsoog", badplaats: "Callantsoog", gemeente: "Schagen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Strandpaviljoen De Stern", locatie: "Strand Callantsoog", badplaats: "Callantsoog", gemeente: "Schagen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Strandrestaurant Woest", locatie: "Strand Callantsoog", badplaats: "Callantsoog", gemeente: "Schagen", provincie: "Noord-Holland", typeExploitatie: "Restaurant / Strandpaviljoen" },
  { naam: "Strandpaviljoen Vos", locatie: "Strand Callantsoog", badplaats: "Callantsoog", gemeente: "Schagen", provincie: "Noord-Holland", typeExploitatie: "Strandpaviljoen" },

  // ========== HOEK VAN HOLLAND ==========
  { naam: "Dechi Beach", locatie: "Promenade, Hoek van Holland", badplaats: "Hoek van Holland", gemeente: "Rotterdam", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },
  { naam: "The Bing", locatie: "Strand Hoek van Holland", badplaats: "Hoek van Holland", gemeente: "Rotterdam", provincie: "Zuid-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Strandpaviljoen Zeebad", locatie: "Strand Hoek van Holland", badplaats: "Hoek van Holland", gemeente: "Rotterdam", provincie: "Zuid-Holland", website: "https://www.strandpaviljoenzeebad.nl", typeExploitatie: "Strandpaviljoen" },

  // ========== WASSENAAR ==========
  { naam: "Beachclub BAIT", locatie: "Strand Wassenaar", badplaats: "Wassenaar", gemeente: "Wassenaar", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },

  // ========== DOMBURG ==========
  { naam: "De Oase", locatie: "Westerstrand, Domburg", badplaats: "Domburg", gemeente: "Veere", provincie: "Zeeland", typeExploitatie: "Strandpaviljoen" },
  { naam: "TXIKI", locatie: "Strand Domburg", badplaats: "Domburg", gemeente: "Veere", provincie: "Zeeland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Noordduine", locatie: "Strand tussen Domburg en Westkapelle", badplaats: "Domburg", gemeente: "Veere", provincie: "Zeeland", website: "https://www.noordduine.com", typeExploitatie: "Strandpaviljoen" },
  { naam: "Brooklyn Beach", locatie: "Strand Domburg richting Westkapelle", badplaats: "Domburg", gemeente: "Veere", provincie: "Zeeland", typeExploitatie: "Beach Club" },
  { naam: "Beachclub Oaxaca", locatie: "Strand Domburg", badplaats: "Domburg", gemeente: "Veere", provincie: "Zeeland", typeExploitatie: "Beach Club" },

  // ========== VLISSINGEN ==========
  { naam: "Zandpaviljoen Pier 7", locatie: "Boulevard, Vlissingen", badplaats: "Vlissingen", gemeente: "Vlissingen", provincie: "Zeeland", typeExploitatie: "Strandpaviljoen" },

  // ========== ZOUTELANDE ==========
  { naam: "Strandpaviljoen De Branding", locatie: "Strand Zoutelande", badplaats: "Zoutelande", gemeente: "Veere", provincie: "Zeeland", typeExploitatie: "Strandpaviljoen" },

  // ========== RENESSE ==========
  { naam: "Zuid Zuid West", locatie: "Strand Renesse", badplaats: "Renesse", gemeente: "Schouwen-Duiveland", provincie: "Zeeland", typeExploitatie: "Strandpaviljoen" },
  { naam: "De Haven van Renesse", locatie: "Strand Renesse", badplaats: "Renesse", gemeente: "Schouwen-Duiveland", provincie: "Zeeland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Perry's", locatie: "Strand Renesse", badplaats: "Renesse", gemeente: "Schouwen-Duiveland", provincie: "Zeeland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Strandclub Horizon", locatie: "Strand Renesse Oost 3, Renesse", badplaats: "Renesse", gemeente: "Schouwen-Duiveland", provincie: "Zeeland", website: "https://www.strandclubhorizon.nl", typeExploitatie: "Beach Club" },

  // ========== BURGH-HAAMSTEDE ==========
  { naam: "Sand and Pepper", locatie: "Strand Burgh-Haamstede", badplaats: "Burgh-Haamstede", gemeente: "Schouwen-Duiveland", provincie: "Zeeland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Corazon", locatie: "Strand Noordwelle", badplaats: "Burgh-Haamstede", gemeente: "Schouwen-Duiveland", provincie: "Zeeland", typeExploitatie: "Strandpaviljoen" },

  // ========== OUDDORP ==========
  { naam: "Natural High", locatie: "Strand Ouddorp aan Zee", badplaats: "Ouddorp", gemeente: "Goeree-Overflakkee", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },
  { naam: "Paal 10", locatie: "Westerduinpad, Ouddorp", badplaats: "Ouddorp", gemeente: "Goeree-Overflakkee", provincie: "Zuid-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "'t Gorsje", locatie: "Brouwersdam, Ouddorp", badplaats: "Ouddorp", gemeente: "Goeree-Overflakkee", provincie: "Zuid-Holland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Brouw", locatie: "Brouwersdam, Ouddorp", badplaats: "Ouddorp", gemeente: "Goeree-Overflakkee", provincie: "Zuid-Holland", typeExploitatie: "Beach Club" },

  // ========== CADZAND ==========
  { naam: "De Piraat", locatie: "Duinplein, Cadzand-Bad", badplaats: "Cadzand", gemeente: "Sluis", provincie: "Zeeland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Brut sur Mer", locatie: "Strand Cadzand-Bad", badplaats: "Cadzand", gemeente: "Sluis", provincie: "Zeeland", typeExploitatie: "Beach Club" },
  { naam: "De Strandloper", locatie: "Jachthaven, Cadzand-Bad", badplaats: "Cadzand", gemeente: "Sluis", provincie: "Zeeland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Moio Beach", locatie: "Vlamingpolder, Cadzand-Bad", badplaats: "Cadzand", gemeente: "Sluis", provincie: "Zeeland", typeExploitatie: "Beach Club" },
  { naam: "Strand Ruig", locatie: "Strand Cadzand-Bad", badplaats: "Cadzand", gemeente: "Sluis", provincie: "Zeeland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Dok 14", locatie: "Strand Cadzand, nabij radartoren", badplaats: "Cadzand", gemeente: "Sluis", provincie: "Zeeland", typeExploitatie: "Strandpaviljoen" },

  // ========== BRESKENS ==========
  { naam: "Strand Loods Tien", locatie: "Strand Breskens", badplaats: "Breskens", gemeente: "Sluis", provincie: "Zeeland", typeExploitatie: "Strandpaviljoen" },
  { naam: "Beachhouse 25", locatie: "Strand Breskens", badplaats: "Breskens", gemeente: "Sluis", provincie: "Zeeland", typeExploitatie: "Beach Club" },

  // ========== SCHARENDIJKE ==========
  { naam: "Strandclub Zee", locatie: "Strand Scharendijke", badplaats: "Scharendijke", gemeente: "Schouwen-Duiveland", provincie: "Zeeland", typeExploitatie: "Beach Club" },
];

async function main() {
  // Clean all existing data
  await prisma.activity.deleteMany();
  await prisma.communication.deleteMany();
  await prisma.task.deleteMany();
  await prisma.mysteryVisitBijlage.deleteMany();
  await prisma.mysteryVisitScore.deleteMany();
  await prisma.mysteryVisit.deleteMany();
  await prisma.financial.deleteMany();
  await prisma.document.deleteMany();
  await prisma.koperInteresse.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.koper.deleteMany();
  await prisma.paviljoenFoto.deleteMany();
  await prisma.paviljoenContact.deleteMany();
  await prisma.paviljoen.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const passwordHash = await hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@paviljoenpartner.nl" },
    update: {},
    create: {
      email: "admin@paviljoenpartner.nl",
      name: "Admin Paviljoen Partner",
      passwordHash,
      role: "admin",
    },
  });

  // Create all paviljoens
  for (const p of paviljoens) {
    await prisma.paviljoen.create({
      data: {
        naam: p.naam,
        locatie: p.locatie,
        badplaats: p.badplaats,
        gemeente: p.gemeente,
        provincie: p.provincie,
        website: p.website || null,
        telefoon: p.telefoon || null,
        typeExploitatie: p.typeExploitatie || null,
        status: p.status || "actief",
      },
    });
  }

  const count = await prisma.paviljoen.count();
  console.log(`Seed completed! ${count} strandpaviljoens aangemaakt.`);
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
