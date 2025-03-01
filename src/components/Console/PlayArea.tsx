import { PivotControls } from "@react-three/drei"
import { CapsuleCollider, CylinderCollider, Physics, RapierCollider, RapierRigidBody, RigidBody, TrimeshCollider } from '@react-three/rapier'
import { useRef, useEffect, useMemo, Suspense} from "react"
import { useKeyboardControls } from "@react-three/drei";
import { KeyboardControls, KeyboardControlsEntry } from '@react-three/drei'
import { useFrame } from "@react-three/fiber"

import * as THREE from "three";
    
enum Controls {
    forward = 'forward',
    back = 'back',
    left = 'left',
    right = 'right',
    jump = 'jump',
}

export default function PlayArea(){

    const map = useMemo<KeyboardControlsEntry<Controls>[]>(()=>[
        { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
        { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
        { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
        { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
        { name: Controls.jump, keys: ['Space'] },
    ], [])

    return (
        <>
            <KeyboardControls map={map}>
                <Suspense>
                <Physics>
                    <BasicTrimesh/>
                    {/* <BasicHeightfield/> */}
                    {/* <PivotControls depthTest={false} scale={2}>
                    </PivotControls> */}
                    <Beyblade position={[0,20,0]} color={"skyblue"}/>
                    {/* <Beyblade2 position={[0,20,0]} color={"red"}/> */}
                </Physics>
                </Suspense>
            </KeyboardControls>
        </>
    )
}

function BasicTrimesh() {
    const vertices = useMemo(
      () => [
        -15, 4, -15,   -5, 2, -15,    5, 2, -15,   15, 4, -15,
        -15, 2, -5,     -5, 0, -5,  5, 0, -5,  15, 2, -5,
        -15, 2, 5,      -5, 0, 5,   5, 0, 5,   15, 2, 5,
        -15, 4, 15,    -5, 2, 15,     5, 2, 15,     15, 4, 15
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
            <meshStandardMaterial color="gray" side={THREE.DoubleSide} />
        </mesh>
      </RigidBody>
    );
}

function Beyblade({ position = [0, 2, 0] as [number, number, number], color = "greenyellow" }) {
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
                y: 0, 
                z: localUp.z * 100 
            }, true);
        }
    };

    const [sub, get] = useKeyboardControls<Controls>()

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
        const pressed = get().back
    })

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
            <RigidBody ref={beyRef} type="dynamic" position={position} rotation={[0, 0, 0]} angularDamping={0.2} scale={[2,2,2]} colliders={false}>
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
