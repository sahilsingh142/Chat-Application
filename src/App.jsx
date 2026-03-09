import { Routes, Route} from 'react-router';
import Home from './Home';
import Login from './Login';
import MainSection from './MainSection';
import ProtectedRoute from './ProtectedRoute';

function App() {

  return (
    <>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/Login' element={<Login/>}/>
      <Route path='/MainSection' element={<ProtectedRoute><MainSection/></ProtectedRoute>}/>
     </Routes>
    </>
  )
}

export default App
