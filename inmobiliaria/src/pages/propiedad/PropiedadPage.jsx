import React, { useEffect, useState } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import conexionServer from '../../utils/conexionServer';
import { Oval } from 'react-loader-spinner';
import UlComponent from '../../components/UlComponent';
import { useNavigate } from 'react-router-dom';
import PropiedadItem from '../../components/PropiedadItem';

//OBSERVACION: yo cambiaria el state solo cuando 
//todos los datos esten completamente cargados
//(nos evitamoos un error que salta cuando intentas borrar una propiedad 
//sin que carguen todos sus datos por completo)
function PropiedadPage() {
  const [data,setData]=useState(null);
  const [state,setState]=useState("LOADING");
  const [errorMessage,setErrorMessage]=useState(null);
  const navigate=useNavigate();
  const [refresh, setRefresh] = useState(false);

  useEffect(()=>{
    setState("LOADING");
    conexionServer("propiedades",setData,setState);
  },[refresh]);

  function handleClickCreate(event, url) {
    event.preventDefault();
    navigate(url);
  };

  function handleClickEdit(event, url) {
    event.preventDefault();
    navigate(url);
  };

  //NO FUNCIONA HASTA QUE TERMINA DE CARGAR TODO EL COMPONENTE
  //tira state===ERROR
  /*
  
  */
  function handleClickDelete(event, id ) {
    event.preventDefault();
    //hay que ver como enviar un alert, algo que funcione como condicional
    //Se debe pedir confirmación antes de realizar la acción.

    conexionServer(`propiedades/${id}`, setData, setState, "DELETE");
    alert("propiedad eliminada");
    setRefresh(!refresh);
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
