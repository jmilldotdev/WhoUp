import * as THREE from 'three';

export class AlienNebulaFlower {
  mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();

    // Nebulous core
    const coreGeo = new THREE.SphereGeometry(0.4, 32, 32);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x4b0082,
      emissive: 0x4b0082,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.7,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.5;
    this.mesh.add(core);

    // Particle cloud
    const particleCount = 1000;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 0.5 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = 0.5 + radius * Math.cos(phi);
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.2 + 0.5, 1, 0.5);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    this.mesh.add(particles);

    // Energy wisps
    const wispCount = 6;
    for (let i = 0; i < wispCount; i++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.3, 0),
        new THREE.Vector3(
          Math.cos(i * Math.PI * 2 / wispCount) * 0.5,
          0.8,
          Math.sin(i * Math.PI * 2 / wispCount) * 0.5
        ),
        new THREE.Vector3(
          Math.cos(i * Math.PI * 2 / wispCount) * 0.3,
          1.3,
          Math.sin(i * Math.PI * 2 / wispCount) * 0.3
        ),
      ]);

      const wispGeo = new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
      const wispMat = new THREE.MeshPhongMaterial({
        color: 0x9400d3,
        emissive: 0x9400d3,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.4,
      });
      const wisp = new THREE.Mesh(wispGeo, wispMat);
      this.mesh.add(wisp);
    }
  }

  animate(time: number) {
    const core = this.mesh.children[0] as THREE.Mesh;
    core.scale.setScalar(1 + Math.sin(time * 0.002) * 0.1);

    // Rotate particle cloud
    const particles = this.mesh.children[1] as THREE.Points;
    particles.rotation.y = time * 0.0005;
    
    // Animate wisps
    for (let i = 2; i < 8; i++) {
      const wisp = this.mesh.children[i] as THREE.Mesh;
      wisp.rotation.y = Math.sin(time * 0.001 + i) * 0.2;
      wisp.rotation.z = Math.cos(time * 0.001 + i) * 0.2;
    }
  }
} 