import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from './pages/main';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from './pages/about';
import NotFound from './pages/notfound';

export default function App(){
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main/>} />
          <Route path="about" element={<About/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}

reportWebVitals();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
