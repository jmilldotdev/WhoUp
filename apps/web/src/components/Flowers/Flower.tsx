import { AlienBioluminescentFlower } from "@/components/Flowers/AlienBioluminescentFlower";
import { AlienCrystalFlower } from "@/components/Flowers/AlienCrystalFlower";
import { AlienCrystalTree } from "@/components/Flowers/AlienCrystalTree";
import { AlienFlower } from "@/components/Flowers/AlienFlower";
import { AlienLightPods } from "@/components/Flowers/AlienLightPods";
import { AlienNebulaFlower } from "@/components/Flowers/AlienNebulaFlower";
import { AlienPrismFlower } from "@/components/Flowers/AlienPrismFlower";
import { AlienVortexFlower } from "@/components/Flowers/AlienVortexFlower";
import * as THREE from "three";

// Map of flower class constructors
export const FlowerMap = {
  BioluminescentFlower: AlienBioluminescentFlower,
  CrystalFlower: AlienCrystalFlower,
  CrystalTree: AlienCrystalTree,
  Flower: AlienFlower,
  LightPods: AlienLightPods,
  NebulaFlower: AlienNebulaFlower,
  PrismFlower: AlienPrismFlower,
  VortexFlower: AlienVortexFlower,
} as const;

// Type for the flower classes
type FlowerClass = {
  new (): {
    mesh: THREE.Group;
    animate: (time: number) => void;
  };
};

// Type-safe map of flower constructors
export const FlowerConstructors: Record<keyof typeof FlowerMap, FlowerClass> =
  FlowerMap;

interface FlowerProps {
  type: keyof typeof FlowerMap;
}

// This component would need to be used within a Three.js scene
export function Flower({ type }: FlowerProps) {
  const FlowerClass = FlowerConstructors[type];
  // Note: You'll need to actually instantiate and add this to your Three.js scene
  // This is just a placeholder - the actual implementation would depend on your Three.js setup
  return null;
}
