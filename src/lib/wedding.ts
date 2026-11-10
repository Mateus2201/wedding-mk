// Single source of truth for the couple's details.
// Every section of the site reads from here so a detail change happens once.

export const wedding = {
  partnerOne: "Mateus",
  partnerTwo: "Katyelly",
  monogram: "M & K",
  initialOne: "M",
  initialTwo: "K",

  // Ceremony start — also drives the countdown timer.
  dateISO: "2026-12-21T10:00:00",
  dateLong: "segunda-feira, 21 de dezembro de 2026",
  dateShort: "21 de dezembro de 2026",
  dateSpelledA: "Vinte e Um de Dezembro",
  dateSpelledB: "Dois Mil e Vinte e Seis",
  ceremonyTime: "10:00",
  lunchTime: "11:30",
  dressCode: "Casual",

  // Guests' response deadline — null until the couple sets it.
  rsvpDeadline: null as string | null,

  venue: "Guarda do Embaú",
  city: "Palhoça",
  state: "Santa Catarina",
  country: "Brasil",
  address: "Guarda do Embaú, Palhoça — Santa Catarina, Brasil",
  locationLine: "Guarda do Embaú • Palhoça, Santa Catarina",
} as const;
