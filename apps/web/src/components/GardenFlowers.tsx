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
}

export class GardenFlowers {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private alienFlowers: any[] = [];
  private textDisplay: {
    sprite: THREE.Sprite;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D | null;
  };
  private flowerRaycaster: THREE.Raycaster;
  private hoveredFlower: THREE.Mesh | null = null;

  constructor({ scene, camera, gardenObjects }: GardenFlowersProps) {
    this.scene = scene;
    this.camera = camera;
    this.flowerRaycaster = new THREE.Raycaster();
    this.textDisplay = this.createTextDisplay();
    this.scene.add(this.textDisplay.sprite);
    
    if (gardenObjects) {
      this.createFlowers(gardenObjects);
    }

    window.addEventListener("mousemove", this.onFlowerMouseMove.bind(this));
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

  private createTextDisplay() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 1024;
    canvas.height = 256;

    if (context) {
      context.fillStyle = "rgba(0, 0, 0, 0.7)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = "48px Arial";
      context.fillStyle = "white";
      context.textAlign = "center";
      context.textBaseline = "middle";
    }

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0,
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(10, 2.5, 1);
    sprite.position.set(0, 5, 0);
    return { sprite, canvas, context };
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
      this.alienFlowers.map((flower) => flower.mesh)
    );

    if (intersects?.[0]) {
      const newHoveredFlower = intersects[0].object as THREE.Mesh;
      if (newHoveredFlower !== this.hoveredFlower) {
        if (this.hoveredFlower && this.hoveredFlower.material instanceof THREE.MeshPhongMaterial) {
          this.hoveredFlower.material.emissiveIntensity = 0.5;
        }
        
        this.hoveredFlower = newHoveredFlower;
        
        if (this.hoveredFlower.material instanceof THREE.MeshPhongMaterial) {
          this.hoveredFlower.material.emissiveIntensity = 1;
        }

        const text = this.hoveredFlower.userData.text;
        if (this.textDisplay.context && text) {
          this.textDisplay.context.clearRect(0, 0, this.textDisplay.canvas.width, this.textDisplay.canvas.height);
          this.textDisplay.context.fillStyle = "rgba(0, 0, 0, 0.7)";
          this.textDisplay.context.fillRect(0, 0, this.textDisplay.canvas.width, this.textDisplay.canvas.height);
          this.textDisplay.context.fillStyle = "white";
          this.textDisplay.context.fillText(text, this.textDisplay.canvas.width / 2, this.textDisplay.canvas.height / 2);
          (this.textDisplay.sprite.material.map as THREE.CanvasTexture).needsUpdate = true;
        }
        this.textDisplay.sprite.material.opacity = 1;
      }
    } else {
      if (this.hoveredFlower && this.hoveredFlower.material instanceof THREE.MeshPhongMaterial) {
        this.hoveredFlower.material.emissiveIntensity = 0.5;
      }
      this.hoveredFlower = null;
      this.textDisplay.sprite.material.opacity = 0;
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
  }
} 