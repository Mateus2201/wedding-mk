// Single source of truth for the couple's details.
// Every section of the site reads from here so a detail change happens once.

export const wedding = {
  partnerOne: "Katyelly",
  partnerTwo: "Mateus",
  monogram: "K & M",
  initialOne: "K",
  initialTwo: "M",

  // Ceremony start — also drives the countdown timer.
  dateISO: "2026-12-21T10:00:00",
  dateLong: "segunda-feira, 21 de dezembro de 2026",
  dateShort: "21 de dezembro de 2026",
  dateSpelledA: "21 de dezembro",
  dateSpelledB: "2026",
  ceremonyTime: "16:00",
  lunchTime: "18:00",
  dressCode: "Casual",

  // Guests' response deadline — set to null to hide the date from the page.
  rsvpDeadline: "6 de dezembro de 2026" as string | null,

  venue: "Pousada Dunas da Guarda",
  city: "Guarda do Embaú, Palhoça",
  state: "Santa Catarina",
  country: "Brasil",
  address: "Guarda do Embaú, Palhoça — Santa Catarina, Brasil",
  locationLine: "Guarda do Embaú • Palhoça, Santa Catarina",

  // Official wedding palette, shown in this exact order.
  palette: [
    { name: "Off-white", hex: "#F5F0E7", use: "Tecidos, papelaria e decoração" },
    { name: "Areia", hex: "#D9C9B5", use: "Tecidos, papelaria e decoração" },
    { name: "Bege natural", hex: "#C6B49D", use: "Traje e detalhes" },
    { name: "Verde oliva", hex: "#68735B", use: "Traje e detalhes" },
    { name: "Verde sálvia", hex: "#A3AA91", use: "Detalhes delicados" },
  ],
} as const;
