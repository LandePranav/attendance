import { useContext } from 'react';
import './App.css';
import Home from './pages/Home';
import LoginRegister from './pages/LoginRegister';
import { studContext } from './context/studentContext';

function App() {

  const {name, email} = useContext(studContext);

  if(name){
    return(
      <Home />
    )
  }

   return (
    <>
      <LoginRegister />
    </>
  );
}

export default App;
