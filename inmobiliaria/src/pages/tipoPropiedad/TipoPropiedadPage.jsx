import React, { useEffect, useState } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import conexionServer from '../../utils/conexionServer';
import ListItemComponent from '../../components/ListitemComponent';
import ButtonComponent from '../../components/ButtonComponent';
import UlComponent from '../../components/UlComponent';

function TipoPropiedadPage() {
  const [data,setData] = useState([]);
  const [error, setError] = useState(null);

  const childrenItem = ((propiedad)=>(
    <ListItemComponent key={propiedad.id}>
      <p className='title-li'>{propiedad.nombre}</p>
      <div className='buttons'>
        <ButtonComponent type="add"/>
        <ButtonComponent type="delete"/>
      </div>
    </ListItemComponent>
  ));

  useEffect(() => {
    conexionServer("tipos_propiedad",setData, setError);
  },[]);
  
  return (
    <>
      <HeaderComponent />
      <main>
        {error ? (
          <p>Error: {error.message}</p>
        ) : (
          <UlComponent data={data} childrenItem={childrenItem} />
        )}
      </main>
      <FooterComponent />
    </>
  );
}

export default TipoPropiedadPage;
