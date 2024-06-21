import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import conexionServer from '../../utils/conexionServer';
import ListItemComponent from '../../components/ListitemComponent';
import ButtonComponent from '../../components/ButtonComponent';
import UlComponent from '../../components/UlComponent';
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

  function handleClickCreate(event, url) {
    event.preventDefault();
    navigate(url);
  };

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
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este tipo de propiedad?');
    if (confirmDelete) {
      conexionServer(`tipos_propiedad/${id}`, setData, setState, "DELETE");
      alert("Tipo de propiedad eliminado");
    }
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
        {state==="SUCCESS" ? (
          <div className="div-main">
            <UlComponent data={data} state={state} childrenItem={childrenItem} />
            <ButtonComponent type="add" handleClick={handleClickCreate} params={`/tipos_propiedad/create`} textContent='Agregar nuevo Tipo de Propiedad'/>
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