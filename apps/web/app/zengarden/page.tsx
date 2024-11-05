'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export default function ZenGarden() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xC3C9D5)
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Sun
    const sunGeometry = new THREE.SphereGeometry(3, 32, 32)
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1,
    })
    const sun = new THREE.Mesh(sunGeometry, sunMaterial)
    sun.position.set(0, 20, -30)
    scene.add(sun)

    // Sun halo
    const haloGeometry = new THREE.RingGeometry(4, 12, 32)
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    })
    const halo = new THREE.Mesh(haloGeometry, haloMaterial)
    halo.position.copy(sun.position)
    halo.lookAt(camera.position)
    scene.add(halo)

    // Water
    const waterGeometry = new THREE.PlaneGeometry(100, 100)
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0xC3C9D5,
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1,
    })
    const water = new THREE.Mesh(waterGeometry, waterMaterial)
    water.rotation.x = -Math.PI / 2
    water.position.y = -5
    scene.add(water)

    // Floating rocks
    const createRock = (x: number, y: number, z: number) => {
      const rockGeometry = new THREE.DodecahedronGeometry(Math.random() * 2 + 1)
      const rockMaterial = new THREE.MeshStandardMaterial({
        color: 0x666666,
        roughness: 0.8,
      })
      const rock = new THREE.Mesh(rockGeometry, rockMaterial)
      rock.position.set(x, y, z)
      rock.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      scene.add(rock)
    }

    // Add several rocks
    for (let i = 0; i < 7; i++) {
      createRock(
        Math.random() * 40 - 20,
        Math.random() * 2 - 3,
        Math.random() * 40 - 20
      )
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(0, 20, 10)
    scene.add(directionalLight)

    // Add fog for misty effect
    scene.fog = new THREE.Fog(0xC3C9D5, 20, 100)

    // Camera position
    camera.position.set(0, 10, 30)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      halo.lookAt(camera.position)
      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} />
}
