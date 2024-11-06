import * as THREE from "three";

export class QuantumMonolith {
  mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();

    // Create the alien structure base shape
    const height = 15;
    const segments = 32;

    // Create a custom geometry using LatheGeometry for an oval/egg-like shape
    const points: THREE.Vector2[] = [];
    const numPoints = 20;

    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const angle = t * Math.PI;

      // Create an oval profile with varying thickness
      const radius = 1.2 * (1 + Math.sin(t * Math.PI) * 0.5);
      // Add some waviness to the profile
      const wobble = 0.2 * Math.sin(t * 6);

      // Create asymmetric bulges
      const bulge =
        t < 0.5
          ? 0.3 * Math.sin(t * Math.PI * 2)
          : 0.15 * Math.sin(t * Math.PI * 3);

      const x = radius + wobble + bulge;
      const y = t * height - height / 2;
      points.push(new THREE.Vector2(x, y));
    }

    const geometry = new THREE.LatheGeometry(points, segments);

    // Add organic deformations to the base shape
    const positions = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      // Create spiral ridges
      const angle = Math.atan2(z, x);
      const radius = Math.sqrt(x * x + z * z);
      const spiralDeform = Math.sin(angle * 4 + y * 0.5) * 0.15;

      // Add asymmetric bulges
      const verticalDeform = Math.sin(y * 0.3) * Math.cos(angle * 3) * 0.2;

      // Create surface details
      const surfaceNoise =
        Math.sin(x * 5 + y * 0.5) * Math.sin(z * 5 + y * 0.5) * 0.05;

      positions.setX(i, x * (1 + spiralDeform + verticalDeform) + surfaceNoise);
      positions.setZ(i, z * (1 + spiralDeform + verticalDeform) + surfaceNoise);
      positions.setY(i, y + surfaceNoise * 2);
    }

    geometry.computeVertexNormals();

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pulseColor: { value: new THREE.Color(0x00ffff) },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 pulseColor;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        vec3 rainbow(float t) {
          vec3 a = vec3(0.5, 0.5, 0.5);
          vec3 b = vec3(0.5, 0.5, 0.5);
          vec3 c = vec3(1.0, 1.0, 1.0);
          vec3 d = vec3(0.263, 0.416, 0.557);
          return a + b * cos(6.28318 * (c * t + d));
        }
        
        void main() {
          // Metallic base color
          vec3 baseColor = vec3(0.7, 0.7, 0.8);
          
          // Enhanced metallic reflection
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.0);
          
          // Rainbow effect
          float rainbowPattern = sin(vPosition.y * 1.5 + time * 0.5) * 
                                sin(vPosition.x * 2.0 + time * 0.3) * 
                                sin(vPosition.z * 2.0 + time * 0.4);
          vec3 rainbowColor = rainbow(vPosition.y * 0.1 + time * 0.1);
          
          // Metallic highlights
          float highlight = pow(fresnel, 3.0) * 0.8;
          
          // Glowing light strips
          float strips = step(0.97, sin(vPosition.y * 8.0 + time));
          float glow = sin(time * 2.0) * 0.5 + 0.5;
          
          // Combine effects
          vec3 finalColor = mix(baseColor, vec3(1.0), highlight);
          finalColor = mix(finalColor, rainbowColor, rainbowPattern * 0.3);
          finalColor += rainbowColor * strips * glow * 0.5;
          finalColor += vec3(1.0) * fresnel * 0.2;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const monolith = new THREE.Mesh(geometry, material);
    monolith.position.y = 0;

    // Add tentacles
    const tentacleCount = 12;
    const tentacleSegments = 24;
    const tentacleRadius = 0.08;
    const tentacleLength = 10;

    for (let i = 0; i < tentacleCount; i++) {
      const curve = new THREE.CatmullRomCurve3(
        this.generateTentaclePath(tentacleLength)
      );
      const tentacleGeometry = new THREE.TubeGeometry(
        curve,
        tentacleSegments,
        tentacleRadius,
        8,
        false
      );
      const tentacleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          pulseColor: { value: new THREE.Color(0x00ffff) },
        },
        vertexShader: `
          varying vec3 vPosition;
          varying vec3 vNormal;
          varying float vHeight;
          
          void main() {
            vPosition = position;
            vNormal = normal;
            vHeight = position.y;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 pulseColor;
          varying vec3 vPosition;
          varying vec3 vNormal;
          varying float vHeight;
          
          vec3 rainbow(float t) {
            vec3 a = vec3(0.5, 0.5, 0.5);
            vec3 b = vec3(0.5, 0.5, 0.5);
            vec3 c = vec3(1.0, 1.0, 1.0);
            vec3 d = vec3(0.263, 0.416, 0.557);
            return a + b * cos(6.28318 * (c * t + d));
          }
          
          void main() {
            // Rainbow gradient along tentacle
            vec3 rainbowColor = rainbow(vHeight * 0.1 + time * 0.2);
            
            // Pulsing glow effect
            float pulse = sin(time * 2.0 + vHeight * 3.0) * 0.5 + 0.5;
            
            // Flow pattern
            float flow = sin(vHeight * 8.0 + time * 3.0) * 0.5 + 0.5;
            
            vec3 finalColor = mix(rainbowColor, rainbowColor * 1.5, flow);
            finalColor += rainbowColor * pulse * 0.5;
            
            gl_FragColor = vec4(finalColor, 0.85);
          }
        `,
        transparent: true,
      });

      const tentacle = new THREE.Mesh(tentacleGeometry, tentacleMaterial);
      tentacle.position.y = -height / 2 + 15;
      tentacle.rotation.y = (i / tentacleCount) * Math.PI * 2;
      this.mesh.add(tentacle);
    }

    // Add floating crystals around the monolith
    const crystalCount = 8;
    for (let i = 0; i < crystalCount; i++) {
      const crystalGeometry = new THREE.OctahedronGeometry(0.2);
      const crystalMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.6,
      });
      const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);

      const angle = (i / crystalCount) * Math.PI * 2;
      const radius = 1.5;
      crystal.position.x = Math.cos(angle) * radius;
      crystal.position.z = Math.sin(angle) * radius;
      crystal.position.y = Math.random() * 6 - 3;

      this.mesh.add(crystal);
    }

    // Add the monolith to the group
    this.mesh.add(monolith);

    // Position the entire group
    this.mesh.position.y = 4;

    // Start the animation
    this.animate();
  }

  private generateTentaclePath(length: number): THREE.Vector3[] {
    const points: THREE.Vector3[] = [];
    const segments = 15;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      // Create more complex spiral with breathing motion
      const angle = t * Math.PI * 3; // More twists
      const radius = 0.8 + t * 1.2; // Gradually increase radius more

      const x = Math.cos(angle) * radius;
      const y = -length * t;
      const z = Math.sin(angle) * radius;

      points.push(new THREE.Vector3(x, y, z));
    }

    return points;
  }

  animate() {
    const animate = () => {
      requestAnimationFrame(animate);

      const time = performance.now() * 0.001;

      // Update all materials
      this.mesh.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          if (
            child.material instanceof THREE.ShaderMaterial &&
            "time" in child.material.uniforms
          ) {
            child.material.uniforms.time.value = time;

            // Breathing motion for tentacles
            if (i < this.mesh.children.length - 1) {
              // All except the main body
              const breathingScale = Math.sin(time * 0.5) * 0.3 + 1.0;
              const individualPhase = i * ((Math.PI * 2) / 12); // Distribute phases

              // Complex tentacle motion
              child.scale.setScalar(breathingScale);
              child.position.y = 7.5 + Math.sin(time + individualPhase) * 0.5;

              // Writhing motion
              child.rotation.z = Math.sin(time * 0.7 + individualPhase) * 0.2;
              child.rotation.x = Math.cos(time * 0.5 + individualPhase) * 0.2;

              // Spread/contract motion
              const spread = Math.sin(time * 0.3) * 0.3 + 1;
              const baseRotation = (i / 12) * Math.PI * 2;
              child.position.x = Math.cos(baseRotation) * spread * 1.5;
              child.position.z = Math.sin(baseRotation) * spread * 1.5;
            }
          }
        }
      });

      // Gentle floating motion for the entire structure
      this.mesh.position.y = 4 + Math.sin(time * 0.5) * 0.3;
      this.mesh.rotation.y += 0.001;
    };

    animate();
  }
}
