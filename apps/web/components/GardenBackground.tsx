"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sky, Stars, Cloud } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { colorSets2 } from "../constants/skyColors";
// Add this type declaration before the component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      skyGradientMaterial: any; // Or define proper props interface if needed
      waterMaterial: any;
    }
  }
}

// Add this shader material definition outside the component
const SkyGradientMaterial = shaderMaterial(
  {
    color1: new THREE.Color("#000000"),
    color2: new THREE.Color("#000000"),
    color3: new THREE.Color("#000000"),
    color4: new THREE.Color("#000000"),
    aspectRatio: 1.0,
  },
  // Vertex shader
  /*glsl*/ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Updated Fragment shader for 4 colors
  /*glsl*/ `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    uniform vec3 color4;
    uniform float aspectRatio;
    varying vec2 vUv;

    void main() {
      vec2 center = vec2(0.5, 0.5);
      vec2 normalizedUv = vUv - center;
      normalizedUv.x *= aspectRatio;
      
      float maxDist = distance(vec2(-0.5 * aspectRatio, -0.5), vec2(0.0, 0.0));
      float dist = length(normalizedUv) / maxDist;
      
      // Define three transition points for four colors
      float step1 = 0.23; // First color takes up 15% from center
      float step2 = 0.28;  // Second color takes up next 15%
      float step3 = 0.4;  // Third color takes up next 20%
                         // Fourth color takes up remaining 50%
      
      vec3 color;
      if (dist < step1) {
        color = mix(color1, color2, smoothstep(0.0, step1, dist));
      } else if (dist < step2) {
        color = mix(color2, color3, smoothstep(step1, step2, dist));
      } else if (dist < step3) {
        color = mix(color3, color4, smoothstep(step2, step3, dist));
      } else {
        color = color4;
      }
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ SkyGradientMaterial });

// Add this new shader material definition next to the SkyGradientMaterial
const WaterMaterial = shaderMaterial(
  {
    time: 0,
    color1: new THREE.Color("#000000"),
    color2: new THREE.Color("#000000"),
    color3: new THREE.Color("#000000"),
  },
  // Vertex shader
  /*glsl*/ `
    varying vec2 vUv;
    varying float vElevation;
    uniform float time;

    //	Classic Perlin 3D Noise 
    //	by Stefan Gustavson
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

    float cnoise(vec3 P){
      vec3 Pi0 = floor(P); // Integer part for indexing
      vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
      Pi0 = mod(Pi0, 289.0);
      Pi1 = mod(Pi1, 289.0);
      vec3 Pf0 = fract(P); // Fractional part for interpolation
      vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;

      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);

      vec4 gx0 = ixy0 / 7.0;
      vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);

      vec4 gx1 = ixy1 / 7.0;
      vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);

      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;

      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);

      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
      return 2.2 * n_xyz;
    }

    void main() {
      vUv = uv;
      
      vec3 pos = position;
      float noiseFreq = 1.5;
      float noiseAmp = 0.15;
      vec3 noisePos = vec3(pos.x * noiseFreq + time, pos.y * noiseFreq + time, time);
      pos.z += cnoise(noisePos) * noiseAmp;
      vElevation = pos.z;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader
  /*glsl*/ `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    uniform float time;
    
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      float mixStrength = (vElevation + 0.15) * 5.0;
      vec3 color = mix(color1, color2, vUv.y);
      color = mix(color, color3, mixStrength);
      
      // Add shimmer effect
      float shimmer = sin(vUv.x * 10.0 + time) * sin(vUv.y * 10.0 + time) * 0.1;
      color += shimmer;

      gl_FragColor = vec4(color, 0.8);
    }
  `
);

extend({ WaterMaterial });

// Add this new component before GardenBackground
function AnimatedWater({
  sky1,
  sky2,
  sky3,
  sky4,
}: {
  sky1: string;
  sky2: string;
  sky3: string;
  sky4: string;
}) {
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (waterRef.current) {
      // @ts-ignore - material type is custom
      waterRef.current.material.uniforms.time.value =
        clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
      <planeGeometry args={[30, 30, 32, 32]} />
      <waterMaterial
        color1={new THREE.Color(sky1).multiplyScalar(1.2)}
        color2={new THREE.Color(sky2).multiplyScalar(1.1)}
        color3={new THREE.Color(sky3)}
        color4={new THREE.Color(sky4)}
        transparent
      />
    </mesh>
  );
}

