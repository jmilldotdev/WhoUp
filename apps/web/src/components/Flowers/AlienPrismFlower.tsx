import * as THREE from "three";

export class AlienPrismFlower {
  mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();

    // Prismatic core
    const coreGeo = new THREE.IcosahedronGeometry(0.3, 2);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0xff1493,
      emissive: 0xff1493,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8,
      wireframe: true,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.5;
    this.mesh.add(core);

    // Floating prism petals
    const petalCount = 8;
    for (let i = 0; i < petalCount; i++) {
      const petalGeo = new THREE.ConeGeometry(0.2, 0.8, 4);
      const petalMat = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.6,
        flatShading: true,
      });

      const petal = new THREE.Mesh(petalGeo, petalMat);
      const angle = (i / petalCount) * Math.PI * 2;
      petal.position.set(Math.cos(angle) * 0.8, 0.5, Math.sin(angle) * 0.8);
      petal.lookAt(new THREE.Vector3(0, 0.5, 0));
      this.mesh.add(petal);
    }

    // Energy rings
    const ringCount = 3;
    for (let i = 0; i < ringCount; i++) {
      const ringGeo = new THREE.TorusGeometry(0.3 + i * 0.2, 0.02, 16, 32);
      const ringMat = new THREE.MeshPhongMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.4,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 0.5;
      this.mesh.add(ring);
    }
  }

  animate(time: number) {
    // Rotate core
    const core = this.mesh.children[0] as THREE.Mesh;
    core.rotation.y += 0.01;
    core.rotation.z = Math.sin(time * 0.001) * 0.2;

    // Animate petals
    for (let i = 1; i < 9; i++) {
      const petal = this.mesh.children[i] as THREE.Mesh;
      petal.position.y = 0.5 + Math.sin(time * 0.002 + i) * 0.1;
      petal.rotation.z = Math.sin(time * 0.001 + i) * 0.2;
    }

    // Rotate rings
    for (let i = 9; i < 12; i++) {
      const ring = this.mesh.children[i] as THREE.Mesh;
      ring.rotation.x = Math.PI / 2;
      ring.rotation.y = time * 0.001 + ((i - 9) * Math.PI) / 4;
    }
  }
}
