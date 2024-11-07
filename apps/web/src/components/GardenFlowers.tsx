import * as THREE from "three";
import { AlienBioluminescentFlower } from "./Flowers/AlienBioluminescentFlower";
import { AlienCrystalFlower } from "./Flowers/AlienCrystalFlower";
import { AlienPrismFlower } from "./Flowers/AlienPrismFlower";
import { AlienNebulaFlower } from "./Flowers/AlienNebulaFlower";
import { AlienVortexFlower } from "./Flowers/AlienVortexFlower";
import { AlienFlower } from "./Flowers/AlienFlower";
import { AlienCrystalTree } from "./Flowers/AlienCrystalTree";
import { AlienLightPods } from "./Flowers/AlienLightPods";
import { GardenObject } from "@/lib/types";

interface GardenFlowersProps {
  scene: THREE.Scene;
  camera: THREE.Camera;
  gardenObjects?: GardenObject[];
  onFlowerClick?: (text: string) => void;
}

export class GardenFlowers {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private alienFlowers: any[] = [];
  private flowerRaycaster: THREE.Raycaster;
  private hoveredFlower: THREE.Mesh | null = null;
  private onFlowerClick: ((text: string) => void) | undefined;

  constructor({ scene, camera, gardenObjects, onFlowerClick }: GardenFlowersProps) {
    this.scene = scene;
    this.camera = camera;
    this.flowerRaycaster = new THREE.Raycaster();
    this.onFlowerClick = onFlowerClick;
    
    if (gardenObjects) {
      this.createFlowers(gardenObjects);
    }

    window.addEventListener("mousemove", this.onFlowerMouseMove.bind(this));
    window.addEventListener("click", this.handleFlowerClick.bind(this));
  }

  private createFlowerFromType(type: string) {
    switch (type) {
      case "BioluminescentFlower":
        return new AlienBioluminescentFlower();
      case "CrystalFlower":
        return new AlienCrystalFlower();
      case "CrystalTree":
        return new AlienCrystalTree();
      case "Flower":
        return new AlienFlower();
      case "LightPods":
        return new AlienLightPods();
      case "NebulaFlower":
        return new AlienNebulaFlower();
      case "PrismFlower":
        return new AlienPrismFlower();
      case "VortexFlower":
        return new AlienVortexFlower();
      default:
        return new AlienFlower();
    }
  }

  private createFlowers(gardenObjects: GardenObject[]) {
    gardenObjects.forEach((obj) => {
      const flower = this.createFlowerFromType(obj.object_component_type);
      flower.mesh.position.set(
        Math.random() * 40 - 20,
        -4.2,
        Math.random() * 40 - 20
      );
      flower.mesh.rotation.y = Math.random() * Math.PI * 2;
      const scale = 0.7 + Math.random() * 0.3;
      flower.mesh.scale.set(scale, scale, scale);
      
      flower.mesh.userData = { text: obj.text };
      this.scene.add(flower.mesh);
      this.alienFlowers.push(flower);
    });
  }

  private onFlowerMouseMove(event: MouseEvent) {
    const mousePos = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    this.flowerRaycaster.setFromCamera(mousePos, this.camera);
    const intersects = this.flowerRaycaster.intersectObjects(
      this.alienFlowers.map((flower) => flower.mesh),
      true
    );

    if (intersects.length > 0 && intersects[0]?.object) {
      const newHoveredFlower = intersects[0].object as THREE.Mesh;
      if (newHoveredFlower !== this.hoveredFlower) {
        if (this.hoveredFlower && this.hoveredFlower.material instanceof THREE.MeshPhongMaterial) {
          this.hoveredFlower.material.emissiveIntensity = 0.5;
        }
        
        this.hoveredFlower = newHoveredFlower;
        document.body.style.cursor = "pointer";
        
        if (this.hoveredFlower.material instanceof THREE.MeshPhongMaterial) {
          this.hoveredFlower.material.emissiveIntensity = 1;
        }
      }
    } else {
      if (this.hoveredFlower && this.hoveredFlower.material instanceof THREE.MeshPhongMaterial) {
        this.hoveredFlower.material.emissiveIntensity = 0.5;
      }
      this.hoveredFlower = null;
      document.body.style.cursor = "default";
    }
  }

  private handleFlowerClick(event: MouseEvent) {
    const mousePos = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    this.flowerRaycaster.setFromCamera(mousePos, this.camera);
    const intersects = this.flowerRaycaster.intersectObjects(
      this.alienFlowers.map((flower) => flower.mesh),
      true
    );

    if (intersects.length > 0 && intersects[0]?.object) {
      const clickedFlower = intersects[0].object as THREE.Mesh;
      let text = clickedFlower.userData.text;
      if (!text && clickedFlower.parent) {
        text = clickedFlower.parent.userData.text;
      }

      if (text && this.onFlowerClick) {
        this.onFlowerClick(text);
      }
    }
  }

  animate(time: number) {
    this.alienFlowers.forEach((flower) => {
      if (flower.animate) {
        flower.animate(time);
      }
    });
  }

  cleanup() {
    window.removeEventListener("mousemove", this.onFlowerMouseMove.bind(this));
    window.removeEventListener("click", this.handleFlowerClick.bind(this));
  }
} 