export function GardenBackground() {
  const getTimeBasedColors = (): {
    sky1: string;
    sky2: string;
    sky3: string;
    sky4: string;
    ground: string;
  } => {
    const hour = new Date().getHours();

    const timeSlot = Math.floor(hour / 2) % 12;

    // Base green color for ground
    const baseGround = "#22D91E";

    // Updated color combinations for three-color gradients

    const colors = colorSets2[timeSlot]!;

    // Blend sky colors with ground
    const skyColor = new THREE.Color(colors.sky2);
    const groundColor = new THREE.Color(colors.ground);
    const blendedColor = new THREE.Color(
      groundColor.r * 0.7 + skyColor.r * 0.3,
      groundColor.g * 0.8 + skyColor.g * 0.2,
      groundColor.b * 0.7 + skyColor.b * 0.3
    );

    return {
      ...colors,
      ground: `#${blendedColor.getHexString()}`,
    };
  };

  const { sky1, sky2, sky3, sky4, ground } = getTimeBasedColors();
  const groundRef = useRef<THREE.Mesh>(null);

  // Add this function at the start of the component
  const getMountainHeight = (index: number): number => {
    // Using a simple sine wave for more natural-looking variation
    return 12 + Math.sin(index * 0.5) * 3;
  };

  const getMountainWidth = (index: number): number => {
    // Using cosine for width variation that complements the height
    return 12 + Math.cos(index * 0.5) * 2;
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    >
      <Canvas camera={{ position: [0, 20, 35], fov: 75 }}>
        <fog
          attach="fog"
          args={[sky3, 15, 50]} // color, near, far
        />
        <fogExp2
          attach="fog"
          args={[sky3, 0.02]} // color, density
        />

        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />

        {/* Sky */}
        <mesh position={[0, 0, -100]} scale={[200, 200, 1]}>
          <planeGeometry />
          <skyGradientMaterial
            color1={new THREE.Color(sky1)}
            color2={new THREE.Color(sky2)}
            color3={new THREE.Color(sky3)}
            color4={new THREE.Color(sky4)}
            aspectRatio={window.innerWidth / window.innerHeight}
          />
        </mesh>
        <Stars radius={100} depth={50} count={5000} factor={4} />

        {/* Clouds */}
        <Cloud position={[-4, 15, -10]} speed={0.2} opacity={0.5} />
        <Cloud position={[4, 12, -8]} speed={0.2} opacity={0.5} />

        {/* Replace existing ground and grass with new terrain */}
        <group position={[0, -2, 0]}>
          {/* Base terrain */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100, 100, 64, 64]} />
            <meshStandardMaterial
              color={ground}
              roughness={1}
              metalness={0}
              displacementScale={8}
            >
              {/* You might want to add a displacement map texture here later */}
            </meshStandardMaterial>
          </mesh>

          {/* Replace the water mesh with the new component */}
          <AnimatedWater sky1={sky1} sky2={sky2} sky3={sky3} sky4={sky4} />

          {/* Mountain ring - updated with opening at front */}
          <group>
            {Array.from({ length: 16 }).map((_, i) => {
              // Adjust angle range to leave an opening at the front
              // Skip mountains in the front 90-degree arc (-45° to +45°)
              const angle = (i / 16) * Math.PI * 2 - Math.PI / 2; // Start from -90°

              // Skip mountains in the front opening
              if (angle > -Math.PI * 0.75 && angle < -Math.PI * 0.25) {
                return null;
              }

              const radius = 25;
              const x = Math.cos(angle) * radius;
              const z = Math.sin(angle) * radius;
              const height = getMountainHeight(i);
              const width = getMountainWidth(i);

              return (
                <mesh
                  key={i}
                  position={[x, height / 2, z]}
                  rotation={[0, angle + Math.PI, 0]}
                >
                  <cylinderGeometry
                    args={[width * 0.5, width, height, 8, 4, false]}
                  />
                  <meshStandardMaterial
                    color={ground}
                    roughness={1}
                    metalness={0}
                  />
                </mesh>
              );
            })}
          </group>
        </group>

        {/* Adjust lighting for better terrain visibility */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      </Canvas>
    </div>
  );
}
