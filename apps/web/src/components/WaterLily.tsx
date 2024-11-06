import * as THREE from 'three'

export class WaterLily {
  mesh: THREE.Group

  constructor() {
    this.mesh = new THREE.Group()

    // Create flower petals
    const petalGeometry = new THREE.CircleGeometry(1, 32)
    const petalMaterial = new THREE.MeshPhongMaterial({
      color: 0xffb7c5, // Light pink
      side: THREE.DoubleSide,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
    })

    // Create multiple petals
    const petalCount = 8
    for (let i = 0; i < petalCount; i++) {
      const petal = new THREE.Mesh(petalGeometry, petalMaterial)
      petal.scale.set(1.5, 0.8, 1)
      petal.position.y = 0.1
      petal.rotation.x = -Math.PI / 3 // Tilt petals upward
      petal.rotation.y = (i / petalCount) * Math.PI * 2
      this.mesh.add(petal)
    }

    // Create center of the flower
    const centerGeometry = new THREE.SphereGeometry(0.5, 32, 32)
    const centerMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 100,
    })
    const center = new THREE.Mesh(centerGeometry, centerMaterial)
    center.position.y = 0.3
    this.mesh.add(center)

    // Create stem
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 5)
    const stemMaterial = new THREE.MeshPhongMaterial({
      color: 0x355E3B, // Dark green
    })
    const stem = new THREE.Mesh(stemGeometry, stemMaterial)
    stem.position.y = -2.5
    this.mesh.add(stem)

    // Create leaf
    const leafGeometry = new THREE.CircleGeometry(1, 32)
    const leafMaterial = new THREE.MeshPhongMaterial({
      color: 0x355E3B,
      side: THREE.DoubleSide,
    })
    const leaf = new THREE.Mesh(leafGeometry, leafMaterial)
    leaf.rotation.x = -Math.PI / 2
    leaf.position.y = -3
    this.mesh.add(leaf)
  }

  // Method to animate the lily
  animate(time: number) {
    // Gentle swaying motion
    this.mesh.rotation.z = Math.sin(time * 0.001) * 0.05
    
    // Subtle floating motion
    this.mesh.position.y = Math.sin(time * 0.0005) * 0.1
  }
}