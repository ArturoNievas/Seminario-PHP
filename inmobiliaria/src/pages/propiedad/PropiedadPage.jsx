import React, { useEffect, useState } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import conexionServer from '../../utils/conexionServer';
import { Oval } from 'react-loader-spinner';
import UlComponent from '../../components/UlComponent';
import { useNavigate } from 'react-router-dom';
import PropiedadItem from '../../components/PropiedadItem';
import ButtonComponent from '../../components/ButtonComponent';
import FiltradoComponent from '../../components/FiltradoComponent';
//OBSERVACION: yo cambiaria el state solo cuando 
//todos los datos esten completamente cargados
//(nos evitamoos un error que salta cuando intentas borrar una propiedad 
//sin que carguen todos sus datos por completo)
function PropiedadPage() {
  const [data,setData]=useState(null);
  const [state,setState]=useState("LOADING");
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
  function handleClickDelete(event, id ) {
    event.preventDefault();
    const confirmDelete = window.confirm('¿Estás seguro de eliminar esta propiedad?');
    if (confirmDelete) {
      conexionServer(`propiedades/${id}`, setData, setState, "DELETE");
      alert("Propiedad eliminada");
      setRefresh(!refresh);
    }
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
      <HeaderComponent/>
      <main>
        {state==="SUCCESS" ? (
          <div className="div-main">
            <FiltradoComponent data={data} setData={setData} setState={setState}/>
            <UlComponent data={data} state={state} childrenItem={childrenItem} />
            <ButtonComponent type="add" handleClick={handleClickCreate} params={`/propiedad/create`} textContent='Agregar nueva Propiedad'/>
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
