import React from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';
import Chatpage from './pages/Chatpage';
import homepage from './pages/homepage';


function App() {
  return (
    <>
    
    <div className="App">
     
     <Routes>
      <Route path = "/" Component={homepage}/>
      
     <Route path = "/chats/"Component={Chatpage}/>
     </Routes>
    </div>
    
    </>
  );
}

export default App;
