import { PivotControls } from "@react-three/drei"
import { Physics, RigidBody, RapierRigidBody, InstancedRigidBodies, InstancedRigidBodyProps } from '@react-three/rapier'
import { useRef, useEffect, useMemo } from "react"
import * as THREE from "three";

export default function PlayArea(){

    const field_size = { x: 80, y: 1 , z: 30}
    const offset = 0.5
    const bot_size = { x: 1, y: 1, z: 1}
    const bot = useRef<RapierRigidBody>(null);
    const bot2 = useRef<RapierRigidBody>(null);
    const bot3 = useRef<RapierRigidBody>(null);

    const bot_count = 100
    const bot_rigid_bodies = useRef<RapierRigidBody[]>(null);

    useEffect(() => {
        if (!bot_rigid_bodies.current) {
          return;
        }
        // You can access individual instanced by their index
        for(let i = 0; i < bot_rigid_bodies.current.length; i++){
            bot_rigid_bodies.current[i].addForce({ x: 10, y: 10, z: 0 }, true);
            bot_rigid_bodies.current[i].addTorque({ x: 0, y: 10, z: 0 }, true);
        }
        // bot_rigid_bodies.current.at(2).applyImpulse({ x: 0, y: 10, z: 0 }, true);
    
        // Or update all instances
        bot_rigid_bodies.current.forEach((api) => {
          api.applyImpulse({ x: 0, y: 10, z: 0 }, true);
        });
    }, []);

    const instances = useMemo(() => {
        const instances: InstancedRigidBodyProps[] = [];
        for (let i = 0; i < bot_count; i++) {
          instances.push({
            key: "instance_" + Math.random(),
            position: [Math.random() * 10, Math.random() * 30, Math.random() * 10],
            rotation: [Math.random(), Math.random(), Math.random()],
          });
        }
    
        return instances;
    }, []);

    const colors = useMemo(() => {
        const colorArray = new Float32Array(bot_count * 3); // RGB values for each instance
        for (let i = 0; i < bot_count; i++) {
            const color = new THREE.Color(Math.random(), Math.random(), Math.random());
            color.toArray(colorArray, i * 3); // Store RGB in the array
        }
        return colorArray;
    }, [bot_count]);

    const move_bot = () => {
        console.log("Bot clicked");
        if (bot.current && bot2.current && bot3.current) {
            // A one-off "push"
            // bot.current.applyImpulse({ x: 2, y: 10, z: 0 }, true);
      
            // A continuous force
            bot.current.addForce({ x: 2, y: 2, z: 1 }, true);
            bot2.current.addForce({ x: 2, y: 0, z: 1 }, true);
            bot3.current.addForce({ x: 2, y: 0, z: -1 }, true);
      
            // A one-off torque rotation
            // bot.current.applyTorqueImpulse({ x: 0, y: 10, z: 0 }, true);
      
            // A continuous torque
            bot.current.addTorque({ x: 0, y: 10, z: 0 }, true);
            bot2.current.addTorque({ x: 0, y: -10, z: 0 }, true);
            bot3.current.addTorque({ x: 0, y: 0, z: 10 }, true);
          }
    }

    return (
        <>
            <Physics debug>
                
                <RigidBody type="dynamic" ref={bot} colliders="ball" restitution={1} friction={10}>
                    <mesh castShadow position={ [ 0, (bot_size.y*5), 0 ] } onClick={ move_bot }>
                        <sphereGeometry />
                        <meshStandardMaterial color="white" />
                    </mesh>
                </RigidBody>

                <RigidBody type="dynamic" ref={bot2} colliders="ball" restitution={1} friction={10}>
                    <mesh castShadow position={ [ -5, (bot_size.y*5), 0 ] } onClick={ move_bot }>
                        <sphereGeometry />
                        <meshStandardMaterial color="white" />
                    </mesh>
                </RigidBody>

                <RigidBody type="dynamic" ref={bot3} colliders="ball" restitution={1} friction={10}>
                    <mesh castShadow position={ [ 0, (bot_size.y*5), 5 ] } onClick={ move_bot }>
                        <sphereGeometry />
                        <meshStandardMaterial color="white" />
                    </mesh>
                </RigidBody>

                {/* <PivotControls depthTest={false} scale={2}>
                </PivotControls> */}
                <RigidBody type="fixed" restitution={0.1} friction={0} rotation-z={-Math.PI/4} position-y={-field_size.y*10}>
                {/* ground */}
                    <mesh receiveShadow position={[0,0,0]}  scale={ [field_size.x, field_size.y, field_size.z] }>
                        <boxGeometry args={[1, 1, 1]}/>
                        <meshStandardMaterial color="greenyellow" />
                    </mesh>
                {/* walls */}
                    <mesh castShadow position={ [-(field_size.x/2),(field_size.y - offset),0] } scale={ [field_size.y,(field_size.y*2),(field_size.z)] }>
                        <boxGeometry args={[1, 1, 1]}/>
                        <meshStandardMaterial color="mediumpurple" />
                    </mesh>
                    <mesh castShadow position={ [(field_size.x/2),(field_size.y - offset),0] } scale={ [field_size.y,(field_size.y*2),(field_size.z)] }>
                        <boxGeometry args={[1, 1, 1]}/>
                        <meshStandardMaterial color="mediumpurple" />
                    </mesh>
                    <mesh castShadow position={ [0,(field_size.y - offset),(field_size.z/2)] } scale={ [(field_size.x+(2*offset)),(field_size.y*2),(field_size.y)] }>
                        <boxGeometry args={[1, 1, 1]}/>
                        <meshStandardMaterial color="mediumpurple" />
                    </mesh>
                    <mesh castShadow position={ [0,(field_size.y - offset),-(field_size.z/2)] } scale={ [(field_size.x+(2*offset)),(field_size.y*2),(field_size.y)] }>
                        <boxGeometry args={[1, 1, 1]}/>
                        <meshStandardMaterial color="mediumpurple" />
                    </mesh>
                </RigidBody>

                <InstancedRigidBodies
                    ref={bot_rigid_bodies}
                    instances={instances}
                    colliders="ball"
                    restitution={1} 
                    friction={10}
                    >
                    <instancedMesh args={[undefined, undefined, bot_count]} count={bot_count}>
                        <sphereGeometry>
                        {/* Add color attribute to each instance */}
                        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
                        </sphereGeometry>
                        <meshStandardMaterial vertexColors />
                    </instancedMesh>
                </InstancedRigidBodies>
            </Physics>

        </>
    )
}