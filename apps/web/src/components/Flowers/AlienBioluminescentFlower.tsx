import * as THREE from 'three';

export class AlienBioluminescentFlower {
  mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();

    // Create jellyfish-like dome
    const domeGeo = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshPhongMaterial({
      color: 0x4b0082,
      emissive: 0x9400d3,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 1;
    this.mesh.add(dome);

    // Add bioluminescent veins
    const veinCount = 8;
    for (let i = 0; i < veinCount; i++) {
      const points = [];
      const segments = 10;
      for (let j = 0; j < segments; j++) {
        const t = j / (segments - 1);
        const angle = (i / veinCount) * Math.PI * 2;
        points.push(new THREE.Vector3(
          Math.cos(angle) * (0.8 - t * 0.3),
          1 - t * 2,
          Math.sin(angle) * (0.8 - t * 0.3)
        ));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const veinGeo = new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
      const veinMat = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8,
      });
      const vein = new THREE.Mesh(veinGeo, veinMat);
      this.mesh.add(vein);
    }

    // Add pulsing light pods
    const podCount = 15;
    for (let i = 0; i < podCount; i++) {
      const podGeo = new THREE.SphereGeometry(0.15, 16, 16);
      const podMat = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.9,
      });
      const pod = new THREE.Mesh(podGeo, podMat);
      
      const angle = (i / podCount) * Math.PI * 2;
      const radius = 0.6 + Math.random() * 0.3;
      pod.position.set(
        Math.cos(angle) * radius,
        0.5 + Math.random(),
        Math.sin(angle) * radius
      );
      this.mesh.add(pod);
    }

    // Add trailing tendrils
    const tendrilCount = 12;
    for (let i = 0; i < tendrilCount; i++) {
      const points = [];
      const segments = 8;
      const angle = (i / tendrilCount) * Math.PI * 2;
      const startRadius = 0.8;
      
      for (let j = 0; j < segments; j++) {
        const t = j / (segments - 1);
        points.push(new THREE.Vector3(
          Math.cos(angle) * startRadius * (1 - t * 0.5),
          0 - t * 2,
          Math.sin(angle) * startRadius * (1 - t * 0.5)
        ));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const tendrilGeo = new THREE.TubeGeometry(curve, 20, 0.03, 8, false);
      const tendrilMat = new THREE.MeshPhongMaterial({
        color: 0x9932cc,
        emissive: 0x9932cc,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7,
      });
      const tendril = new THREE.Mesh(tendrilGeo, tendrilMat);
      this.mesh.add(tendril);
    }
  }

  animate(time: number) {
    // Undulate the dome
    const dome = this.mesh.children[0];
    if (dome) {
        dome.scale.y = 1 + Math.sin(time * 0.002) * 0.1;
    }

    // Animate light pods
    this.mesh.children.forEach((child, index) => {
      if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry && child.geometry.parameters.radius === 0.15) {
        const material = child.material as THREE.MeshPhongMaterial;
        material.emissiveIntensity = 0.5 + Math.sin(time * 0.003 + index) * 0.5;
        child.position.y += Math.sin(time * 0.004 + index) * 0.01;
      }
    });

    // Wave the tendrils
    this.mesh.children.forEach((child, index) => {
      if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TubeGeometry) {
        child.rotation.x = Math.sin(time * 0.002 + index) * 0.1;
        child.rotation.z = Math.cos(time * 0.002 + index) * 0.1;
      }
    });
  }
} 