import { useContext } from 'react';
import './App.css';
import Home from './pages/Home';
import LoginRegister from './pages/LoginRegister';
import { studContext } from './context/studentContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './components/protectedRoutes';

function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LoginRegister />} />

      <Route element={<ProtectedRoutes/>}>
        <Route path='/home' element={<Home />} />
      </Route>

    </Routes>
  </BrowserRouter>
  )
}

export default App;
