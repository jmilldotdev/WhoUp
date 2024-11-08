"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Water } from "three/examples/jsm/objects/Water.js";
import { QuantumMonolith } from "./QuantumMonolith";
import { useRouter } from "next/navigation";
import { CircularBroadcastButton } from "@/components/CircularBroadcastButton";
import { GiftButton } from "@/components/GiftButton";
import { WritingButton } from "@/components/WritingButton";
import { useUser } from "@/providers/UserProvider";
import { GardenFlowers } from "@/components/GardenFlowers";
import { useBroadcast } from "@/contexts/BroadcastContext";
import { getCurrentBroadcast, closeBroadcast } from "@/actions/broadcasts";
import { createGardenObject } from "@/actions/gardenObjects";
import { toast } from "sonner";

interface Friend {
  name: string;
  phone: string;
}

export default function ZenGardenScene() {
  const [fadeOut, setFadeOut] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const { currentBroadcast, setCurrentBroadcast } = useBroadcast();
  const mountRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { gardenObjects, refreshGardenObjects } = useUser();
  const { userId } = useUser();
  let glowTarget = 0;
  let currentGlow = 0;
  const glowSpeed = 0.1; // Adjust this value to control transition speed

  const [showFlowerMessage, setShowFlowerMessage] = useState(false);
  const [flowerMessage, setFlowerMessage] = useState("");

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setFadeOut(true);
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  const handleEndBroadcast = async () => {
    if (!currentBroadcast) {
      console.error("No current broadcast to end");
      return;
    }

    try {
      const result = await createGardenObject(
        userId || "",
        currentBroadcast.topic
      );
      toast.success(`Created new ${result.object_component_type} with topic!`);

      await refreshGardenObjects();

      await closeBroadcast(currentBroadcast.id);
      console.log("Broadcast ended successfully");
      setCurrentBroadcast(null);
    } catch (error) {
      toast.error("Error ending broadcast or creating garden object");
      console.error("Error ending broadcast:", error);
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xfae1c7, 0.007);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Sun
    const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 20, -30);
    scene.add(sun);

    // Replace the Sun halo section with this:
    const createSunRays = () => {
      const rays: THREE.Mesh[] = [];
      const rayCount = 32;

      for (let i = 0; i < rayCount; i++) {
        // Create a gradient texture for the ray
        const gradientCanvas = document.createElement("canvas");
        gradientCanvas.width = 256;
        gradientCanvas.height = 1;
        const context = gradientCanvas.getContext("2d");

        if (context) {
          const gradient = context.createLinearGradient(
            0,
            0,
            gradientCanvas.width,
            0
          );
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.24)"); // More opaque at center
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // Fully transparent at edges
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
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(0xffa07a) },
        color2: { value: new THREE.Color(0x87ceeb) },
        fogColor: { value: new THREE.Color(0xfae1c7) },
        fogDensity: { value: 0.015 },
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
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);

    // Glowing crystal effect
    const crystalGeometry = new THREE.BufferGeometry();
    const crystalMaterial = new THREE.PointsMaterial({
      color: 0xfcf8f7,
      size: 0.5,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const crystalPositions = [];
    for (let i = 0; i < 100; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = Math.random() * 10 + 5;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      crystalPositions.push(x, y, z);
    }

    crystalGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(crystalPositions, 3)
    );

    const crystals = new THREE.Points(crystalGeometry, crystalMaterial);
    crystals.position.copy(sun.position);
    scene.add(crystals);

    // Floating stars
    const starCount = 200;
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Distribute stars in a larger volume
      starPositions[i3] = (Math.random() - 0.5) * 200; // x
      starPositions[i3 + 1] = Math.random() * 100 + 10; // y
      starPositions[i3 + 2] = (Math.random() - 0.5) * 200; // z
      starSizes[i] = Math.random() * 2 + 1;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );
    starGeometry.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));

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
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        "https://threejs.org/examples/textures/waternormals.jpg",
        (texture) => {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xf3ebdc,
      waterColor: 0x636cba,
      distortionScale: 3.7,
      fog: true,
    });
    water.rotation.x = -Math.PI / 2;
    water.position.y = -5;
    scene.add(water);

    // Add this mock friend data
    const friends: Friend[] = [
      { name: "Emma Wilson", phone: "555-0101" },
      { name: "Liam Chen", phone: "555-0102" },
      { name: "Sophia Patel", phone: "555-0103" },
      { name: "Noah Kim", phone: "555-0104" },
      { name: "Olivia Santos", phone: "555-0105" },
      { name: "Lucas Singh", phone: "555-0106" },
      { name: "Ava Johnson", phone: "555-0107" },
      { name: "Ethan Lee", phone: "555-0108" },
      { name: "Isabella Wang", phone: "555-0109" },
      { name: "Mason Garcia", phone: "555-0110" },
    ];

    // Modify the rock shader material to include glow
    const rockShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorShift: { value: new THREE.Vector3(0.5, 0.5, 0.5) },
        glowIntensity: { value: 0.0 }, // Add this for hover effect
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
        uniform float glowIntensity;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vec3 normal = normalize(vNormal);
          float fresnel = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.0);
          vec3 baseColor = vec3(0.2, 0.2, 0.2);
          
          // Rainbow color calculation
          vec3 rainbow = 0.5 + 0.5 * cos(time * 0.2 + vPosition.y + vec3(0.0, 2.0, 4.0));
          
          // Mix colors based on fresnel effect
          vec3 finalColor = mix(baseColor, rainbow, fresnel * 0.7);
          
          // Add metallic sheen
          float metallic = pow(fresnel, 3.0) * 0.8;
          finalColor += vec3(metallic);
          
          // Add inner glow
          vec3 glowColor = vec3(1.0, 0.8, 0.4); // Warm glow color
          finalColor += glowColor * glowIntensity * (1.0 - fresnel);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    // Modified createRock function
    const createRock = (friend: Friend, index: number) => {
      const rockGeometry = new THREE.DodecahedronGeometry(
        Math.random() * 1 + 1.5
      );
      const rockMaterial = rockShaderMaterial.clone();
      const rock = new THREE.Mesh(rockGeometry, rockMaterial);

      // Position rocks in a circle
      const angle = (index / friends.length) * Math.PI * 2;
      const radius = 15;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      rock.position.set(x, Math.random() * 2 - 3, z);

      rock.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      // Add friend data to the rock object
      (rock as any).userData = { friend };

      scene.add(rock);
      return rock;
    };

    // Create rocks based on friends data
    const rocks = friends.map((friend, index) => createRock(friend, index));

    // Update the createNameSprite function to add text glow
    const createNameSprite = (text: string) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 512;
      canvas.height = 128;

      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Add glow effect
        context.shadowColor = "rgba(255, 255, 255, 0.8)";
        context.shadowBlur = 20;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        // First pass - draw the glow
        context.font = "Bold 48px Arial";
        context.fillStyle = "rgba(255, 255, 255, 0.5)";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        // Second pass - draw the text
        context.shadowColor = "rgba(0, 0, 0, 0.5)";
        context.shadowBlur = 4;
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.fillStyle = "white";
        context.fillText(text, canvas.width / 2, canvas.height / 2);
      }

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false,
        sizeAttenuation: false,
      });

      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(0.5, 0.125, 1);
      sprite.renderOrder = 999999;
      return sprite;
    };

    // Add hover interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredRock: THREE.Mesh | null = null;
    let nameSprite: THREE.Sprite | null = null;

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(rocks);

      // Reset glow target when not hovering and clear previous hover
      if (intersects.length === 0) {
        glowTarget = 0;
        if (
          hoveredRock &&
          hoveredRock.material instanceof THREE.ShaderMaterial
        ) {
          if (hoveredRock.material.uniforms.glowIntensity) {
            hoveredRock.material.uniforms.glowIntensity.value = 0; // Immediately reset glow
          }
        }
        hoveredRock = null;
        if (nameSprite) {
          nameSprite.material.opacity = 0;
        }
      }

      // Set new hover state only if intersecting a different rock
      if (intersects.length > 0 && intersects[0]?.object) {
        const newHoveredRock = intersects[0].object as THREE.Mesh;
        if (newHoveredRock !== hoveredRock) {
          // Reset previous rock's glow if exists
          if (
            hoveredRock &&
            hoveredRock.material instanceof THREE.ShaderMaterial &&
            hoveredRock.material.uniforms.glowIntensity
          ) {
            hoveredRock.material.uniforms.glowIntensity.value = 0;
          }
          hoveredRock = newHoveredRock;
          glowTarget = 0.5;

          // Show name sprite
          const friend = (hoveredRock as any).userData.friend;
          if (!nameSprite) {
            nameSprite = createNameSprite(friend.name);
            scene.add(nameSprite);
          }

          nameSprite.material.map = createNameSprite(friend.name).material.map;
          nameSprite.position.set(0, 0, -1);
          nameSprite.position.unproject(camera);
          nameSprite.quaternion.copy(camera.quaternion);

          // Fade in the name sprite
          nameSprite.material.opacity = 1;
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    // Create alien flowers
    const gardenFlowers = new GardenFlowers({
      scene,
      camera,
      gardenObjects,
      onFlowerClick: (text) => {
        setFlowerMessage(text);
        setShowFlowerMessage(true);
      },
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 20, 10);
    scene.add(directionalLight);

    // Camera position
    camera.position.set(0, 10, 30);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      // Interpolate glow value
      currentGlow += (glowTarget - currentGlow) * glowSpeed;

      // Apply interpolated glow to hovered rock
      if (
        hoveredRock &&
        hoveredRock.material instanceof THREE.ShaderMaterial &&
        hoveredRock.material.uniforms?.glowIntensity
      ) {
        hoveredRock.material.uniforms.glowIntensity.value = currentGlow;
      }

      // Animate sun rays
      sunRays.forEach((ray, index) => {
        ray.rotation.z += 0.0005;
        const baseScale = 1 + Math.sin(Date.now() * 0.0005) * 0.1;
        ray.scale.set(baseScale, baseScale, 1);
      });

      // Update rock shader time uniform
      rocks.forEach((rock) => {
        if (rock.material instanceof THREE.ShaderMaterial) {
          const timeUniform = rock.material.uniforms.time;
          if (timeUniform) {
            timeUniform.value += 0.01;
          }
        }
      });

      // Update water
      if (water.material.uniforms["time"]) {
        water.material.uniforms["time"].value += 1.0 / 120.0;
      }

      // Animate stars
      if (
        stars.material instanceof THREE.ShaderMaterial &&
        "time" in stars.material.uniforms
      ) {
        stars.material.uniforms.time.value = Date.now();
      }

      // Animate alien flowers
      gardenFlowers.animate(Date.now());

      // Update name sprite orientation
      if (nameSprite) {
        nameSprite.quaternion.copy(camera.quaternion);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Create and add the monolith to the scene
    const monolith = new QuantumMonolith();
    scene.add(monolith.mesh);

    // Add click handler for monolith
    const handleClick = (event: MouseEvent) => {
      event.stopPropagation(); // Prevent the event from bubbling up
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(monolith.mesh, true);

      if (intersects.length > 0) {
        setShowButtons((prev) => !prev);
      }
    };

    // Add cursor change on hover for monolith
    const handleMouseOver = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(monolith.mesh, true);

      if (intersects.length > 0) {
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("mousemove", handleMouseOver);

    // Fetch the current broadcast topic from the database
    const fetchBroadcast = async () => {
      if (!userId) {
        console.error("User ID is not available");
        return;
      }

      try {
        const broadcast = await getCurrentBroadcast(userId);
        if (broadcast) {
          console.log("Fetched broadcast:", broadcast);
          // Update the state with the fetched broadcast
          setCurrentBroadcast(broadcast);
        } else {
          console.log("No active broadcast found");
        }
      } catch (error) {
        console.error("Error fetching broadcast:", error);
      }
    };

    fetchBroadcast();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mousemove", handleMouseOver);
      gardenFlowers.cleanup();
    };
  }, [gardenObjects, userId]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />

      {/* Display current broadcast message */}
      {currentBroadcast && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "20px",
            zIndex: 2000,
            width: "90%",
            maxWidth: "600px",
            boxShadow:
              "0 0 10px rgba(0, 0, 0, 0.1), 0 0 15px 5px rgba(255, 255, 255, 0.6)",
            color: "white",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "60px", // Adjust size as needed
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.8)", // Glow effect
                marginBottom: "10px", // Space between image and text
              }}
            >
              <img
                src="/broadcast.png"
                className="w-10 h-10"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))",
                }}
              />
            </div>
            <h2 className="font-mono text-xs">Now Broadcasting</h2>
          </div>
          <p className="font-mono mt-1">{currentBroadcast.topic}</p>
          {currentBroadcast && (
            <button
              onClick={handleEndBroadcast}
              className="bg-white text-black font-mono text-xs px-2 transition duration-300 ease-in-out  hover:shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            >
              End Broadcast
            </button>
          )}
        </div>
      )}

      {/* Button container */}
      {showButtons && (
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <CircularBroadcastButton />
          <GiftButton />
          <WritingButton />
        </div>
      )}

      <div onClick={handleHomeClick}>
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            width: "40px",
            height: "40px",
            backgroundColor: "white",
            borderRadius: "50%",
            opacity: 0.5,
            boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.8)",
            transition: "opacity 0.3s, transform 0.3s",
            animation: "pulse 1.5s infinite",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.5";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <img
            src="/rock.png"
            alt="Obsidian Rock"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        </div>
      </div>

      {showFlowerMessage && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "20px",
            zIndex: 1000,
            width: "90%",
            maxWidth: "600px",
            boxShadow:
              "0 0 10px rgba(0, 0, 0, 0.1), 0 0 15px 5px rgba(255, 255, 255, 0.6)",
          }}
        >
          <h2 className="font-mono text-white">Memory</h2>
          <p className="font-mono text-white mt-4">{flowerMessage}</p>
          <button
            onClick={() => setShowFlowerMessage(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Add fade transition overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "white",
          opacity: fadeOut ? 1 : 0,
          pointerEvents: fadeOut ? "all" : "none",
          transition: "opacity 1s ease-in-out",
          zIndex: 9999,
        }}
      />

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
