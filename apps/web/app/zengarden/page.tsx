'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Water } from 'three/examples/jsm/objects/Water.js'
import { AlienFlower } from '../../components/AlienFlower'
export default function ZenGarden() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0xFAE1C7, 0.007)
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

    // Replace the Sun halo section with this:
    const createSunRays = () => {
      const rays: THREE.Mesh[] = [];
      const rayCount = 32;
      
      for (let i = 0; i < rayCount; i++) {
        // Create a gradient texture for the ray
        const gradientCanvas = document.createElement('canvas');
        gradientCanvas.width = 256;
        gradientCanvas.height = 1;
        const context = gradientCanvas.getContext('2d');
        
        if (context) {
          const gradient = context.createLinearGradient(0, 0, gradientCanvas.width, 0);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.24)'); // More opaque at center
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');    // Fully transparent at edges
          context.fillStyle = gradient;
          context.fillRect(0, 0, gradientCanvas.width, 1);
        }
        
        const gradientTexture = new THREE.CanvasTexture(gradientCanvas);
        gradientTexture.needsUpdate = true;

        const rayGeometry = new THREE.PlaneGeometry(20, 2);
        const rayMaterial = new THREE.MeshBasicMaterial({
          map: gradientTexture,
          transparent: true,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        
        const ray = new THREE.Mesh(rayGeometry, rayMaterial);
        ray.position.copy(sun.position);
        ray.rotation.z = (i / rayCount) * Math.PI * 2;
        scene.add(ray);
        rays.push(ray);
      }
      return rays;
    };

    const sunRays = createSunRays();

    // Sky gradient
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32)
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(0xFFA07A) },
        color2: { value: new THREE.Color(0x87CEEB) },
        fogColor: { value: new THREE.Color(0xFAE1C7) },
        fogDensity: { value: 0.015 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 fogColor;
        uniform float fogDensity;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + vec3(0.0, 20.0, 30.0)).y;
          vec3 skyColor = mix(color2, color1, pow(max(1.0 - h, 0.0), 0.4));
          
          float dist = length(vWorldPosition);
          float fogFactor = 1.0 - exp(-fogDensity * dist);
          
          vec3 finalColor = mix(skyColor, fogColor, fogFactor);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: THREE.BackSide,
    })
    const sky = new THREE.Mesh(skyGeometry, skyMaterial)
    scene.add(sky)

    // Glowing crystal effect
    const crystalGeometry = new THREE.BufferGeometry()
    const crystalMaterial = new THREE.PointsMaterial({
      color: 0xFCF8F7,
      size: 0.5,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const crystalPositions = []
    for (let i = 0; i < 100; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = Math.random() * 10 + 5
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)
      crystalPositions.push(x, y, z)
    }

    crystalGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(crystalPositions, 3)
    )

    const crystals = new THREE.Points(crystalGeometry, crystalMaterial)
    crystals.position.copy(sun.position)
    scene.add(crystals)

    // Floating stars
    const starCount = 200;
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Distribute stars in a larger volume
      starPositions[i3] = (Math.random() - 0.5) * 200;  // x
      starPositions[i3 + 1] = Math.random() * 100 + 10; // y
      starPositions[i3 + 2] = (Math.random() - 0.5) * 200; // z
      starSizes[i] = Math.random() * 2 + 1;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0xffffbb) },
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        varying float vAlpha;
        
        void main() {
          vec3 pos = position;
          // Add gentle floating motion
          pos.y += sin(time * 0.001 + position.x * 0.5) * 0.5;
          pos.x += cos(time * 0.001 + position.z * 0.5) * 0.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Size attenuation
          gl_PointSize = size * (300.0 / -mvPosition.z);
          
          // Pass alpha to fragment shader
          vAlpha = 0.5 + 0.5 * sin(time * 0.002 + position.y * 0.1);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;
        
        void main() {
          // Create circular point
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
          
          // Add glow effect
          vec3 glow = color * (1.0 - dist * 2.0);
          gl_FragColor = vec4(glow, alpha * vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Water
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000)
    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        'https://threejs.org/examples/textures/waternormals.jpg',
        (texture) => {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xF3EBDC,
      waterColor: 0x636CBA,
      distortionScale: 3.7,
      fog: true
    })
    water.rotation.x = -Math.PI / 2
    water.position.y = -5
    scene.add(water)

    // Custom shader for iridescent rocks
    const rockShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorShift: { value: new THREE.Vector3(0.5, 0.5, 0.5) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 colorShift;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vec3 normal = normalize(vNormal);
          
          // Create iridescent effect based on normal direction and position
          float fresnel = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.0);
          vec3 baseColor = vec3(0.2, 0.2, 0.2); // Dark base color
          
          // Rainbow color calculation
          vec3 rainbow = 0.5 + 0.5 * cos(time * 0.2 + vPosition.y + vec3(0.0, 2.0, 4.0));
          
          // Mix colors based on fresnel effect
          vec3 finalColor = mix(baseColor, rainbow, fresnel * 0.7);
          
          // Add metallic sheen
          float metallic = pow(fresnel, 3.0) * 0.8;
          finalColor += vec3(metallic);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    });

    // Modified createRock function
    const createRock = (x: number, y: number, z: number) => {
      const rockGeometry = new THREE.DodecahedronGeometry(Math.random() * 2 + 1)
      const rockMaterial = rockShaderMaterial.clone();
      const rock = new THREE.Mesh(rockGeometry, rockMaterial)
      rock.position.set(x, y, z)
      rock.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      scene.add(rock)
      return rock; // Return rock for animation
    }

    // Create array to store rocks for animation
    const rocks: THREE.Mesh[] = [];

    // Add several rocks
    for (let i = 0; i < 7; i++) {
      const rock = createRock(
        Math.random() * 40 - 20,
        Math.random() * 2 - 3,
        Math.random() * 40 - 20
      );
      rocks.push(rock);
    }

    // Create alien flowers
    const alienFlowers: AlienFlower[] = []
    const alienFlowerCount = 3

    for (let i = 0; i < alienFlowerCount; i++) {
      const alienFlower = new AlienFlower()
      // Position them at different spots than water lilies
      alienFlower.mesh.position.set(
        Math.random() * 40 - 20, // x: -20 to 20
        -4.2, // y: slightly higher than water lilies
        Math.random() * 40 - 20  // z: -20 to 20
      )
      
      // Random rotation and scale
      alienFlower.mesh.rotation.y = Math.random() * Math.PI * 2
      const scale = 0.6 + Math.random() * 0.3
      alienFlower.mesh.scale.set(scale, scale, scale)
      
      scene.add(alienFlower.mesh)
      alienFlowers.push(alienFlower)
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(0, 20, 10)
    scene.add(directionalLight)

    // Camera position
    camera.position.set(0, 10, 30)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      
      // Animate sun rays
      sunRays.forEach((ray, index) => {
        ray.rotation.z += 0.0005;
        const baseScale = 1 + Math.sin(Date.now() * 0.0005) * 0.1;
        ray.scale.set(baseScale, baseScale, 1);
      });
      
      // Update rock shader time uniform
      rocks.forEach(rock => {
        if (rock.material instanceof THREE.ShaderMaterial) {
          const timeUniform = rock.material.uniforms.time;
          if (timeUniform) {
            timeUniform.value += 0.01;
          }
        }
      });
      
      // Update water
      if (water.material.uniforms['time']) {
        water.material.uniforms['time'].value += 1.0 / 120.0;
      }
      
      // Animate stars
      if (stars.material instanceof THREE.ShaderMaterial && 
          'time' in stars.material.uniforms) {
        stars.material.uniforms.time.value = Date.now();
      }
      
      // Animate alien flowers
      alienFlowers.forEach(flower => {
        flower.animate(Date.now())
      })
      
      renderer.render(scene, camera);
    };

    animate();

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
