export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

const es = {
  nav: {
    home: "Inicio",
    rooms: "Habitaciones",
    offers: "Ofertas",
    about: "Sobre nosotros",
    contact: "Contacto",
    book: "Reservar",
    menu: "Abrir menú",
    language: "English",
  },
  common: {
    from: "Desde",
    night: "noche",
    nights: "noches",
    perNight: "/ noche",
    viewRoom: "Ver habitación",
    viewAllRooms: "Ver todas las habitaciones",
    bookNow: "Reservar ahora",
    discover: "Descubrir",
    seeOffers: "Ver ofertas",
    readMore: "Leer más",
    contactUs: "Contactar",
    checkIn: "Llegada",
    checkOut: "Salida",
    guests: "Huéspedes",
    searchAvailability: "Comprobar disponibilidad",
    send: "Enviar",
    name: "Nombre",
    email: "Email",
    phone: "Teléfono",
    message: "Mensaje",
    subject: "Asunto",
    address: "Dirección",
    followUs: "Síguenos",
    newsletter: "Newsletter",
    newsletterPlaceholder: "Tu email",
    subscribe: "Suscribirme",
    rights: "Todos los derechos reservados.",
    privacy: "Privacidad",
    terms: "Términos",
    backHome: "Volver al inicio",
    breadcrumbHome: "Inicio",
    skipToContent: "Saltar al contenido",
  },
  home: {
    heroPretitle: "Costa Mediterránea · Desde 1987",
    heroTitle: "Tu refugio mediterráneo, sin prisa.",
    heroLead:
      "Habitaciones con luz de sal, desayunos lentos y una terraza frente al mar. Un hotel pequeño para desconectar de verdad.",
    heroCtaRooms: "Descubrir habitaciones",
    heroCtaOffers: "Ver ofertas",
    searchTitle: "Encuentra tus fechas",
    aboutPretitle: "Sobre nosotros",
    aboutTitle: "Un hotel con alma, luz y mar.",
    aboutLead:
      "Hotel Miranda nació de una casa de pescadores y de la idea de que el lujo también puede ser sencillo: una cama buena, un desayuno honesto y el mar al fondo.",
    aboutBody:
      "Hemos cuidado cada rincón para que el tiempo pase despacio. Materiales naturales, artesanía local y una terraza que mira al Mediterráneo. Sin ruido, sin prisas, sin artificios.",
    aboutCta: "Conoce nuestra historia",
    roomsPretitle: "Habitaciones",
    roomsTitle: "Elige tu forma de descansar.",
    roomsLead:
      "Cuatro habitaciones, cuatro maneras de estar cerca del mar. Todas con luz natural, ropa de cama de algodón y amenities de autor.",
    experiencesPretitle: "Experiencias",
    experiencesTitle: "Todo lo que necesitas para desconectar.",
    experiencesLead:
      "Un pequeño spa, una mesa honesta, una piscina tranquila y un equipo que conoce la isla como su casa.",
    offersPretitle: "Ofertas",
    offersTitle: "Escapadas con tiempo.",
    offersLead:
      "Estancias pensadas para alargar el fin de semana, celebrar algo o simplemente no tener plan.",
    galleryPretitle: "Galería",
    galleryTitle: "Un paseo por la casa.",
    testimonialsPretitle: "Testimonios",
    testimonialsTitle: "Lo que se llevan nuestros huéspedes.",
    ctaTitle: "Reserva tu escapada.",
    ctaLead:
      "Cuéntanos cuándo quieres venir y preparamos la habitación, el desayuno y las mejores recomendaciones de la isla.",
    ctaButton: "Empezar una reserva",
  },
  rooms: {
    heroPretitle: "Habitaciones",
    heroTitle: "Cuatro formas de mirar al mar.",
    heroLead:
      "Desde una habitación individual para una escapada corta hasta una suite con terraza privada. Todas con desayuno incluido.",
    listTitle: "Elige tu habitación",
    intro:
      "Selecciona tus fechas y huéspedes para ver disponibilidad. Si necesitas algo especial, escríbenos y lo preparamos.",
    capacity: "Capacidad",
    size: "Superficie",
    amenities: "Amenities",
    cancellation: "Cancelación",
    bookingTitle: "Reserva esta habitación",
    bookingLead:
      "Déjanos tus datos y te confirmamos disponibilidad y precio final en menos de 24 horas.",
    related: "También te puede gustar",
    notFound: "No encontramos esa habitación.",
    arrival: "Llegada",
    departure: "Salida",
    guests: "Huéspedes",
    checkAvailability: "Consultar disponibilidad",
    perNight: "/ noche",
    from: "Desde",
    discount: "Descuento",
  },
  about: {
    pretitle: "Sobre nosotros",
    title: "Una casa frente al mar.",
    lead: "Hotel Miranda es un proyecto familiar que empezó con una casa de pescadores y una obsesión: que dormir bien sea el mejor recuerdo de un viaje.",
    storyTitle: "Nuestra historia",
    storyHeading: "Empezó con una casa de pescadores.",
    story:
      "En 1987 compramos una casa de pescadores en la costa y la convertimos en un pequeño hotel de cinco habitaciones. Desde entonces hemos crecido despacio, sin perder la escala: cuatro habitaciones, un patio, una terraza y un equipo que lleva años haciendo lo mismo con cariño.",
    valuesTitle: "Lo que nos importa",
    value1Title: "Menos, mejor",
    value1:
      "Pocas habitaciones, espacios amplios y materiales nobles. Preferimos hacer pocas cosas bien a llenar la casa de cosas.",
    value2Title: "Producto local",
    value2:
      "Desayunos con pan de masa madre, aceite de la isla, fruta de temporada y café de tueste lento.",
    value3Title: "Tiempo de verdad",
    value3:
      "Sin horarios imposibles ni ruido. Late check-out, terrazas tranquilas y un equipo que no tiene prisa.",
    galleryTitle: "La casa, en imágenes",
  },
  offers: {
    pretitle: "Ofertas",
    title: "Escapadas que merecen la pena.",
    lead: "Estancias con desayuno, late check-out y pequeños extras para que solo tengas que decidir cuándo venir.",
    ctaTitle: "¿Tienes algo en mente?",
    ctaLead:
      "Cuéntanos la ocasión y preparamos una propuesta a medida: aniversarios, escapadas en pareja, viajes en familia o grupos pequeños.",
    ctaButton: "Hablemos",
    validUntil: "Válida hasta",
  },
  contact: {
    pretitle: "Contacto",
    title: "Estamos al otro lado.",
    lead: "Escríbenos para reservas, dudas o recomendaciones. Respondemos en menos de 24 horas laborables.",
    formTitle: "Cuéntanos qué necesitas",
    formNote:
      "Este formulario está preparado para conectarse al API de reservas en la siguiente fase. Mientras tanto, puedes escribirnos directamente.",
    phoneTitle: "Teléfono",
    emailTitle: "Email",
    addressTitle: "Dirección",
    reception: "Recepción",
    receptionHours: "Todos los días, 8:00 – 22:00",
  },
  footer: {
    tagline:
      "Un hotel pequeño frente al Mediterráneo. Habitaciones con luz, desayunos lentos y una terraza para no hacer nada.",
    explore: "Explorar",
    services: "Servicios",
    contact: "Contacto",
    service1: "Habitaciones",
    service2: "Desayuno",
    service3: "Spa",
    service4: "Piscina",
    service5: "Experiencias",
    newsletterNote: "Ideas para escapadas, ofertas y novedades. Sin spam.",
    legal: "Aviso legal",
    privacy: "Privacidad",
    cookies: "Cookies",
  },
};

