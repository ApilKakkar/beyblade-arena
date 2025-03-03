import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CapsuleCollider, CylinderCollider, RapierRigidBody, RapierCollider } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

enum Controls {
    forward = 'forward',
    back = 'back',
    left = 'left',
    right = 'right',
    jump = 'jump',
}

export default function Beyblade({ position = [0, 2, 0] as [number, number, number]}) {
    const beyRef = useRef<RapierRigidBody>(null);
    const spineRef = useRef<RapierCollider>(null);
    const upperRingRef = useRef<RapierCollider>(null);
    const lowerRingRef = useRef<RapierCollider>(null);

    const colorMap = useLoader(THREE.TextureLoader, "/textures/painted_brick_blue/painted_brick_diff_4kop.jpg");
    const normalMap = useLoader(THREE.TextureLoader, "/textures/painted_brick_blue/painted_brick_nor_gl_4k.jpg");
    const roughnessMap = useLoader(THREE.TextureLoader, "/textures/painted_brick_blue/painted_brick_rough_4k.jpg");
    

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
                x: - localUp.x * 1000, 
                y: - localUp.y * 1000, 
                z: - localUp.z * 1000 
            }, true);
    
            // Apply movement impulse along the same rotated axis
            beyRef.current.applyImpulse({ 
                x: localUp.x * 100, 
                y: 0, 
                z: localUp.z * 100 
            }, true);
        }
    };

    const [sub] = useKeyboardControls<Controls>()

    useEffect(() => {
        // return sub(
        // (state) => state.forward,
        // (pressed) => {
        //     console.log('forward', pressed)
        //     if(beyRef.current){
        //         beyRef.current.applyImpulse({ x: 0, y: 0, z: -100 }, true)
        //     }
        // }
        // )
        return sub((state) => {
            if (!beyRef.current) return;
            if (state.forward) beyRef.current.applyImpulse({ x: 0, y: 0, z: -100 }, true);
            if (state.back) beyRef.current.applyImpulse({ x: 0, y: 0, z: 100 }, true);
            if (state.left) beyRef.current.applyImpulse({ x: -100, y: 0, z: 0 }, true);
            if (state.right) beyRef.current.applyImpulse({ x: 100, y: 0, z: 0 }, true);
            if (state.jump) try_spin(); // **Spin Beyblade on Jump Key**
        });
    }, [])

    

    useFrame(() => {
    // Fetch fresh data from store
        // const pressed = get().back
    })

    useEffect(() => {
        if (beyRef.current && spineRef.current && lowerRingRef.current && upperRingRef.current) {

            spineRef.current.setMass(10); // Lighter center
            lowerRingRef.current.setMass(40); // More weight outward
            upperRingRef.current.setMass(50); // Heaviest at the top for stability

            // ✅ Shift Center of Mass for Natural Tilting
            // spineRef.current.setMassProperties({
            //     centerOfMass: { x: 0, y: -0.3, z: 0 },
            //     principalInertia: { x: 0.1, y: 0.1, z: 0.1 },
            // });

            // ✅ Fine-tune physics for realistic movement
            beyRef.current.setAngularDamping(0.15);
            beyRef.current.setLinearDamping(0.05);
        }
    }, []);

    

    return (
            <RigidBody ref={beyRef} type="dynamic" position={position} rotation={[0, 0, 0]} angularDamping={0.2} scale={[2,2,2]} colliders={false}>
                <group onClick={try_spin} >
                        <mesh scale={[1,2,1]}>
                            <boxGeometry args={[1, 1, 1]}/>
                            <meshStandardMaterial 
                                map={colorMap}
                                normalMap={normalMap}
                                roughnessMap={roughnessMap} 
                                metalness={0.1} 
                                roughness={0.2} />
                        </mesh>
                        <mesh scale={[1,1,1]} position={[0,-0.5,0]} rotation={[0,0,Math.PI]}>
                            <coneGeometry args={[2, 2, 32]}/>
                            <meshStandardMaterial 
                                map={colorMap}
                                normalMap={normalMap}
                                roughnessMap={roughnessMap} 
                                metalness={0.1} 
                                roughness={0.2} />
                        </mesh>
                    <CapsuleCollider ref={spineRef} args={[1, 0.5]}/>
                    <CylinderCollider ref={upperRingRef} args={[0.2, 2]} position={[0,0.25,0]}/>
                    <CylinderCollider ref={lowerRingRef} args={[0.2, 1.5]} position={[0,-0.35,0]}/>
                </group>
            </RigidBody>
    );
}
