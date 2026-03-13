import petLeaf from "../../pets/ChatGPT Image Mar 7, 2026, 02_46_41 PM.png";
import petSolar from "../../pets/ChatGPT Image Mar 7, 2026, 02_53_56 PM.png";
import petBloom from "../../pets/ChatGPT Image Mar 7, 2026, 02_55_57 PM.png";

export type PetTemplate = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  accentClass: string;
  image: string;
};

export type ShopItem = {
  id: string;
  name: string;
  price: number;
  slot: "head" | "face" | "background" | "boost";
  description: string;
  effect: string;
};

export type SdgBadge = {
  id: string;
  title: string;
  sdg: string;
  description: string;
};

export const PET_TEMPLATES: PetTemplate[] = [
  {
    id: "sprig",
    name: "Sprig",
    tagline: "A leafy explorer",
    description: "Best for players who want a bright, nature-first mascot.",
    accentClass: "from-lime-200 to-emerald-300",
    image: petLeaf,
  },
  {
    id: "sol",
    name: "Sol",
    tagline: "A sun-charged challenger",
    description: "Great for competitive players chasing streaks and weekly goals.",
    accentClass: "from-amber-200 to-orange-300",
    image: petSolar,
  },
  {
    id: "marlo",
    name: "Marlo",
    tagline: "A calm low-carbon companion",
    description: "Fits players who want a softer, community-minded vibe.",
    accentClass: "from-sky-200 to-cyan-300",
    image: petBloom,
  },
];

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "moss-cap",
    name: "Moss Cap",
    price: 45,
    slot: "head",
    description: "A soft green cap for your campus companion.",
    effect: "Cosmetic upgrade",
  },
  {
    id: "eco-shades",
    name: "Eco Shades",
    price: 60,
    slot: "face",
    description: "Sunglasses for pets with leaderboard energy.",
    effect: "Cosmetic upgrade",
  },
  {
    id: "wild-meadow",
    name: "Wild Meadow",
    price: 120,
    slot: "background",
    description: "Unlock a brighter habitat background for your pet page.",
    effect: "Cosmetic upgrade",
  },
  {
    id: "revive-token",
    name: "Revive Token",
    price: 500,
    slot: "boost",
    description: "Emergency backup if your pet reaches zero energy.",
    effect: "Revives one pet",
  },
];

export const SDG_BADGES: SdgBadge[] = [
  {
    id: "sdg-7-saver",
    title: "Energy Saver",
    sdg: "SDG 7",
    description: "Awarded for low-energy and efficiency-focused actions.",
  },
  {
    id: "sdg-11-traveller",
    title: "Low-Carbon Traveller",
    sdg: "SDG 11",
    description: "Celebrate greener campus travel and shared mobility habits.",
  },
  {
    id: "sdg-12-swapper",
    title: "Reuse Champion",
    sdg: "SDG 12",
    description: "Highlights waste reduction, swaps, and reusable choices.",
  },
  {
    id: "sdg-13-guardian",
    title: "Climate Guardian",
    sdg: "SDG 13",
    description: "A high-level badge for sustained climate-positive behaviour.",
  },
];
