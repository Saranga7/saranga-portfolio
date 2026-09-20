export const elements = [
  { id: "original", label: "Original", nation: "Seventh Insight" },
  { id: "air", label: "Air", nation: "Air Nomads", artwork: "air_nomads", focalPosition: "60% 40%", description: "Mountain temples rising through clouds, with flying bison above the valley." },
  { id: "water", label: "Water", nation: "Water Tribes", artwork: "water_tribe", focalPosition: "68% 27%", description: "A moonlit ice city beside the water beneath a blue-green aurora." },
  { id: "earth", label: "Earth", nation: "Earth Kingdom", artwork: "earth_kingdom", focalPosition: "60% 43%", description: "A terraced kingdom of stone walls, gardens and palaces at sunset." },
  { id: "fire", label: "Fire", nation: "Fire Nation", artwork: "fire_nation", focalPosition: "66% 48%", description: "A Fire Nation palace surrounded by volcanic mountains and glowing lava." },
] as const;
export type ElementTheme = typeof elements[number]["id"];
