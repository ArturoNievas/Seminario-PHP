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

  function handleClick({ type }){
    setType(type);
  };  

  
  function handleClickDelete({elemento}){
    conexionServer(`tipos_propiedad/${elemento.id}`, setData, setState, "DELETE");
  };  

  const childrenItem = ((propiedad)=>(
    <ListItemComponent key={propiedad.id} propiedad={propiedad} url={`/tipos_propiedad/${type==="edit"?`${type}/${propiedad.id}`:``}`} tipo={type}>
      <p className='title-li'>{propiedad.nombre}</p>
      <div className='buttons'>
        <ButtonComponent type="edit" handleClick={() => handleClick({type: 'edit'})}/>
        <ButtonComponent type="delete" handleClick={() => handleClickDelete({elemento: propiedad})}/>
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