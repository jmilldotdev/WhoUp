import { Tables, TablesInsert } from "@repo/supabase/types";

export const FLOWER_TYPES: string[] = [
  "BioluminescentFlower",
  "CrystalFlower",
  "CrystalTree",
  "Flower",
  "LightPods",
  "NebulaFlower",
  "PrismFlower",
  "VortexFlower",
];

export type GardenObject = Tables<"GardenObjects">;
export type GardenObjectInsert = TablesInsert<"GardenObjects">;