export type Dictionary = typeof es;

const en: Dictionary = {
  nav: {
    home: "Home",
    rooms: "Rooms",
    offers: "Offers",
    about: "About",
    contact: "Contact",
    book: "Book",
    menu: "Open menu",
    language: "Español",
  },
  common: {
    from: "From",
    night: "night",
    nights: "nights",
    perNight: "/ night",
    viewRoom: "View room",
    viewAllRooms: "View all rooms",
    bookNow: "Book now",
    discover: "Discover",
    seeOffers: "View offers",
    readMore: "Read more",
    contactUs: "Contact us",
    checkIn: "Arrival",
    checkOut: "Departure",
    guests: "Guests",
    searchAvailability: "Check availability",
    send: "Send",
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    subject: "Subject",
    address: "Address",
    followUs: "Follow us",
    newsletter: "Newsletter",
    newsletterPlaceholder: "Your email",
    subscribe: "Subscribe",
    rights: "All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
    backHome: "Back home",
    breadcrumbHome: "Home",
    skipToContent: "Skip to content",
  },
  home: {
    heroPretitle: "Mediterranean coast · Since 1987",
    heroTitle: "Your Mediterranean retreat, unhurried.",
    heroLead:
      "Rooms filled with sea light, slow breakfasts and a terrace facing the water. A small hotel to truly switch off.",
    heroCtaRooms: "Discover rooms",
    heroCtaOffers: "View offers",
    searchTitle: "Find your dates",
    aboutPretitle: "About us",
    aboutTitle: "A hotel with soul, light and sea.",
    aboutLead:
      "Hotel Miranda began as a fisherman's house and the belief that luxury can be simple: a good bed, an honest breakfast and the sea in the distance.",
    aboutBody:
      "Every corner has been considered so time slows down. Natural materials, local craft and a terrace facing the Mediterranean. No noise, no rush, no fuss.",
    aboutCta: "Read our story",
    roomsPretitle: "Rooms",
    roomsTitle: "Choose your way to rest.",
    roomsLead:
      "Four rooms, four ways to stay close to the sea. All with natural light, cotton linens and thoughtful amenities.",
    experiencesPretitle: "Experiences",
    experiencesTitle: "Everything you need to switch off.",
    experiencesLead:
      "A small spa, an honest table, a quiet pool and a team that knows the island like home.",
    offersPretitle: "Offers",
    offersTitle: "Escapes with time.",
    offersLead:
      "Stays designed to stretch the weekend, celebrate something or simply have no plan at all.",
    galleryPretitle: "Gallery",
    galleryTitle: "A walk through the house.",
    testimonialsPretitle: "Testimonials",
    testimonialsTitle: "What our guests take home.",
    ctaTitle: "Book your escape.",
    ctaLead:
      "Tell us when you want to come and we will prepare the room, breakfast and the best recommendations on the island.",
    ctaButton: "Start a booking",
  },
  rooms: {
    heroPretitle: "Rooms",
    heroTitle: "Four ways to look at the sea.",
    heroLead:
      "From a single room for a short escape to a suite with a private terrace. All with breakfast included.",
    listTitle: "Choose your room",
    intro:
      "Select your dates and guests to check availability. If you need something special, write to us and we will arrange it.",
    capacity: "Capacity",
    size: "Size",
    amenities: "Amenities",
    cancellation: "Cancellation",
    bookingTitle: "Book this room",
    bookingLead:
      "Leave your details and we will confirm availability and the final price within 24 hours.",
    related: "You may also like",
    notFound: "We could not find that room.",
    arrival: "Arrival",
    departure: "Departure",
    guests: "Guests",
    checkAvailability: "Check availability",
    perNight: "/ night",
    from: "From",
    discount: "Discount",
  },
  about: {
    pretitle: "About us",
    title: "A house facing the sea.",
    lead: "Hotel Miranda is a family project that began with a fisherman's house and one obsession: that sleeping well is the best memory of a trip.",
    storyTitle: "Our story",
    storyHeading: "It began with a fisherman's house.",
    story:
      "In 1987 we bought a fisherman's house on the coast and turned it into a small five-room hotel. We have grown slowly ever since, without losing scale: four rooms, a courtyard, a terrace and a team that has been doing the same thing with care for years.",
    valuesTitle: "What matters to us",
    value1Title: "Less, better",
    value1:
      "Few rooms, generous spaces and honest materials. We would rather do a few things well than fill the house with things.",
    value2Title: "Local produce",
    value2:
      "Breakfasts with sourdough bread, island olive oil, seasonal fruit and slow-roasted coffee.",
    value3Title: "Real time",
    value3:
      "No impossible schedules or noise. Late check-out, quiet terraces and a team with no rush.",
    galleryTitle: "The house, in pictures",
  },
  offers: {
    pretitle: "Offers",
    title: "Escapes worth taking.",
    lead: "Stays with breakfast, late check-out and small extras so all you have to decide is when to come.",
    ctaTitle: "Have something in mind?",
    ctaLead:
      "Tell us the occasion and we will put together a tailored proposal: anniversaries, couples' escapes, family trips or small groups.",
    ctaButton: "Let's talk",
    validUntil: "Valid until",
  },
  contact: {
    pretitle: "Contact",
    title: "We are on the other side.",
    lead: "Write to us for bookings, questions or recommendations. We reply within 24 working hours.",
    formTitle: "Tell us what you need",
    formNote:
      "This form is ready to connect to the booking API in the next phase. In the meantime, you can write to us directly.",
    phoneTitle: "Phone",
    emailTitle: "Email",
    addressTitle: "Address",
    reception: "Reception",
    receptionHours: "Every day, 8:00 – 22:00",
  },
  footer: {
    tagline:
      "A small hotel facing the Mediterranean. Rooms with light, slow breakfasts and a terrace for doing nothing.",
    explore: "Explore",
    services: "Services",
    contact: "Contact",
    service1: "Rooms",
    service2: "Breakfast",
    service3: "Spa",
    service4: "Pool",
    service5: "Experiences",
    newsletterNote: "Escape ideas, offers and news. No spam.",
    legal: "Legal notice",
    privacy: "Privacy",
    cookies: "Cookies",
  },
};

