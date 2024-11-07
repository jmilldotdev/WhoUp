import { Tables, TablesInsert } from "@repo/supabase/types";

export const FLOWER_TYPES: string[] = [
  "BioluminescentFlower",
  "Flower",
  "CrystalFlower",
  "CrystalTree",
  "LightPods",
  "NebulaFlower",
  "PrismFlower",
  "VortexFlower",
  "Flower",
];

export type GardenObject = Tables<"GardenObjects">;

export type GardenObjectInsert = TablesInsert<"GardenObjects">;
