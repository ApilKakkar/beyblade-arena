import { PivotControls } from "@react-three/drei"
import { BallCollider, CapsuleCollider, ConvexHullCollider, CylinderCollider, HeightfieldCollider, Physics, RapierCollider, RapierRigidBody, RigidBody } from '@react-three/rapier'
import { useRef, useEffect, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three";

export default function PlayArea(){

    return (
        <>
            <Physics >
                <BasicHeightfield />
                {/* <PivotControls depthTest={false} scale={2}>
                </PivotControls> */}
                <Beyblade position={[0,0,0]} color={"skyblue"}/>
            </Physics>

        </>
    )
}

function BasicHeightfield() {
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
            <HeightfieldCollider args={[5, 5, heights, { x: 5, y: 2, z: 5 }]} />
            
            {/* Visual Debug Mesh */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[5, 5]} />
                <meshStandardMaterial color="gray" wireframe />
            </mesh>
        </RigidBody>
    );
}

function Beyblade({ position = [0, 2, 0], color = "greenyellow" }) {
    const beyRef = useRef<RapierRigidBody>(null);
    const spineRef = useRef<RapierCollider>(null);
    const upperRingRef = useRef<RapierCollider>(null);
    const lowerRingRef = useRef<RapierCollider>(null);

    // One-time spin effect on click
    const try_spin = () => {
        if (beyRef.current) {
            // Get Beyblade's current rotation quaternion
            const rotation = beyRef.current.rotation();
    
            // Create a local Y-axis vector (this is the correct "up" direction for spinning)
            const localUp = new THREE.Vector3(0, 1, 0);
    
            // Rotate the local up vector using the Beyblade's quaternion
            localUp.applyQuaternion(new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w));
    
            // Apply torque impulse in the rotated up direction
            beyRef.current.applyTorqueImpulse({ 
                x: localUp.x * 1000, 
                y: localUp.y * 1000, 
                z: localUp.z * 1000 
            }, true);
    
            // Apply movement impulse along the same rotated axis
            beyRef.current.applyImpulse({ 
                x: localUp.x * 100, 
                y: 100, 
                z: localUp.z * 100 
            }, true);
        }
    };

    useEffect(() => {
        if (beyRef.current && spineRef.current && lowerRingRef.current && upperRingRef.current) {

            spineRef.current.setMass(1); // Lighter center
            lowerRingRef.current.setMass(4); // More weight outward
            upperRingRef.current.setMass(5); // Heaviest at the top for stability

            // ✅ Shift Center of Mass for Natural Tilting
            // spineRef.current.setMassProperties({
            //     centerOfMass: { x: 0, y: -0.3, z: 0 },
            //     principalInertia: { x: 0.1, y: 0.1, z: 0.1 },
            // });

            // ✅ Fine-tune physics for realistic movement
            beyRef.current.setAngularDamping(0.03);
            beyRef.current.setLinearDamping(0.08);
        }
    }, []);

    return (
            <RigidBody ref={beyRef} type="dynamic" position={[0,0,0]} rotation={[0, 0, 0]} angularDamping={0.2} scale={[2,2,2]} colliders={false}>
                <group onClick={try_spin} >
                        <mesh scale={[1,2,1]}>
                            <boxGeometry args={[1, 1, 1]}/>
                            <meshStandardMaterial color={color} />
                        </mesh>
                        <mesh scale={[1,1,1]} position={[0,-0.5,0]} rotation={[0,0,Math.PI]}>
                            <coneGeometry args={[2, 2, 32]}/>
                            <meshStandardMaterial color={color} />
                        </mesh>
                    <CapsuleCollider ref={spineRef} args={[1, 0.5]}/>
                    <CylinderCollider ref={upperRingRef} args={[0.2, 2]} position={[0,0.25,0]}/>
                    <CylinderCollider ref={lowerRingRef} args={[0.2, 1.5]} position={[0,-0.35,0]}/>
                </group>
            </RigidBody>
    );
}
