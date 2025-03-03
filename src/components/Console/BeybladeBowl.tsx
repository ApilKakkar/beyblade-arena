import { HeightfieldCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import * as THREE from "three";

export default function BeybladeBowl() {
    const gridSize = 32; // Increase resolution
    const maxHeight = 1; // Edge height
    const minHeight = 0; // Center depth
    const scale = { x: 150, y: 45, z: 150 }; // Same as HeightfieldCollider

    // Generate heightmap data
    const heights = useMemo(() => {
        const newHeights = [];
        const center = (gridSize - 1) / 2;

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const distance = Math.sqrt(Math.pow(x - center, 2) + Math.pow(y - center, 2));
                const normalizedDistance = distance / center;
                const height = maxHeight - (maxHeight - minHeight) * Math.pow(normalizedDistance, 2);
                newHeights.push(Math.max(height, minHeight));
            }
        }
        return newHeights;
    }, []);

    // Generate vertices and indices for the mesh
    const { vertices, indices } = useMemo(() => {
        const verts = [];
        const idxs = [];

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const height = heights[y * gridSize + x];
                const posX = (x / (gridSize - 1) - 0.5) * scale.x;
                const posY = height * scale.y;
                const posZ = (y / (gridSize - 1) - 0.5) * scale.z;

                verts.push(posX, posY, posZ);

                if (x < gridSize - 1 && y < gridSize - 1) {
                    const topLeft = y * gridSize + x;
                    const topRight = y * gridSize + (x + 1);
                    const bottomLeft = (y + 1) * gridSize + x;
                    const bottomRight = (y + 1) * gridSize + (x + 1);

                    idxs.push(topLeft, bottomLeft, topRight);
                    idxs.push(topRight, bottomLeft, bottomRight);
                }
            }
        }

        return { vertices: verts, indices: idxs };
    }, [heights]);

    return (
        <group rotation={[-Math.PI, 0, 0]}>
            {/* Physics Collider */}
            <RigidBody type="fixed">
                <HeightfieldCollider args={[gridSize - 1, gridSize - 1, heights, scale]} />
            </RigidBody>

            {/* Visual Debugging Mesh */}
            <mesh>
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        attach="attributes-position"
                        array={new Float32Array(vertices)}
                        itemSize={3}
                        count={vertices.length / 3}
                    />
                    <bufferAttribute
                        attach="index"
                        array={new Uint16Array(indices)}
                        itemSize={1}
                        count={indices.length}
                    />
                </bufferGeometry>
                <meshStandardMaterial  color="pink" side={THREE.DoubleSide}  />
            </mesh>
        </group>
    );
}