import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import conexionServer from '../../utils/conexionServer';
import ButtonComponent from '../../components/ButtonComponent';
import UlComponent from '../../components/UlComponent';
import { Oval } from "react-loader-spinner";
import '../../assets/styles/ListitemComponent.css';

function TipoPropiedadPage() {
  const [data, setData] = useState([]);
  const [state, setState] = useState("LOADING");
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setState("LOADING");
    conexionServer("tipos_propiedad").then(data => {
      setData(data.data);
      setState("SUCCESS");
    });
  },[refresh]);

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
      conexionServer(`tipos_propiedad/${id}`, "DELETE").then(() => {
        alert("Tipo de propiedad eliminado");
        setData(data.filter(x => x.id !== id));
      }).catch(error => {
        const parsedError = JSON.parse(error.message);
        alert(parsedError.id);
    });
    }
  }

  const childrenItem = (propiedad) => (
    <li className="list-item" key={propiedad.id}>
      <p className='title-li'>{propiedad.nombre}</p>
      <div className='buttons'>
        <ButtonComponent type="edit" handleClick={handleClickEdit} params={`/tipos_propiedad/edit/${propiedad.id}`} />
        <ButtonComponent type="delete" handleClick={handleClickDelete} params={propiedad.id}/>
      </div>
    </li>
  );

  return (
    <>
      <HeaderComponent />
      <main>
        {state==="SUCCESS" ? (
          <div className="div-main">
            <ButtonComponent type="add" handleClick={handleClickCreate} params={`/tipos_propiedad/create`} textContent='Agregar nuevo Tipo de Propiedad'/>
            <UlComponent data={data} state={state} childrenItem={childrenItem} />
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