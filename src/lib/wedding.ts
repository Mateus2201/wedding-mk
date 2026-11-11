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

  // Guests' response deadline — set to null to hide the date from the page.
  rsvpDeadline: "6 de dezembro de 2026" as string | null,

  venue: "Guarda do Embaú",
  city: "Palhoça",
  state: "Santa Catarina",
  country: "Brasil",
  address: "Guarda do Embaú, Palhoça — Santa Catarina, Brasil",
  locationLine: "Guarda do Embaú • Palhoça, Santa Catarina",

  // Official wedding palette, shown in this exact order.
  palette: [
    { name: "Off-white", hex: "#F5F0E7", use: "Tecidos, papelaria e decoração" },
    { name: "Branco puro", hex: "#FFFFFF", use: "Flores e vestido da noiva" },
    { name: "Areia", hex: "#D9C9B5", use: "Vestidos e tecidos" },
    { name: "Bege natural", hex: "#C6B49D", use: "Traje e detalhes" },
    { name: "Taupe", hex: "#81745F", use: "Elementos rústicos e madeira" },
    { name: "Verde oliva", hex: "#68735B", use: "Folhagens e identidade floral" },
    { name: "Verde sálvia", hex: "#A3AA91", use: "Detalhes delicados" },
  ],
} as const;
