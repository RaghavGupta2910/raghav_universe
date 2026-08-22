import * as THREE from 'three';

export const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uCoefficient;
    uniform float uPower;
    uniform float uAlpha;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 viewVector = normalize(-vPosition);
      float intensity = pow(uCoefficient - max(dot(vNormal, viewVector), 0.0), uPower);
      intensity = clamp(intensity, 0.0, 1.0);
      gl_FragColor = vec4(uColor, intensity * uAlpha);
    }
  `,
};

export function createAtmosphereMaterial(
  color: string,
  coefficient: number = 0.85,
  power: number = 2.5,
  alpha: number = 0.85
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: AtmosphereShader.vertexShader,
    fragmentShader: AtmosphereShader.fragmentShader,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uCoefficient: { value: coefficient },
      uPower: { value: power },
      uAlpha: { value: alpha },
    },
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  });
}
