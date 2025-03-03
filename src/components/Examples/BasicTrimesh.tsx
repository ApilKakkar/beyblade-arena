import { useMemo } from "react";
import { RigidBody, TrimeshCollider } from "@react-three/rapier";
import * as THREE from "three";

export default function BasicTrimesh() {
    const vertices = useMemo(
      () => [
        -15, 8, -15,   -5, 4, -15,    5, 4, -15,   15, 8, -15,
        -15, 4, -5,     -5, 0, -5,  5, 0, -5,  15, 4, -5,
        -15, 4, 5,      -5, 0, 5,   5, 0, 5,   15, 4, 5,
        -15, 8, 15,    -5, 4, 15,     5, 2, 15,     15, 8, 15
      ].map(value => value * 10),
      []
    );
  
    const indices = useMemo(() => [
      0, 1, 5,  0, 5, 4,  
      1, 2, 6,  1, 6, 5,  
      2, 3, 7,  2, 7, 6,  
  
      4, 5, 9,  4, 9, 8,  
      5, 6, 10, 5, 10, 9,  
      6, 7, 11, 6, 11, 10, 
  
      8, 9, 13, 8, 13, 12, 
      9, 10, 14, 9, 14, 13,
      10, 11, 15, 10, 15, 14
    ], []);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3)); // 3 values per vertex
        geo.setIndex(indices);
        geo.computeVertexNormals(); // Smooth shading
        return geo;
    }, [vertices, indices]);
    
    return (
      <RigidBody type="fixed" colliders={false}>
        <TrimeshCollider args={[vertices, indices]} />
        <mesh geometry={geometry}>
            <meshStandardMaterial side={THREE.DoubleSide} color="greenyellow" metalness={0.6} roughness={0.5}/>
        </mesh>
      </RigidBody>
    );
}