export default function Lights() {
    return (
        <>
            {/* 🌞 Key Light - Strong Directional Light */}
            <directionalLight
                castShadow
                position={[5, 10, 5]} // Higher, more dramatic angle
                intensity={2.0} // Stronger main light
                shadow-mapSize={[2048, 2048]} // Higher resolution shadows
                shadow-camera-near={1}
                shadow-camera-far={20}
                shadow-camera-top={10}
                shadow-camera-right={10}
                shadow-camera-bottom={-10}
                shadow-camera-left={-10}
            />

            {/* 🌍 Soft Ambient Light - Helps Fill Dark Shadows */}
            <ambientLight intensity={1} color={"#888888"} />

            {/* ✨ Back Light - Point Light Above Arena to Add Shine to Metal */}
            <pointLight 
                position={[0, 8, 0]} // Above the arena
                intensity={1.2} 
                decay={2}
                distance={15} 
                color={"#ffffff"}
            />

            {/* 🔥 Rim Light - Creates Highlights on Beyblade Edges */}
            <spotLight 
                position={[-6, 8, -6]} 
                angle={0.3}
                penumbra={0.5}
                intensity={1.5} 
                decay={2} 
                distance={20} 
                color={"#ffddaa"}
            />
        </>
    );
}