import * as THREE from "three";

export class AlienCrystalFlower {
  mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();

    // Create the main blossom - a series of crystalline petals
    const petalCount = 7;
    const layerCount = 3;
    
    for (let layer = 0; layer < layerCount; layer++) {
      const petalGroup = new THREE.Group();
      
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        const petal = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.2, 1.5, 4, 1, true),
          new THREE.MeshPhongMaterial({
            color: 0x9932cc,
            emissive: 0xff00ff,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide,
            wireframe: true,
          })
        );
        
        petal.position.set(
          Math.cos(angle) * (0.8 + layer * 0.3),
          layer * 0.3,
          Math.sin(angle) * (0.8 + layer * 0.3)
        );
        petal.rotation.set(
          Math.PI / 4 + layer * 0.2,
          angle,
          (Math.PI / 6) * layer
        );
        petalGroup.add(petal);
      }
      this.mesh.add(petalGroup);
    }

    // Add floating crystal shards
    const shardCount = 20;
    for (let i = 0; i < shardCount; i++) {
      const shard = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.1 * Math.random() + 0.05),
        new THREE.MeshPhongMaterial({
          color: 0x00ffff,
          emissive: 0x00ffff,
          emissiveIntensity: 0.6,
          transparent: true,
          opacity: 0.6,
        })
      );
      
      const radius = 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      shard.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi) + 1,
        radius * Math.sin(phi) * Math.sin(theta)
      );
      this.mesh.add(shard);
    }

    // Add central energy core
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.3),
      new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xff1493,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.9,
      })
    );
    core.position.y = 0.5;
    this.mesh.add(core);
  }

  animate(time: number) {
    this.mesh.children.forEach((child, index) => {
      if (child instanceof THREE.Group) {
        // Rotate petal groups
        child.rotation.y = time * 0.0005 + (index * Math.PI) / 4;
        child.rotation.x = Math.sin(time * 0.0003 + index) * 0.1;
      } else if (child instanceof THREE.Mesh) {
        // Animate shards and core
        const offset = index * 100;
        if (index < this.mesh.children.length - 1) { // All except the core
          child.position.y += Math.sin(time * 0.001 + offset) * 0.003;
          child.rotation.x += 0.01;
          child.rotation.z += 0.01;
        } else { // Core animation
          child.scale.setScalar(1 + Math.sin(time * 0.002) * 0.1);
        }
      }
    });
  }
}
