import * as THREE from "three";

export class AlienCrystalFlower {
  mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();

    // Crystal core made of intersecting geometric shapes
    const coreGroup = new THREE.Group();
    const shapes = [
      new THREE.OctahedronGeometry(0.4, 0),
      new THREE.TetrahedronGeometry(0.5, 0),
      new THREE.DodecahedronGeometry(0.3, 0),
    ];

    shapes.forEach((geometry, i) => {
      const material = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.7,
        shininess: 100,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.set((i * Math.PI) / 2, (i * Math.PI) / 3, 0);
      coreGroup.add(mesh);
    });

    coreGroup.position.y = 0.5;
    this.mesh.add(coreGroup);

    // Spiral crystal formations
    const spiralCount = 3;
    const pointsPerSpiral = 15;

    for (let s = 0; s < spiralCount; s++) {
      const spiralGroup = new THREE.Group();

      for (let i = 0; i < pointsPerSpiral; i++) {
        const t = i / pointsPerSpiral;
        const angle = t * Math.PI * 4 + (s * Math.PI * 2) / spiralCount;

        const crystalGeo = new THREE.ConeGeometry(0.1, 0.4, 4);
        const crystalMat = new THREE.MeshPhongMaterial({
          color: 0xff1493,
          emissive: 0xff1493,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.8,
        });

        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystal.position.set(
          Math.cos(angle) * (0.5 + t),
          t * 2,
          Math.sin(angle) * (0.5 + t)
        );
        crystal.lookAt(new THREE.Vector3(0, crystal.position.y, 0));
        crystal.rotateX(Math.PI / 2);
        spiralGroup.add(crystal);
      }

      this.mesh.add(spiralGroup);
    }

    // Floating energy orbs
    const orbCount = 12;
    for (let i = 0; i < orbCount; i++) {
      const orbGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const orbMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x40e0d0,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.6,
      });

      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.set(
        (Math.random() - 0.5) * 2,
        Math.random() * 3,
        (Math.random() - 0.5) * 2
      );
      this.mesh.add(orb);
    }
  }

  animate(time: number) {
    this.mesh.children.forEach((child, index) => {
      if (child instanceof THREE.Group) {
        // Rotate crystal formations
        child.rotation.y = time * 0.001 + (index * Math.PI) / 3;
        child.rotation.z = Math.sin(time * 0.0005) * 0.2;
      } else if (child instanceof THREE.Mesh) {
        // Animate floating orbs
        const offset = index * 1000;
        child.position.y += Math.sin(time * 0.002 + offset) * 0.01;
        child.position.x += Math.cos(time * 0.002 + offset) * 0.01;
        child.position.z += Math.sin(time * 0.003 + offset) * 0.01;
      }
    });
  }
}
