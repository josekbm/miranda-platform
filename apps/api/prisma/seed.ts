import "dotenv/config";
import { randomUUID } from "node:crypto";
import { hash } from "@node-rs/argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run the seed.");
}

if (process.env.NODE_ENV === "production" && process.env.SEED_FORCE !== "true") {
  throw new Error("Refusing to reset the database in production. Set SEED_FORCE=true to override.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const ADMIN_ID = "a0000000-0000-4000-8000-000000000001";
const MANAGER_ID = "a0000000-0000-4000-8000-000000000002";
const RECEPTION_ID = "a0000000-0000-4000-8000-000000000003";

const ROOM_SINGLE_ID = "c0000000-0000-4000-8000-000000000001";
const ROOM_DOUBLE_ID = "c0000000-0000-4000-8000-000000000002";
const ROOM_SUPERIOR_ID = "c0000000-0000-4000-8000-000000000003";
const ROOM_SUITE_ID = "c0000000-0000-4000-8000-000000000004";

const AMENITY_IDS = {
  wifi: "d0000000-0000-4000-8000-000000000001",
  tv: "d0000000-0000-4000-8000-000000000002",
  ac: "d0000000-0000-4000-8000-000000000003",
  minibar: "d0000000-0000-4000-8000-000000000004",
  safe: "d0000000-0000-4000-8000-000000000005",
  bathtub: "d0000000-0000-4000-8000-000000000006",
  kitchen: "d0000000-0000-4000-8000-000000000007",
  parking: "d0000000-0000-4000-8000-000000000008",
} as const;

async function hashPassword(password: string): Promise<string> {
  return hash(password, {
    memoryCost: 19_456,
    timeCost: 2,
    parallelism: 1,
    outputLen: 32,
  });
}

async function resetDatabase(): Promise<void> {
  await prisma.auditLog.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.roomAmenity.deleteMany();
  await prisma.roomImage.deleteMany();
  await prisma.roomTranslation.deleteMany();
  await prisma.room.deleteMany();
  await prisma.amenityTranslation.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.offerTranslation.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUsers(): Promise<void> {
  const [adminPassword, managerPassword, receptionPassword] = await Promise.all([
    hashPassword("Admin1234!"),
    hashPassword("Manager1234!"),
    hashPassword("Reception1234!"),
  ]);

  await prisma.user.createMany({
    data: [
      {
        id: ADMIN_ID,
        email: "admin@miranda.test",
        passwordHash: adminPassword,
        name: "Miranda Admin",
        phone: "+34 600 000 001",
        role: "ADMIN",
        status: "ACTIVE",
      },
      {
        id: MANAGER_ID,
        email: "manager@miranda.test",
        passwordHash: managerPassword,
        name: "Miranda Manager",
        phone: "+34 600 000 002",
        role: "MANAGER",
        status: "ACTIVE",
      },
      {
        id: RECEPTION_ID,
        email: "reception@miranda.test",
        passwordHash: receptionPassword,
        name: "Miranda Reception",
        phone: "+34 600 000 003",
        role: "RECEPTIONIST",
        status: "ACTIVE",
      },
    ],
  });
}

async function seedAmenities(): Promise<void> {
  const amenities = [
    { id: AMENITY_IDS.wifi, key: "wifi", icon: "wifi", es: "Wi-Fi", en: "Wi-Fi" },
    { id: AMENITY_IDS.tv, key: "tv", icon: "tv", es: "Televisión", en: "TV" },
    {
      id: AMENITY_IDS.ac,
      key: "air-conditioning",
      icon: "air-vent",
      es: "Aire acondicionado",
      en: "Air conditioning",
    },
    { id: AMENITY_IDS.minibar, key: "minibar", icon: "wine", es: "Minibar", en: "Minibar" },
    { id: AMENITY_IDS.safe, key: "safe", icon: "shield", es: "Caja fuerte", en: "Safe" },
    { id: AMENITY_IDS.bathtub, key: "bathtub", icon: "bath", es: "Bañera", en: "Bathtub" },
    { id: AMENITY_IDS.kitchen, key: "kitchen", icon: "chef-hat", es: "Cocina", en: "Kitchen" },
    { id: AMENITY_IDS.parking, key: "parking", icon: "car", es: "Parking", en: "Parking" },
  ];

  for (const amenity of amenities) {
    await prisma.amenity.create({
      data: {
        id: amenity.id,
        key: amenity.key,
        icon: amenity.icon,
        translations: {
          create: [
            { locale: "es", name: amenity.es },
            { locale: "en", name: amenity.en },
          ],
        },
      },
    });
  }
}

async function seedRooms(): Promise<void> {
  const rooms = [
    {
      id: ROOM_SINGLE_ID,
      reference: "R-2026-0001",
      slug: "single-bed-101",
      roomNumber: "101",
      type: "SINGLE" as const,
      priceCents: 8_000,
      discountPct: 0,
      capacity: 1,
      sizeSqm: 18,
      es: {
        name: "Habitación Single 101",
        description: "Habitación luminosa con cama individual y vistas a la ciudad.",
        cancellationPolicy: "Cancelación gratuita hasta 24 horas antes de la llegada.",
      },
      en: {
        name: "Single Room 101",
        description: "Bright room with a single bed and city views.",
        cancellationPolicy: "Free cancellation up to 24 hours before arrival.",
      },
      thumbnail: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200&q=80",
      amenities: [AMENITY_IDS.wifi, AMENITY_IDS.tv, AMENITY_IDS.ac],
    },
    {
      id: ROOM_DOUBLE_ID,
      reference: "R-2026-0002",
      slug: "double-bed-102",
      roomNumber: "102",
      type: "DOUBLE" as const,
      priceCents: 12_000,
      discountPct: 10,
      capacity: 2,
      sizeSqm: 25,
      es: {
        name: "Habitación Doble 102",
        description: "Amplia habitación con cama de matrimonio y balcón.",
        cancellationPolicy: "Cancelación gratuita hasta 48 horas antes de la llegada.",
      },
      en: {
        name: "Double Room 102",
        description: "Spacious room with a double bed and balcony.",
        cancellationPolicy: "Free cancellation up to 48 hours before arrival.",
      },
      thumbnail: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80",
      amenities: [AMENITY_IDS.wifi, AMENITY_IDS.tv, AMENITY_IDS.ac, AMENITY_IDS.safe],
    },
    {
      id: ROOM_SUPERIOR_ID,
      reference: "R-2026-0003",
      slug: "double-superior-201",
      roomNumber: "201",
      type: "DOUBLE_SUPERIOR" as const,
      priceCents: 18_000,
      discountPct: 15,
      capacity: 2,
      sizeSqm: 32,
      es: {
        name: "Doble Superior 201",
        description: "Habitación superior con salón, minibar y vistas al jardín.",
        cancellationPolicy: "Cancelación gratuita hasta 72 horas antes de la llegada.",
      },
      en: {
        name: "Double Superior 201",
        description: "Superior room with a lounge area, minibar and garden views.",
        cancellationPolicy: "Free cancellation up to 72 hours before arrival.",
      },
      thumbnail: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=80",
      amenities: [
        AMENITY_IDS.wifi,
        AMENITY_IDS.tv,
        AMENITY_IDS.ac,
        AMENITY_IDS.minibar,
        AMENITY_IDS.safe,
      ],
    },
    {
      id: ROOM_SUITE_ID,
      reference: "R-2026-0004",
      slug: "suite-301",
      roomNumber: "301",
      type: "SUITE" as const,
      priceCents: 25_000,
      discountPct: 20,
      capacity: 3,
      sizeSqm: 45,
      es: {
        name: "Suite 301",
        description: "Suite con terraza privada, cocina y vistas al mar.",
        cancellationPolicy: "Cancelación gratuita hasta una semana antes de la llegada.",
      },
      en: {
        name: "Suite 301",
        description: "Suite with a private terrace, kitchen and sea views.",
        cancellationPolicy: "Free cancellation up to one week before arrival.",
      },
      thumbnail: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
      amenities: [
        AMENITY_IDS.wifi,
        AMENITY_IDS.tv,
        AMENITY_IDS.ac,
        AMENITY_IDS.minibar,
        AMENITY_IDS.safe,
        AMENITY_IDS.bathtub,
        AMENITY_IDS.kitchen,
        AMENITY_IDS.parking,
      ],
    },
  ];

  for (const room of rooms) {
    await prisma.room.create({
      data: {
        id: room.id,
        reference: room.reference,
        slug: room.slug,
        roomNumber: room.roomNumber,
        type: room.type,
        priceCents: room.priceCents,
        discountPct: room.discountPct,
        capacity: room.capacity,
        sizeSqm: room.sizeSqm,
        isActive: true,
        translations: {
          create: [
            {
              locale: "es",
              name: room.es.name,
              description: room.es.description,
              cancellationPolicy: room.es.cancellationPolicy,
            },
            {
              locale: "en",
              name: room.en.name,
              description: room.en.description,
              cancellationPolicy: room.en.cancellationPolicy,
            },
          ],
        },
        images: {
          create: [
            {
              id: randomUUID(),
              url: room.thumbnail,
              alt: room.es.name,
              width: 1200,
              height: 800,
              sortOrder: 0,
            },
            {
              id: randomUUID(),
              url: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&q=80",
              alt: room.en.name,
              width: 1200,
              height: 800,
              sortOrder: 1,
            },
          ],
        },
        amenities: {
          create: room.amenities.map((amenityId) => ({
            amenity: { connect: { id: amenityId } },
          })),
        },
      },
    });
  }
}

async function seedBookings(): Promise<void> {
  await prisma.booking.createMany({
    data: [
      {
        id: "e0000000-0000-4000-8000-000000000001",
        reference: "B-2026-0001",
        roomId: ROOM_SINGLE_ID,
        guestName: "Ada Lovelace",
        guestEmail: "ada@example.com",
        guestPhone: "+34 600 100 001",
        checkIn: new Date("2026-12-10T00:00:00.000Z"),
        checkOut: new Date("2026-12-12T00:00:00.000Z"),
        status: "PENDING",
        totalCents: 16_000,
        specialRequests: "Llegada tardía, sobre las 22:00.",
        source: "WEBSITE",
      },
      {
        id: "e0000000-0000-4000-8000-000000000002",
        reference: "B-2026-0002",
        roomId: ROOM_DOUBLE_ID,
        guestName: "Alan Turing",
        guestEmail: "alan@example.com",
        guestPhone: "+34 600 100 002",
        checkIn: new Date("2026-12-15T00:00:00.000Z"),
        checkOut: new Date("2026-12-18T00:00:00.000Z"),
        status: "CONFIRMED",
        totalCents: 32_400,
        specialRequests: "Cuna para bebé.",
        source: "PHONE",
      },
      {
        id: "e0000000-0000-4000-8000-000000000003",
        reference: "B-2026-0003",
        roomId: ROOM_SUPERIOR_ID,
        guestName: "Grace Hopper",
        guestEmail: "grace@example.com",
        guestPhone: "+34 600 100 003",
        checkIn: new Date("2026-11-20T00:00:00.000Z"),
        checkOut: new Date("2026-11-23T00:00:00.000Z"),
        status: "CHECKED_IN",
        totalCents: 45_900,
        specialRequests: "Vista al jardín si es posible.",
        source: "ADMIN",
      },
      {
        id: "e0000000-0000-4000-8000-000000000004",
        reference: "B-2026-0004",
        roomId: ROOM_SUITE_ID,
        guestName: "Katherine Johnson",
        guestEmail: "katherine@example.com",
        guestPhone: "+34 600 100 004",
        checkIn: new Date("2026-11-01T00:00:00.000Z"),
        checkOut: new Date("2026-11-04T00:00:00.000Z"),
        status: "CHECKED_OUT",
        totalCents: 60_000,
        specialRequests: "Botella de cava de bienvenida.",
        source: "WEBSITE",
      },
    ],
  });
}

async function seedContacts(): Promise<void> {
  await prisma.contact.createMany({
    data: [
      {
        id: "f0000000-0000-4000-8000-000000000001",
        name: "Lucía Ferrer",
        email: "lucia@example.com",
        phone: "+34 600 200 001",
        subject: "Late check-in",
        message: "Llegaremos sobre las 23:00. ¿Es posible hacer el check-in más tarde?",
        status: "NEW",
        locale: "es",
      },
      {
        id: "f0000000-0000-4000-8000-000000000002",
        name: "James Smith",
        email: "james@example.com",
        phone: "+44 7700 900001",
        subject: "Airport transfer",
        message: "Could you arrange a transfer from the airport for two people?",
        status: "READ",
        locale: "en",
      },
      {
        id: "f0000000-0000-4000-8000-000000000003",
        name: "Marta Ruiz",
        email: "marta@example.com",
        phone: "+34 600 200 003",
        subject: "Group booking",
        message: "We are looking for five rooms for a family reunion in June.",
        status: "ARCHIVED",
        locale: "es",
      },
    ],
  });
}

async function seedOffers(): Promise<void> {
  await prisma.offer.create({
    data: {
      id: "a1000000-0000-4000-8000-000000000001",
      slug: "escapada-otono",
      discountPct: 15,
      startsAt: new Date("2026-10-01T00:00:00.000Z"),
      endsAt: new Date("2026-12-20T00:00:00.000Z"),
      isActive: true,
      translations: {
        create: [
          {
            locale: "es",
            title: "Escapada de otoño",
            description: "Tres noches con desayuno y late check-out incluido.",
          },
          {
            locale: "en",
            title: "Autumn escape",
            description: "Three nights with breakfast and late check-out included.",
          },
        ],
      },
    },
  });

  await prisma.offer.create({
    data: {
      id: "a1000000-0000-4000-8000-000000000002",
      slug: "suite-experience",
      discountPct: 20,
      startsAt: new Date("2026-11-01T00:00:00.000Z"),
      endsAt: new Date("2027-03-31T00:00:00.000Z"),
      isActive: true,
      translations: {
        create: [
          {
            locale: "es",
            title: "Experiencia Suite",
            description: "Dos noches en suite con cava de bienvenida y spa.",
          },
          {
            locale: "en",
            title: "Suite experience",
            description: "Two nights in a suite with welcome cava and spa access.",
          },
        ],
      },
    },
  });
}

async function main(): Promise<void> {
  console.log("Resetting database...");
  await resetDatabase();

  console.log("Seeding users...");
  await seedUsers();

  console.log("Seeding amenities...");
  await seedAmenities();

  console.log("Seeding rooms...");
  await seedRooms();

  console.log("Seeding bookings...");
  await seedBookings();

  console.log("Seeding contacts...");
  await seedContacts();

  console.log("Seeding offers...");
  await seedOffers();

  console.log("Seed completed.");
  console.log("Demo users: admin@miranda.test / Admin1234! (ADMIN)");
  console.log("            manager@miranda.test / Manager1234! (MANAGER)");
  console.log("            reception@miranda.test / Reception1234! (RECEPTIONIST)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
