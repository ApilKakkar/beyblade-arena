import { Environment } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function Lights() {

    const scene = useThree(state => state.scene)

    const envMapIntensity = 0.4

    useEffect(() =>
        {
            scene.environmentIntensity = envMapIntensity
        }, [ envMapIntensity ])

    return (
        <>
            <Environment 
                background
                files={"/environment_maps/old_bus_depot_2k.hdr"}
            />
            {/* 🌞 Key Light - Main directional light (Sunlight-like) */}
            {/* <directionalLight
                castShadow
                position={[6, 12, 6]} // Moved slightly forward for better shadows
                intensity={1.8} // Slightly softer than original
                shadow-mapSize={[2048, 2048]}
                shadow-camera-near={1}
                shadow-camera-far={30}
                shadow-camera-top={15}
                shadow-camera-right={15}
                shadow-camera-bottom={-15}
                shadow-camera-left={-15}
            /> */}

            {/* 🌍 Ambient Light - Soft background fill */}
            {/* <ambientLight intensity={0.8} color={"#aaaaaa"} /> */}

            {/* ✨ Point Light - Adds shiny reflections on metallic surfaces */}
            {/* <pointLight 
                position={[0, 6, 3]} // Slightly tilted to hit Beyblade's top
                intensity={1.4} // Stronger but localized
                decay={2}
                distance={18} 
                color={"#ffffff"}
            /> */}

            {/* 🔥 Rim Light - Warm glow on the Beyblade's edges */}
            {/* <spotLight 
                position={[-7, 10, -7]} // Behind and slightly above
                angle={0.4}
                penumbra={0.6} // Softer edges
                intensity={1.6} 
                decay={2} 
                distance={25} 
                color={"#ffaa77"} // Warmer rim light
            /> */}
        </>
    );
}