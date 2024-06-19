import React, { useEffect, useState } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import conexionServer from '../../utils/conexionServer';
import { Oval } from 'react-loader-spinner';
import UlComponent from '../../components/UlComponent';
import { useNavigate } from 'react-router-dom';
import PropiedadItem from '../../components/PropiedadItem';

function PropiedadPage() {
  const [data,setData]=useState(null);
  const [state,setState]=useState("LOADING");
  const [errorMessage,setErrorMessage]=useState(null);
  const navigate=useNavigate();

  useEffect(()=>{
    conexionServer("propiedades",setData,setState);
  },[]);

  function handleClickCreate(event, url) {
    event.preventDefault();
    navigate(url);
  };

  function handleClickEdit(event, url) {
    event.preventDefault();
    navigate(url);
  };

  function handleClickDelete(event, id ) {
    event.preventDefault();
    //hay que ver como enviar un alert, algo que funcione como condicional
    //Se debe pedir confirmación antes de realizar la acción.

    conexionServer(`propiedad/${id}`, setData, setState, "DELETE");
    alert("propiedad eliminada");
  }

  const childrenItem = (propiedad) => (
    <PropiedadItem
      propiedad={propiedad}
      handleClickEdit={handleClickEdit}
      handleClickDelete={handleClickDelete}
    />
  );

  return (
    <>
      <HeaderComponent />
      <main>
        {state==="SUCCESS" ? (
          <div className="div-main">
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

export default PropiedadPage;
