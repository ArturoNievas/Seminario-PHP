import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import conexionServer from '../../utils/conexionServer';
import ListItemComponent from '../../components/ListitemComponent';
import ButtonComponent from '../../components/ButtonComponent';
import UlComponent from '../../components/UlComponent';
import CreateElement from '../../components/CreacionDeElemento/CrearElemento';
import { Oval } from "react-loader-spinner";

function TipoPropiedadPage() {
  const [data, setData] = useState([]);
  const [state, setState] = useState("LOADING");
  const navigate = useNavigate();

  //para mi hay que ponerle el useEffect con [data] para que se ejecute
  //cuando cambie el valor del data y que actualice el main pero
  //se ejecuta todo el tiempo, no solo cuando llamamos a setData. idk
  useEffect(() => {
    conexionServer("tipos_propiedad", setData, setState);
    
  },[]);

  function handleClickEdit(event, url) {
    event.preventDefault();
    navigate(url);
  };

  //tira error y queda el state en error, lo que hace que muestre:
  //no hay datos disponibles
  
  /*
    error:  SyntaxError: Unexpected end of JSON input
    at conexionServer.js:15:1
  */
  function handleClickDelete(event, id ) {
    event.preventDefault();
    <>
     <p>Seguro que quiere eliminar la propiedad {id}?</p>
    </>

    conexionServer(`tipos_propiedad/${id}`, setData, setState, "DELETE");
    alert("propiedad eliminada");
  }

  const childrenItem = (propiedad) => (
    <ListItemComponent key={propiedad.id}>
      <p className='title-li'>{propiedad.nombre}</p>
      <div className='buttons'>
        <ButtonComponent type="edit" handleClick={handleClickEdit} params={`/tipos_propiedad/edit/${propiedad.id}`} />
        <ButtonComponent type="delete" handleClick={handleClickDelete} params={propiedad.id}/>
      </div>
    </ListItemComponent>
  );

  return (
    <>
      <HeaderComponent />
      <main>
        {/*
          moví el manejo de los estados para aca porque el createElement
          se renderizaba por mas de que el estado sea loading,
          hay que fijarse como modularizarlo para reutilizarlo.
          y como manejar cuando el stado de error 
        */}
        {state==="SUCCESS" ? (
          <div>
            <UlComponent data={data} state={state} childrenItem={childrenItem} />

            {/* 
              hay que fijarse como hacer bien este apartado
              yo,lo hice como para que ande solamente 

              aparte hay que fixeear este error:
              CrearElemento.jsx:21 Warning: Each child in a list should have a unique "key" prop.
              nose porq lo tira si no esta dentro de una lista
            */}
            <CreateElement params={['nombre']} endpoint={`tipos_propiedad`} setDatosPadre={setData} setState={setState}/>
          </div>
        ) : state==="LOADING" ? (
          <div className="loading-oval-container">
              <Oval
                  className="loading-oval"
                  visible={true}
                  color="var(--color-oval)"
                  secondaryColor="var(--color-oval)"
                  ariaLabel="oval-loading"
              />
          </div>
        ) : (
            <p>Error</p>
        )}
      </main>
      <FooterComponent/>
    </>
  );
}

export default TipoPropiedadPage;