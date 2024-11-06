// apps/web/components/QuantumMonolith.ts
import * as THREE from "three";

export class QuantumMonolith {
  mesh: THREE.Group;
  private floatingSquares: THREE.Mesh[];

  constructor() {
    this.floatingSquares = [];
    this.mesh = new THREE.Group();

    // Create taller monolith
    const geometry = new THREE.BoxGeometry(1.5, 8, 1.5);
    const positions = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      positions.setXYZ(
        i,
        x + (Math.random() - 0.5) * 0.05,
        y + (Math.random() - 0.5) * 0.05,
        z + (Math.random() - 0.5) * 0.05
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

    // Define rainbow colors
    const rainbowColors = [
      0xff0000, // Red
      0xff7f00, // Orange
      0xffff00, // Yellow
      0x00ff00, // Green
      0x0000ff, // Blue
      0x4b0082, // Indigo
      0x9400d3  // Violet
    ];

    // Add floating squares
    for (let i = 0; i < 20; i++) {
      const squareGeometry = new THREE.PlaneGeometry(0.2, 0.2);
      const squareMaterial = new THREE.MeshPhysicalMaterial({
        color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
        metalness: 1.0,
        roughness: 0.2,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      
      const square = new THREE.Mesh(squareGeometry, squareMaterial);
      
      // Random position around the monolith
      square.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 4
      );
      
      // Set initial random rotation
      square.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      this.floatingSquares.push(square);
      this.mesh.add(square);
    }

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

    // Animate floating squares
    this.floatingSquares.forEach((square, index) => {
      // Unique movement pattern for each square
      const offset = index * 0.5;
      
      // Float up and down
      square.position.y += Math.sin(time + offset) * 0.01;
      
      // Continuous rotation - increased speed and added all axes
      square.rotation.x += 0.02;
      square.rotation.y += 0.02;
      square.rotation.z += 0.02;
      
      // Reset position if too high
      if (square.position.y > 6) {
        square.position.y = -6;
      }
    });
  }
}