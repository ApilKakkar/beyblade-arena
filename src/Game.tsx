import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import Lights from "./components/Environment/Lights"
import PlayArea from "./components/Console/PlayArea"

export default function Game() {

    return (
        <>  
            <Perf />
            <OrbitControls />
            <Lights />
            <PlayArea />
        </>
    )
}