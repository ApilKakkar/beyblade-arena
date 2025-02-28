import { Canvas} from '@react-three/fiber'
import './App.css'
import Game from './Game'

function App() {
  return (
    <>
      <Canvas camera={ { fov: 45, near: 0.1, far: 200, position: [ -40, 60, 40 ] } }>
        <Game />
      </Canvas>
    </>
  )
}

export default App
