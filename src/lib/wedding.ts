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
  dateLong: "Monday, December 21st, 2026",
  dateShort: "December 21, 2026",
  dateSpelledA: "December Twenty-One",
  dateSpelledB: "Two Thousand Twenty Six",
  ceremonyTime: "10:00 AM",

  venue: "Guarda do Embaú",
  city: "Palhoça",
  state: "Santa Catarina",
  country: "Brazil",
  address: "Guarda do Embaú, Palhoça — Santa Catarina, Brazil",
  locationLine: "Guarda do Embaú • Palhoça, Santa Catarina",
} as const;
