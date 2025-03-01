import { HeightfieldCollider, RigidBody } from '@react-three/rapier';
import { useMemo } from 'react';


export default function HeightField() {
    // Ensure height values are valid
    const heights = useMemo(() => [
        1, 1, 1, 1, 1,
        1, 0.8, 0.6, 0.8, 1,
        1, 0.6, 0.3, 0.6, 1,
        1, 0.8, 0.6, 0.8, 1,
        1, 1, 1, 1, 1
    ], []);

    console.log("Heightfield values:", heights); // Debugging log

    return (
        <RigidBody type="fixed">
            {/* Try adjusting scale to match the grid size */}
            <HeightfieldCollider args={[5, 5, Array.from(new Float32Array(25).fill(1)), { x: 5, y: 2, z: 5 }]} />
            
            {/* Visual Debug Mesh */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[5, 5]} />
                <meshStandardMaterial color="gray" wireframe />
            </mesh>
        </RigidBody>
    );
}