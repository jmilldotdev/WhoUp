import * as THREE from 'three';

export class AlienLightPods {
  mesh: THREE.Group;
  private pods: THREE.Mesh[];
  private energyFields: THREE.Mesh[];

  constructor() {
    this.mesh = new THREE.Group();
    this.pods = [];
    this.energyFields = [];

    // Create central stalk
    const stalkPoints = [];
    for (let i = 0; i < 10; i++) {
      stalkPoints.push(new THREE.Vector3(
        Math.sin(i * 0.2) * 0.1,
        i * 0.15,
        Math.cos(i * 0.2) * 0.1
      ));
    }

    const stalkGeo = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(stalkPoints),
      20,
      0.05,
      8,
      false
    );
    const stalkMat = new THREE.MeshPhongMaterial({
      color: 0x20b2aa,
      emissive: 0x20b2aa,
      emissiveIntensity: 0.3,
    });
    const stalk = new THREE.Mesh(stalkGeo, stalkMat);
    this.mesh.add(stalk);

    // Create light pods
    const podCount = 5;
    for (let i = 0; i < podCount; i++) {
      // Pod geometry
      const podGeo = new THREE.SphereGeometry(0.15, 16, 16);
      const podMat = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
      });
      const pod = new THREE.Mesh(podGeo, podMat);
      
      const angle = (i / podCount) * Math.PI * 2;
      pod.position.set(
        Math.cos(angle) * 0.3,
        0.3 + i * 0.3,
        Math.sin(angle) * 0.3
      );
      
      this.pods.push(pod);
      this.mesh.add(pod);

      // Energy field around each pod
      const fieldGeo = new THREE.TorusGeometry(0.2, 0.02, 16, 32);
      const fieldMat = new THREE.MeshPhongMaterial({
        color: 0x40e0d0,
        emissive: 0x40e0d0,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.4,
      });
      const field = new THREE.Mesh(fieldGeo, fieldMat);
      field.position.copy(pod.position);
      
      this.energyFields.push(field);
      this.mesh.add(field);
    }

    // Add energy tendrils
    const tendrilCount = 15;
    for (let i = 0; i < tendrilCount; i++) {
      const points = [];
      const height = 0.3 + Math.random() * 1.2;
      const angle = (i / tendrilCount) * Math.PI * 2;
      const radius = 0.3 + Math.random() * 0.2;

      for (let j = 0; j < 5; j++) {
        const t = j / 4;
        points.push(new THREE.Vector3(
          Math.cos(angle + t * Math.PI) * radius * (1 - t * 0.5),
          height * t,
          Math.sin(angle + t * Math.PI) * radius * (1 - t * 0.5)
        ));
      }

      const tendrilGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points),
        20,
        0.02,
        8,
        false
      );
      const tendrilMat = new THREE.MeshPhongMaterial({
        color: 0x40e0d0,
        emissive: 0x40e0d0,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.3,
      });
      const tendril = new THREE.Mesh(tendrilGeo, tendrilMat);
      this.mesh.add(tendril);
    }
  }

  animate(time: number) {
    // Animate pods
    this.pods.forEach((pod, index) => {
      pod.scale.setScalar(1 + Math.sin(time * 0.003 + index) * 0.1);
      const material = pod.material as THREE.MeshPhongMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(time * 0.002 + index) * 0.2;
    });

    // Animate energy fields
    this.energyFields.forEach((field, index) => {
      field.rotation.x = time * 0.001 + index;
      field.rotation.y = time * 0.0015 + index;
      field.scale.setScalar(1 + Math.sin(time * 0.002 + index) * 0.1);
    });

    // Animate tendrils
    for (let i = this.pods.length + this.energyFields.length + 1; i < this.mesh.children.length; i++) {
      const tendril = this.mesh.children[i];
      tendril.rotation.y = Math.sin(time * 0.001 + i) * 0.1;
      tendril.rotation.z = Math.cos(time * 0.001 + i) * 0.1;
    }
  }
} 