import * as THREE from 'three'

export class AlienFlower {
  mesh: THREE.Group

  constructor() {
    this.mesh = new THREE.Group()

    // Create the main bioluminescent core
    const coreGeometry = new THREE.IcosahedronGeometry(0.5, 1)
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.9,
      shininess: 100,
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    core.position.y = 0.5
    this.mesh.add(core)

    // Create floating crystal petals
    const petalCount = 6
    const petalGeometry = new THREE.TetrahedronGeometry(0.8, 0)
    const petalMaterial = new THREE.MeshPhongMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.7,
      shininess: 100,
      side: THREE.DoubleSide,
    })

    for (let i = 0; i < petalCount; i++) {
      const petal = new THREE.Mesh(petalGeometry, petalMaterial)
      petal.position.y = 0.5
      petal.rotation.x = Math.PI / 6
      petal.rotation.y = (i / petalCount) * Math.PI * 2
      petal.position.x = Math.cos((i / petalCount) * Math.PI * 2) * 1.2
      petal.position.z = Math.sin((i / petalCount) * Math.PI * 2) * 1.2
      this.mesh.add(petal)
    }

    // Create tentacle-like stems
    const tentacleCount = 3
    for (let i = 0; i < tentacleCount; i++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(i * Math.PI * 2 / 3) * 0.5, -1, Math.sin(i * Math.PI * 2 / 3) * 0.5),
        new THREE.Vector3(Math.cos(i * Math.PI * 2 / 3) * 1, -2, Math.sin(i * Math.PI * 2 / 3) * 1),
        new THREE.Vector3(Math.cos(i * Math.PI * 2 / 3) * 0.5, -3, Math.sin(i * Math.PI * 2 / 3) * 0.5),
      ])

      const tentacleGeometry = new THREE.TubeGeometry(curve, 20, 0.05, 8, false)
      const tentacleMaterial = new THREE.MeshPhongMaterial({
        color: 0x9932CC,
        emissive: 0x4B0082,
        emissiveIntensity: 0.2,
      })
      const tentacle = new THREE.Mesh(tentacleGeometry, tentacleMaterial)
      this.mesh.add(tentacle)
    }

    // Add floating spores
    const sporeCount = 10
    const sporeGeometry = new THREE.SphereGeometry(0.1, 8, 8)
    const sporeMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ffaa,
      emissive: 0x00ffaa,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.6,
    })

    for (let i = 0; i < sporeCount; i++) {
      const spore = new THREE.Mesh(sporeGeometry, sporeMaterial)
      spore.position.set(
        (Math.random() - 0.5) * 2,
        Math.random() * 2,
        (Math.random() - 0.5) * 2
      )
      this.mesh.add(spore)
    }
  }

  animate(time: number) {
    // Rotate the entire flower
    this.mesh.rotation.y = Math.sin(time * 0.0005) * 0.1

    // Animate individual parts
    this.mesh.children.forEach((child, index) => {
      if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TetrahedronGeometry) {
        // Animate crystal petals
        child.rotation.x += Math.sin(time * 0.001 + index) * 0.002
        child.position.y = 0.5 + Math.sin(time * 0.002 + index) * 0.1
      } else if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry) {
        // Animate spores in orbital motion
        const radius = 1 + Math.sin(time * 0.001 + index) * 0.2
        child.position.x = Math.cos(time * 0.001 + index) * radius
        child.position.z = Math.sin(time * 0.001 + index) * radius
        child.position.y = 1 + Math.sin(time * 0.002 + index) * 0.5
      }
    })
  }
} 