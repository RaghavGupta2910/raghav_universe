/**
 * GLSL Procedural Shaders for Believable Celestial Bodies
 */

// Cryogenic Algorithmic Ice Planet Shader (World 1: CODE)
export const CodePlanetShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorBase;
    uniform vec3 uColorGlow;
    uniform vec3 uColorAtmosphere;
    uniform float uHovered;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    // Pseudo-random and noise functions
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    // Voronoi / Algorithmic Crystal Lattice
    float voronoi(vec2 p) {
      vec2 n = floor(p);
      vec2 f = fract(p);
      float md = 8.0;
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 g = vec2(float(i), float(j));
          vec2 o = vec2(hash(n + g), hash(n + g + vec2(13.5, 57.2)));
          vec2 r = g + o - f;
          float d = dot(r, r);
          if (d < md) md = d;
        }
      }
      return sqrt(md);
    }

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(-vPosition);

      // Light direction from central star at (0,0,0)
      vec3 lightDir = normalize(-vWorldPosition);
      float NdotL = max(dot(normal, lightDir), 0.0);

      // Day / Night Terminator with soft penumbra
      float terminator = smoothstep(-0.25, 0.35, dot(normal, lightDir));

      // Algorithmic Lattice / Data Fissures
      vec2 uvScaled = vUv * 16.0;
      float lattice = voronoi(uvScaled);
      float fissure = smoothstep(0.18, 0.05, lattice);
      float pulse = sin(uTime * 1.5 + vUv.y * 10.0) * 0.3 + 0.7;

      // Crystalline Ice Surface Texture
      float iceNoise = noise(vUv * 32.0) * 0.25 + noise(vUv * 64.0) * 0.15;
      vec3 iceBase = mix(uColorBase, vec3(0.02, 0.12, 0.25), iceNoise);

      // Specular Glint on Ice
      vec3 halfVector = normalize(lightDir + viewDir);
      float NdotH = max(dot(normal, halfVector), 0.0);
      float specular = pow(NdotH, 48.0) * 0.85 * terminator;

      // Illuminated Fissures (Bioluminescent data flow visible in night side)
      vec3 fissureColor = uColorGlow * fissure * pulse * (1.2 + uHovered * 0.8);

      // Fresnel Atmospheric Edge Glow (Rayleigh scattering)
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
      vec3 rimGlow = uColorAtmosphere * fresnel * 0.9;

      // Composite Surface Shading
      vec3 diffuse = iceBase * (NdotL * 0.85 + 0.15); // Subtle ambient bounce
      vec3 finalColor = diffuse + specular + fissureColor + rimGlow;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

// Generic Celestial Body Shader with Day/Night Terminator and Fresnel
export const CelestialPlanetShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorBase;
    uniform vec3 uColorGlow;
    uniform vec3 uColorAtmosphere;
    uniform float uHovered;
    uniform float uPlanetType; // 0: Build (metallic), 1: Sound (aurora gas), 2: Create (terrestrial), 3: Mindset (obsidian)

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(-vPosition);
      vec3 lightDir = normalize(-vWorldPosition); // Light from origin

      float NdotL = max(dot(normal, lightDir), 0.0);
      float terminator = smoothstep(-0.2, 0.3, dot(normal, lightDir));

      // Surface procedural modulation
      float n1 = noise(vUv * 12.0 + vec2(uTime * 0.02, 0.0));
      float n2 = noise(vUv * 24.0);
      float surfaceTexture = n1 * 0.7 + n2 * 0.3;

      vec3 surfaceColor = mix(uColorBase, uColorGlow * 0.6, surfaceTexture * 0.5);

      // Specular response
      vec3 halfVector = normalize(lightDir + viewDir);
      float specular = pow(max(dot(normal, halfVector), 0.0), 32.0) * 0.6 * terminator;

      // Fresnel Rim Atmosphere
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.8);
      vec3 atmosphere = uColorAtmosphere * fresnel * (0.8 + uHovered * 0.5);

      vec3 diffuse = surfaceColor * (NdotL * 0.8 + 0.12);
      vec3 finalColor = diffuse + specular + atmosphere;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};
