import React, { useEffect, useState } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import conexionServer from '../../utils/conexionServer';
import ListItemComponent from '../../components/ListitemComponent';
import ButtonComponent from '../../components/ButtonComponent';
import UlComponent from '../../components/UlComponent';

function TipoPropiedadPage() {
  const [data,setData] = useState([]);
  const [state, setState] = useState("LOADING");

  useEffect(() => {
    conexionServer("tipos_propiedad",setData, setState);
  },[]);

  const childrenItem = ((propiedad)=>(
    <ListItemComponent key={propiedad.id}>
      <p className='title-li'>{propiedad.nombre}</p>
      <div className='buttons'>
        <ButtonComponent type="add"/>
        <ButtonComponent type="delete"/>
      </div>
    </ListItemComponent>
  ));
  
  return (
    <>
      <HeaderComponent />
      <main>
        {state==="ERROR" ? (
          //manejo del error.
          <p>Error:</p>
        ) : (
          <UlComponent data={data} state={state} childrenItem={childrenItem} />
        )}
      </main>
      <FooterComponent />
    </>
  );
}

export default TipoPropiedadPage;
