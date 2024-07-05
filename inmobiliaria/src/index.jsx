import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider  } from 'react-router-dom';
import TipoPropiedadPage from './pages/tipoPropiedad/TipoPropiedadPage';
import NewTipoPropiedad from './pages/tipoPropiedad/NewTipoPropiedad';
import EditTipoPropiedad from './pages/tipoPropiedad/EditTipoPropiedad';
import PropiedadPage from './pages/propiedad/PropiedadPage';
import EditPropiedad from './pages/propiedad/EditPropiedad';
import NewPropiedad from './pages/propiedad/NewPropiedad';
import ReservaPage from './pages/reservas/ReservaPage';
import NewReserva from './pages/reservas/NewReserva';
import EditReserva from './pages/reservas/EditReserva';
import DetailPropiedad from './pages/propiedad/DetailPropiedad';

const router = createBrowserRouter([
  {
    path: "/",
    element: <TipoPropiedadPage />,
  },
  {
    path: "/tipos_propiedad/create",
    element: <NewTipoPropiedad />,
  },
  {
    path: "/tipos_propiedad/edit/:id",
    element: <EditTipoPropiedad />,
  },
  {
    path: "/propiedad",
    element: <PropiedadPage />,
  },
  {
    path: "/propiedad/create",
    element: <NewPropiedad />,
  },
  {
    path: "/propiedad/edit/:id",
    element: <EditPropiedad />,
  },
  {
    path: "/propiedad/detail/:id",
    element: <DetailPropiedad />,
  },
  {
    path: "/reserva",
    element: <ReservaPage />,
  },
  {
    path: "/reserva/create",
    element: <NewReserva />,
  },
  {
    path: "/reserva/edit/:id",
    element: <EditReserva />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
