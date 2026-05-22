import { Routes, Route} from 'react-router';
import Home from './Authentication/Home.jsx';
import Login from './Authentication/Login.jsx';
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
