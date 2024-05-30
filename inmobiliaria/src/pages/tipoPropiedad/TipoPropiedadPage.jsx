import React, { useEffect, useState } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import conexionServer from '../../utils/conexionServer';

function TipoPropiedadPage() {
  const [data,setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    conexionServer("tipos_propiedad",setData, setError);
  },[]);
  
  return (
    <>
      <HeaderComponent />
      {error ? (
        <p>Error: {error.message}</p>
      ) : (
        <ul>
          {Array.isArray(data) && data.length > 0 ? (
            data.map(propiedad => (
              <li key={propiedad.id}>{propiedad.nombre}</li>
            ))
          ) : (
            <p>No hay datos disponibles</p>
          )}
        </ul>
      )}
      <FooterComponent />
    </>
  );
}

export default TipoPropiedadPage;
