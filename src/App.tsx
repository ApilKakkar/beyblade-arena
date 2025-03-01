import { Canvas} from '@react-three/fiber'
import './App.css'
import Game from './Game'

function App() {
  return (
    <>
      <Canvas camera={ { fov: 45, near: 0.1, far: 1000, position: [ 0, 50, 100 ] } }>
        <Game />
      </Canvas>
    </>
  )
}

export default App