export const ui: Record<Locale, Dictionary> = { es, en };

export function getTranslations(locale: Locale): Dictionary {
  return ui[locale];
}

export const routes = {
  home: { es: "/", en: "/en/" },
  rooms: { es: "/habitaciones", en: "/en/rooms" },
  offers: { es: "/ofertas", en: "/en/offers" },
  about: { es: "/sobre-nosotros", en: "/en/about" },
  contact: { es: "/contacto", en: "/en/contact" },
} as const;

export type RouteKey = keyof typeof routes;

export function routeFor(locale: Locale, key: RouteKey): string {
  return routes[key][locale];
}

export function roomPath(locale: Locale, slug: string): string {
  return locale === "es" ? `/habitaciones/${slug}` : `/en/rooms/${slug}`;
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
}

export function alternatePath(pathname: string, locale: Locale): string {
  const currentLocale = locale;
  const other = alternateLocale(currentLocale);

  if (pathname === "/" || pathname === "/en" || pathname === "/en/") {
    return routes.home[other];
  }

  if (currentLocale === "es" && pathname.startsWith("/habitaciones/")) {
    return `/en/rooms/${pathname.replace("/habitaciones/", "")}`;
  }

  if (currentLocale === "en" && pathname.startsWith("/en/rooms/")) {
    return `/habitaciones/${pathname.replace("/en/rooms/", "")}`;
  }

  for (const key of Object.keys(routes) as RouteKey[]) {
    if (key === "home") {
      continue;
    }

    if (pathname.startsWith(routes[key][currentLocale])) {
      return routes[key][other];
    }
  }

  return routes.home[other];
}
