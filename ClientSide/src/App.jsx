
import './App.css'
import { Login } from './components/Login'
import {BrowserRouter,Router,Route,Routes} from "react-router-dom"
import { Register } from './components/Register'
import { HomePage } from './pages/HomePage'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage/>}/>

          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
