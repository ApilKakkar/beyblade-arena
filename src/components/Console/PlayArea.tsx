import { PivotControls } from "@react-three/drei"
import { Physics, RapierRigidBody, RigidBody } from '@react-three/rapier'
import { useRef, useEffect, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three";

export default function PlayArea(){

    return (
        <>
            <Physics>
                <BeybladeBowl />
                
                <PivotControls depthTest={false} scale={2}>
                    <Beyblade position={[50,100,0]} color={"purple"}/>
                    <Beyblade position={[0,100,0]} color={"skyblue"}/>
                    <Beyblade position={[0,100,50]} color={"orange"}/>
                </PivotControls>
            </Physics>

        </>
    )
}



function BeybladeBowl() {
    // Define the bowl shape with a smooth bottom
    const points = [];
    for (let i = 0; i < 10; i++) {
        const x = (Math.sin( i * 0.2 ) * 10 + 5) * 5; // Controls the radius
        const y = ( i ) * 4; // Controls the depth
        points.push(new THREE.Vector2(x, y));
    }
  
    return (
        <>  
            <RigidBody colliders={"trimesh"} type="fixed" restitution={0} friction={1} rotation-z={0}>
                {/* <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
                    <latheGeometry args={[points, 30]} />
                    <meshStandardMaterial color="grey" side={THREE.DoubleSide} metalness={0.3} roughness={0.7} />
                </mesh> */}
                <mesh rotation={[0, 0, 0]} position={[0, 0, 0]} scale={[120, 1, 120]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="red" metalness={0.3} roughness={0.7} />
                </mesh>
            </RigidBody>
        </>
    );
}

function Beyblade({ position = [0, 2, 0], color = "greenyellow" }) {
    const beyRef = useRef<RapierRigidBody>(null);

    // One-time spin effect on click
    useFrame(() => {
        if (beyRef.current) {
            console.log(color, "spinning");
            // Set constant angular velocity instead of impulse for smooth spinning
            // beyRef.current.setAngvel({ x: 0, y: 20, z: 0 }, true); 

            // Give a random outward push to start movement
            // beyRef.current.applyImpulse(
            //     { x: (Math.random() - 0.5) * 20, y: 0, z: (Math.random() - 0.5) * 20 },
            //     true
            // );
        }
    });

    return (
        <RigidBody colliders={"trimesh"} ref={beyRef} position={position} restitution={0} friction={1} angularDamping={0.2} scale={[2, 2, 2]}>
            <group>
                {/* Cone Base */}
                <mesh position={[0, -0.5, 0]} rotation={[Math.PI, 0, 0]}>
                    <coneGeometry args={[1.5, 1.5, 16]} /> {/* Base is wider for stability */}
                    <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
                </mesh>

                {/* Cylinder Handle on top */}
                <mesh position={[0, 0.8, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.4, 16]} />
                    <meshStandardMaterial color="white" metalness={0.6} roughness={0.2} />
                </mesh>

                {/* Torus Ring around the cone base */}
                <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[1.3, 0.2, 8, 16]} />
                    <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
                </mesh>

                {/* Spinning Tip */}
                <mesh position={[0, -1.1, 0]}>
                    <sphereGeometry args={[0.2, 8, 8]} /> 
                    <meshStandardMaterial color="silver" metalness={1} roughness={0.1} />
                </mesh>
            </group>
        </RigidBody>
    );
}