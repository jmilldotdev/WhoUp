import * as THREE from 'three';

export class AlienCrystalTree {
  mesh: THREE.Group;
  private branches: THREE.Mesh[];
  private crystals: THREE.Mesh[];

  constructor() {
    this.mesh = new THREE.Group();
    this.branches = [];
    this.crystals = [];

    // Create trunk
    const trunkGeo = new THREE.CylinderGeometry(0.1, 0.15, 1, 6);
    const trunkMat = new THREE.MeshPhongMaterial({
      color: 0x4a0072,
      emissive: 0x4a0072,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.9,
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 0.5;
    this.mesh.add(trunk);

    // Create recursive branches
    this.createBranch(new THREE.Vector3(0, 1, 0), 0.8, 0, 3);

    // Add floating crystals
    const crystalCount = 15;
    for (let i = 0; i < crystalCount; i++) {
      const size = 0.1 + Math.random() * 0.1;
      const crystalGeo = new THREE.OctahedronGeometry(size);
      const crystalMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 1, 0.5),
        emissive: new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 1, 0.5),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
      });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.3 + Math.random() * 0.7;
      const height = 0.5 + Math.random() * 1.5;
      
      crystal.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
      
      this.crystals.push(crystal);
      this.mesh.add(crystal);
    }

    // Add energy connections between crystals
    for (let i = 0; i < this.crystals.length - 1; i++) {
      const startCrystal = this.crystals[i];
      const endCrystal = this.crystals[i + 1];

      if (startCrystal && endCrystal) {
        const start = startCrystal.position;
        const end = endCrystal.position;

        const points = [];
        points.push(start);
        points.push(end);
        
        const connectionGeo = new THREE.BufferGeometry().setFromPoints(points);
        const connectionMat = new THREE.LineBasicMaterial({
          color: 0x88ffff,
          transparent: true,
          opacity: 0.3,
        });
        
        const connection = new THREE.Line(connectionGeo, connectionMat);
        this.mesh.add(connection);
      }
    }
  }

  private createBranch(startPos: THREE.Vector3, length: number, angle: number, depth: number) {
    if (depth <= 0) return;

    const endPos = new THREE.Vector3(
      startPos.x + Math.cos(angle) * length,
      startPos.y + length,
      startPos.z + Math.sin(angle) * length
    );

    const points = [];
    points.push(startPos);
    points.push(endPos);

    const branchGeo = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      8,
      0.05 * depth,
      6,
      false
    );
    const branchMat = new THREE.MeshPhongMaterial({
      color: 0x4a0072,
      emissive: 0x4a0072,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.9,
    });
    const branch = new THREE.Mesh(branchGeo, branchMat);
    this.branches.push(branch);
    this.mesh.add(branch);

    // Create sub-branches
    const branchCount = 2;
    for (let i = 0; i < branchCount; i++) {
      const newAngle = angle + (Math.PI / 4) * (i === 0 ? 1 : -1);
      this.createBranch(endPos, length * 0.7, newAngle, depth - 1);
    }
  }

  animate(time: number) {
    // Animate branches
    this.branches.forEach((branch, index) => {
      branch.rotation.y = Math.sin(time * 0.001 + index) * 0.05;
    });

    // Animate crystals
    this.crystals.forEach((crystal, index) => {
      crystal.rotation.y += 0.01;
      crystal.position.y += Math.sin(time * 0.002 + index) * 0.002;
      
      const material = crystal.material as THREE.MeshPhongMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(time * 0.003 + index) * 0.2;
    });

    // Update energy connections
    const connectionStartIndex = this.mesh.children.length - (this.crystals.length - 1);
    for (let i = 0; i < this.crystals.length - 1; i++) {
      const startCrystal = this.crystals[i];
      const endCrystal = this.crystals[i + 1];

      if (startCrystal && endCrystal) {
        const start = startCrystal.position;
        const end = endCrystal.position;

        const connection = this.mesh.children[connectionStartIndex + i] as THREE.Line;
        const geometry = connection.geometry as THREE.BufferGeometry;
        const positions = geometry.attributes.position as THREE.BufferAttribute;

        positions.array[0] = start.x;
        positions.array[1] = start.y;
        positions.array[2] = start.z;
        positions.array[3] = end.x;
        positions.array[4] = end.y;
        positions.array[5] = end.z;

        positions.needsUpdate = true;
      }
    }
  }
} 