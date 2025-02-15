import './App.css'
import {Routes, Route} from 'react-router-dom'
import NotFound from './components/Notfound'
import SignIn from './pages/SignIn'
import Signup from './pages/Signup'
import Home from './pages/Home'
import ProtectedRoute from './utils/ProtectedRoute'



function App() {

  return (
    <>
      <Routes>
          <Route path='*' element={<NotFound/>}/>
          <Route path='/' element={<SignIn/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route element={<ProtectedRoute/>}>
            <Route path='/home' element={<Home/>}/>
          </Route>
      </Routes>
    </>
  )
}

export default App
