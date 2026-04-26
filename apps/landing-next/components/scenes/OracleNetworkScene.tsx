'use client';

import type { Locale } from '@/lib/i18n';
import { getDict } from '@/lib/i18n';
import { Html, RoundedBox } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const PRIMARY = '#0052FF';
const NEUTRAL = '#FFFFFF';
const BORDER = '#E2E8F0';
const TEXT = '#0F172A';

function NodeBox({
  position,
  label,
  filled,
}: { position: [number, number, number]; label: string; filled?: boolean }) {
  return (
    <group position={position}>
      <RoundedBox args={[1.4, 0.5, 0.1]} radius={0.05}>
        <meshStandardMaterial color={filled ? PRIMARY : NEUTRAL} />
      </RoundedBox>
      {!filled && (
        <RoundedBox args={[1.42, 0.52, 0.09]} radius={0.05}>
          <meshBasicMaterial color={BORDER} wireframe />
        </RoundedBox>
      )}
      <Html center distanceFactor={6} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            color: filled ? '#FFFFFF' : TEXT,
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}

function PulsingEdge({
  from,
  to,
  delay,
}: { from: [number, number, number]; to: [number, number, number]; delay: number }) {
  const dotRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!dotRef.current) return;
    const t = ((state.clock.elapsedTime + delay) % 3) / 3; // loop every 3s
    dotRef.current.position.x = from[0] + (to[0] - from[0]) * t;
    dotRef.current.position.y = from[1] + (to[1] - from[1]) * t;
    dotRef.current.position.z = from[2] + (to[2] - from[2]) * t;
    const mat = dotRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = Math.sin(t * Math.PI);
  });

  // Static line
  const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
  const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <>
      <line>
        <primitive object={lineGeom} attach="geometry" />
        <lineBasicMaterial color={PRIMARY} opacity={0.4} transparent />
      </line>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color={PRIMARY} transparent />
      </mesh>
    </>
  );
}

export default function OracleNetworkScene({ locale }: { locale: Locale }) {
  const t = getDict(locale).howItWorks.nodes;

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ height: '320px', width: '100%' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 4, 4]} intensity={0.6} />

      {/* 3 oracles on the left */}
      <NodeBox position={[-3.5, 1.3, 0]} label={t.chainlink} />
      <NodeBox position={[-3.5, 0, 0]} label={t.pyth} />
      <NodeBox position={[-3.5, -1.3, 0]} label={t.redstone} />

      {/* Sentinel hub center */}
      <NodeBox position={[0, 0, 0]} label={t.sentinel} filled />

      {/* AlertRegistry right */}
      <NodeBox position={[3.5, 0, 0]} label={t.registry} />

      {/* Animated edges */}
      <PulsingEdge from={[-2.8, 1.3, 0]} to={[-0.7, 0, 0]} delay={0} />
      <PulsingEdge from={[-2.8, 0, 0]} to={[-0.7, 0, 0]} delay={1} />
      <PulsingEdge from={[-2.8, -1.3, 0]} to={[-0.7, 0, 0]} delay={2} />
      <PulsingEdge from={[0.7, 0, 0]} to={[2.8, 0, 0]} delay={1.5} />
    </Canvas>
  );
}
