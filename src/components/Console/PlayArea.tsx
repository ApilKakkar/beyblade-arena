import { PivotControls } from "@react-three/drei"
import { CapsuleCollider, ConvexHullCollider, Physics, RapierRigidBody, RigidBody } from '@react-three/rapier'
import { useRef, useEffect, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three";

export default function PlayArea(){

    return (
        <>
            <Physics>
                <BeybladeBowl />
                <PivotControls depthTest={false} scale={2}>
                    <Beyblade position={[0,100,10]} color={"skyblue"}/>
                    <Beyblade position={[10,100,10]} color={"white"}/>
                    <Beyblade position={[0,100,-10]} color={"white"}/>
                    <Beyblade position={[-10,100,10]} color={"green"}/>
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
                <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
                    <latheGeometry args={[points, 30]} />
                    <meshStandardMaterial color="grey" side={THREE.DoubleSide} metalness={0.3} roughness={0.7} />
                </mesh>
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

    const points = useMemo(() => {
        const geometry = new THREE.ConeGeometry(0.5, 1, 32);
        console.log([Array.from(geometry.attributes.position.array)]);
        return [Array.from(geometry.attributes.position.array)]; // Wrap in an array
    }, []);

    // One-time spin effect on click
    const try_spin = () => {
        if (beyRef.current) {
            // Apply torque impulse to make the Beyblade spin
            beyRef.current.applyTorqueImpulse({ x: 0, y: 10000, z: 0 }, true);
            beyRef.current.applyImpulse({ x: 400, y: 0, z: 0 }, true);
        }
    };

    return (
            <RigidBody ref={beyRef} type="dynamic" position={position} rotation={[0, 0, 0]} angularDamping={0.2} scale={[2,2,2]}>
                <group onClick={try_spin} >
                        <mesh scale={[1,2,1]}>
                            <boxGeometry args={[1, 1, 1]}/>
                            <meshStandardMaterial color={color} />
                        </mesh>
                        <mesh scale={[1,2,1]} rotation={[0,0,Math.PI/2]}>
                            <boxGeometry args={[1, 1, 1]}/>
                            <meshStandardMaterial color={color} />
                        </mesh>
                    <CapsuleCollider args={[1, 0.5]}/>
                    <CapsuleCollider args={[1, 0.5]} rotation={[0,0,Math.PI/2]}/>
                </group>
            </RigidBody>
    );
}
