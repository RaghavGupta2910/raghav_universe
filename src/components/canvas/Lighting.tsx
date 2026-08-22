'use client';

export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.45} color="#cbd5e1" />
      <directionalLight
        position={[25, 30, 20]}
        intensity={0.8}
        color="#f8fafc"
      />
      <directionalLight
        position={[-20, -15, -10]}
        intensity={0.25}
        color="#38bdf8"
      />
    </>
  );
}
