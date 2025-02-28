import { Canvas} from '@react-three/fiber'
import './App.css'
import Game from './Game'

function App() {
  return (
    <>
      <Canvas camera={ { fov: 45, near: 0.1, far: 1000, position: [ 0, 10, 20 ] } }>
        <Game />
      </Canvas>
    </>
  )
}

export default App
