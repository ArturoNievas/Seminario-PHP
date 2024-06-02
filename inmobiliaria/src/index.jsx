import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider  } from 'react-router-dom';
import TipoPropiedadPage from './pages/tipoPropiedad/TipoPropiedadPage';
import NewTipoPropiedad from './pages/tipoPropiedad/NewTipoPropiedad';

const router = createBrowserRouter([
  {
    path: "/",
    element: <TipoPropiedadPage />,
  },
  {
    path: "/tipoPropiedad",
    element: <TipoPropiedadPage />,
  },
  {
    path: "/reserva",
    element: <NewTipoPropiedad />,
  },
  {
    path: "/propiedad",
    element: <TipoPropiedadPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
