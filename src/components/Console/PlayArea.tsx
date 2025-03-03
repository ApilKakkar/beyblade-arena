import { Physics} from '@react-three/rapier'
import { useMemo, Suspense} from "react"
import { KeyboardControls, KeyboardControlsEntry } from '@react-three/drei'

import BeybladeBowl from './BeybladeBowl';
import Beyblade from './Beyblade';
    
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
                <Physics debug gravity={[0,-9.8,0]}>
                    <BeybladeBowl/>
                    <Beyblade position={[0,40,0]} color={"white"}/>
                    {/* <PivotControls depthTest={false} scale={2}>
                    </PivotControls> */}
                </Physics>
                </Suspense>
            </KeyboardControls>
        </>
    )
}



