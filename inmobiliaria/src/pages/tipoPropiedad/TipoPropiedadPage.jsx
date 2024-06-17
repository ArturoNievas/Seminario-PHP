import React, { useEffect, useState } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import conexionServer from '../../utils/conexionServer';
import ListItemComponent from '../../components/ListitemComponent';
import ButtonComponent from '../../components/ButtonComponent';
import UlComponent from '../../components/UlComponent';

function TipoPropiedadPage() {
  const [data,setData] = useState([]);
  const [type,setType] = useState([]);
  const [state, setState] = useState("LOADING");

  useEffect(() => {
    conexionServer("tipos_propiedad",setData, setState);
  },[]);

  handleClick(({tipo})=>{
    setType(tipo);
  });

  const childrenItem = ((propiedad)=>(
    <ListItemComponent key={propiedad.id} url={`/tipos_propiedad/${type}`}>
      <p className='title-li'>{propiedad.nombre}</p>
      <div className='buttons'>
        <ButtonComponent type="edit" elemento={data} handleClick={handleClick}/>
        <ButtonComponent type="delete" elemento={data}/>
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