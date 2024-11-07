import * as THREE from "three";
import { AlienBioluminescentFlower } from "./Flowers/AlienBioluminescentFlower";
import { AlienCrystalFlower } from "./Flowers/AlienCrystalFlower";
import { AlienPrismFlower } from "./Flowers/AlienPrismFlower";
import { AlienNebulaFlower } from "./Flowers/AlienNebulaFlower";
import { AlienVortexFlower } from "./Flowers/AlienVortexFlower";
import { AlienFlower } from "./Flowers/AlienFlower";
import { AlienCrystalTree } from "./Flowers/AlienCrystalTree";
import { AlienLightPods } from "./Flowers/AlienLightPods";

interface DefaultGardenFlowersProps {
  scene: THREE.Scene;
}

export class DefaultGardenFlowers {
  private scene: THREE.Scene;
  private alienFlowers: any[] = [];

  constructor({ scene }: DefaultGardenFlowersProps) {
    this.scene = scene;
    this.createDefaultFlowers();
  }

  private createDefaultFlowers() {
    // Create regular alien flowers
    for (let i = 0; i < 2; i++) {
      const flower = new AlienFlower();
      this.positionFlower(flower);
    }

    // Add crystal flowers
    for (let i = 0; i < 2; i++) {
      const crystalFlower = new AlienCrystalFlower();
      this.positionFlower(crystalFlower);
    }

    // Add bioluminescent flowers
    for (let i = 0; i < 2; i++) {
      const bioFlower = new AlienBioluminescentFlower();
      this.positionFlower(bioFlower);
    }

    // Add prism flowers
    for (let i = 0; i < 2; i++) {
      const prismFlower = new AlienPrismFlower();
      this.positionFlower(prismFlower);
    }

    // Add vortex flowers
    for (let i = 0; i < 2; i++) {
      const vortexFlower = new AlienVortexFlower();
      this.positionFlower(vortexFlower);
    }

    // Add nebula flowers
    for (let i = 0; i < 2; i++) {
      const nebulaFlower = new AlienNebulaFlower();
      this.positionFlower(nebulaFlower);
    }

    // Add crystal trees
    for (let i = 0; i < 2; i++) {
      const tree = new AlienCrystalTree();
      this.positionFlower(tree);
    }

    // Add light pods
    for (let i = 0; i < 2; i++) {
      const pods = new AlienLightPods();
      this.positionFlower(pods);
    }
  }

  private positionFlower(flower: any) {
    flower.mesh.position.set(
      Math.random() * 40 - 20,
      -4.2,
      Math.random() * 40 - 20
    );
    flower.mesh.rotation.y = Math.random() * Math.PI * 2;
    const scale = 0.7 + Math.random() * 0.3;
    flower.mesh.scale.set(scale, scale, scale);
    this.scene.add(flower.mesh);
    this.alienFlowers.push(flower);
  }

  animate(time: number) {
    this.alienFlowers.forEach((flower) => {
      if (flower.animate) {
        flower.animate(time);
      }
    });
  }

  cleanup() {
    this.alienFlowers.forEach((flower) => {
      this.scene.remove(flower.mesh);
    });
    this.alienFlowers = [];
  }
} 