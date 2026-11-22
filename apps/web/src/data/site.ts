import type { RouteKey } from "../i18n/ui";

export const hotel = {
  name: "Hotel Miranda",
  phone: "+34 971 000 000",
  email: "reservas@hotelmiranda.test",
  address: "Paseo del Mar, 12",
  city: "Palma de Mallorca",
  country: "España",
  postalCode: "07001",
  latitude: 39.5696,
  longitude: 2.6502,
  checkIn: "15:00",
  checkOut: "12:00",
} as const;

export const navItems: RouteKey[] = ["home", "rooms", "offers", "about", "contact"];

export const stats = [
  { value: "4", labelEs: "habitaciones", labelEn: "rooms" },
  { value: "37", labelEs: "años de historia", labelEn: "years of history" },
  { value: "4,9", labelEs: "valoración media", labelEn: "average rating" },
  { value: "12", labelEs: "huéspedes máximo", labelEn: "guests maximum" },
] as const;

export const experiences = [
  {
    key: "spa",
    icon: "spa",
    titleEs: "Spa de autor",
    titleEn: "Signature spa",
    textEs: "Masajes, baño de vapor y rituales con aceites de la isla.",
    textEn: "Massages, steam room and rituals with island oils.",
  },
  {
    key: "dining",
    icon: "dining",
    titleEs: "Mesa honesta",
    titleEn: "Honest table",
    textEs: "Desayunos de mercado, comida mediterránea y vinos pequeños.",
    textEn: "Market breakfasts, Mediterranean food and small wines.",
  },
  {
    key: "pool",
    icon: "pool",
    titleEs: "Piscina tranquila",
    titleEn: "Quiet pool",
    textEs: "Agua salada, sombra natural y vistas al jardín.",
    textEn: "Salt water, natural shade and garden views.",
  },
  {
    key: "concierge",
    icon: "concierge",
    titleEs: "Concierge local",
    titleEn: "Local concierge",
    textEs: "Rutas, calas, reservas y planes que no salen en las guías.",
    textEn: "Routes, coves, bookings and plans you will not find in guides.",
  },
] as const;

export const gallery = [
  {
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    altEs: "Terraza del hotel frente al mar",
    altEn: "Hotel terrace facing the sea",
  },
  {
    url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    altEs: "Piscina exterior entre palmeras",
    altEn: "Outdoor pool among palm trees",
  },
  {
    url: "https://images.unsplash.com/photo-1540541338287-41700207dee6",
    altEs: "Desayuno mediterráneo en la terraza",
    altEn: "Mediterranean breakfast on the terrace",
  },
  {
    url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874",
    altEs: "Sala de spa con luz cálida",
    altEn: "Spa room with warm light",
  },
  {
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    altEs: "Suite con cama grande y vistas",
    altEn: "Suite with a large bed and views",
  },
  {
    url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    altEs: "Detalle de arquitectura mediterránea",
    altEn: "Mediterranean architecture detail",
  },
] as const;

export const testimonials = [
  {
    quoteEs:
      "Llegamos cansados y nos fuimos con la sensación de haber estado una semana. La terraza, el desayuno y el silencio no tienen precio.",
    quoteEn:
      "We arrived tired and left feeling like we had been there a week. The terrace, the breakfast and the silence are priceless.",
    name: "Clara & Mateo",
    originEs: "Madrid",
    originEn: "Madrid",
  },
  {
    quoteEs:
      "El equipo nos recomendó calas que no aparecían en ninguna guía. Ese tipo de detalles es lo que hace volver.",
    quoteEn:
      "The team recommended coves that were not in any guide. That kind of detail is what makes you come back.",
    name: "Sophie Laurent",
    originEs: "París",
    originEn: "Paris",
  },
  {
    quoteEs:
      "Un hotel pequeño con alma. La suite es enorme, la luz es increíble y el desayuno es de los mejores que recuerdo.",
    quoteEn:
      "A small hotel with soul. The suite is huge, the light is incredible and the breakfast is one of the best I remember.",
    name: "James & Priya",
    originEs: "Londres",
    originEn: "London",
  },
] as const;

export type Testimonial = (typeof testimonials)[number];

export const offers = [
  {
    slug: "escapada-otono",
    discountPct: 15,
    validUntil: "2026-12-20",
    titleEs: "Escapada de otoño",
    titleEn: "Autumn escape",
    textEs: "Tres noches con desayuno, late check-out y una botella de vino local.",
    textEn: "Three nights with breakfast, late check-out and a bottle of local wine.",
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c",
  },
  {
    slug: "suite-experience",
    discountPct: 20,
    validUntil: "2027-03-31",
    titleEs: "Experiencia Suite",
    titleEn: "Suite experience",
    textEs: "Dos noches en suite con cava de bienvenida, spa y desayuno en la terraza.",
    textEn: "Two nights in a suite with welcome cava, spa and breakfast on the terrace.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  },
] as const;

export type Offer = (typeof offers)[number];

export function imageUrl(base: string, width: number): string {
  return `${base}?auto=format&fit=crop&w=${width}&q=80`;
}
