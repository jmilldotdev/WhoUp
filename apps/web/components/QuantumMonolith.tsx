// apps/web/components/QuantumMonolith.ts
import * as THREE from "three";

export class QuantumMonolith {
  mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();

    // Create the outer monolith
    const geometry = new THREE.IcosahedronGeometry(2, 2);
    const positions = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      positions.setXYZ(
        i,
        x + (Math.random() - 0.5) * 0.1,
        y * 1.5 + (Math.random() - 0.5) * 0.1,
        z + (Math.random() - 0.5) * 0.1
      );
    }
    geometry.computeVertexNormals();

    // Modified material to be slightly transparent
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      metalness: 1.0,
      roughness: 0.2,
      iridescence: 1.0,
      iridescenceIOR: 2.0,
      iridescenceThicknessRange: [100, 400],
      transparent: true,
      opacity: 0.9,
      transmission: 0.1, // Allows some light to pass through
    });

    const monolithMesh = new THREE.Mesh(geometry, material);

    // Add point light inside
    const light = new THREE.PointLight(0x00ffff, 5, 3); // Cyan color, intensity 5, distance 3
    light.position.set(0, 0, 0); // Center of the monolith

    // Optional: Add a small glowing sphere to represent the light source
    const glowGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);

    // Add everything to the group
    this.mesh.add(monolithMesh);
    this.mesh.add(light);
    this.mesh.add(glowMesh);
    this.mesh.position.set(0, 2, 0);
  }

  // Optional: Add method to animate the light intensity
  animate(time: number) {
    const intensity = 3 + Math.sin(time * 2) * 2; // Pulsing between 1 and 5
    const light = this.mesh.children[1] as THREE.PointLight;
    light.intensity = intensity;
  }
}