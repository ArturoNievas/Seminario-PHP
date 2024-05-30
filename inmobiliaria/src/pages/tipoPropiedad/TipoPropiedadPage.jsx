import React, { useEffect, useState } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import conexionServer from '../../utils/conexionServer';
import ListItemComponent from '../../components/ListitemComponent';
import ButtonComponent from '../../components/ButtonComponent';
import '../../assets/styles/ul.css'

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
        <ul className='ul'>
          {Array.isArray(data) && data.length > 0 ? (
            data.map(propiedad => (
              <>
                <ListItemComponent id={propiedad.id}>
                  <p>{propiedad.nombre}</p>
                  <div className='buttons'>
                    <ButtonComponent type="add"/>
                    <ButtonComponent type="delete"/>
                  </div>
                </ListItemComponent>
              </>
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
