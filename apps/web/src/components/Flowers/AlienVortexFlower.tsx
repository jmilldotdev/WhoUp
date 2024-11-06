import * as THREE from 'three';

export class AlienVortexFlower {
  mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();

    // Vortex core
    const points = [];
    for (let i = 0; i < 10; i++) {
      points.push(new THREE.Vector3(
        Math.sin(i * 0.2) * 0.2,
        i * 0.1,
        Math.cos(i * 0.2) * 0.2
      ));
    }
    const coreGeo = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      64,
      0.1,
      8,
      false
    );
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x7b68ee,
      emissive: 0x7b68ee,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    this.mesh.add(core);

    // Energy spirals
    const spiralCount = 5;
    for (let s = 0; s < spiralCount; s++) {
      const spiralPoints = [];
      for (let i = 0; i < 50; i++) {
        const t = i / 49;
        const angle = t * Math.PI * 4 + (s * Math.PI * 2) / spiralCount;
        spiralPoints.push(new THREE.Vector3(
          Math.cos(angle) * (0.3 + t * 0.3),
          t * 1.5,
          Math.sin(angle) * (0.3 + t * 0.3)
        ));
      }
      
      const spiralGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(spiralPoints),
        128,
        0.02,
        8,
        false
      );
      const spiralMat = new THREE.MeshPhongMaterial({
        color: 0x00ff7f,
        emissive: 0x00ff7f,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.6,
      });
      const spiral = new THREE.Mesh(spiralGeo, spiralMat);
      this.mesh.add(spiral);
    }
  }

  animate(time: number) {
    // Rotate entire flower
    this.mesh.rotation.y = time * 0.001;
    
    // Pulse core
    const core = this.mesh.children[0];
    core.scale.setScalar(1 + Math.sin(time * 0.003) * 0.1);
    
    // Animate spirals
    for (let i = 1; i < 6; i++) {
      const spiral = this.mesh.children[i];
      spiral.rotation.z = Math.sin(time * 0.001 + i) * 0.2;
      spiral.scale.setScalar(1 + Math.sin(time * 0.002 + i) * 0.1);
    }
  }
} 