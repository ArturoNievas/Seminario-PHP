import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TipoPropiedadPage from './pages/tipoPropiedad/TipoPropiedadPage';
import NewTipoPropiedad from './pages/tipoPropiedad/NewTipoPropiedad';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="" element={<TipoPropiedadPage />}/>
        <Route path="/tipoPropiedad" element={<TipoPropiedadPage />}/>
        
        {/*este endpoint es de prueba porq no me andaba bien*/}
        <Route path="/reserva" element={<NewTipoPropiedad />}/>
        
        <Route path="/propiedad" element={<TipoPropiedadPage />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
