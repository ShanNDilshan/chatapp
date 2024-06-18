import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { createRoot } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ChatProvider from './Context/ChatProvider';
import './index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
  
    
      <BrowserRouter>
        <ChakraProvider>
          <ChatProvider>
          <App />
          </ChatProvider>
        </ChakraProvider>
      </BrowserRouter>
    
    
  
  </React.StrictMode>
);
