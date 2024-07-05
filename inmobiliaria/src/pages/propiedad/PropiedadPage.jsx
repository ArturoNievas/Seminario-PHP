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
  const [localidades,setLocalidades]=useState(null);
  const [tiposPropiedad,setTiposPropiedad]=useState(null);
  const [idsFiltrado,setIdsFiltrado]=useState([]);

  useEffect(()=>{
    setState("LOADING");
    conexionServer("propiedades").then( response => {
      let datos=response.data;
      let ids=[];

      datos.forEach(element => {
          ids.push(element.id);
      });

      console.log("ids: ",ids);
      setIdsFiltrado(ids);
      setData(datos);
      setState("SUCCESS");
    });
    conexionServer("localidades").then( response => {
      setLocalidades(response.data);
    });
    conexionServer("tipos_propiedad").then( response => {
      setTiposPropiedad(response.data);
    });
  },[]);


  function handleClickCreate(event, url) {
    event.preventDefault();
    navigate(url);
  };

  function handleClickEdit(event, url) {
    event.preventDefault();
    navigate(url);
  };

  function handleClickDetail(event, url) {
    event.preventDefault();
    navigate(url);
  };

  //NO FUNCIONA HASTA QUE TERMINA DE CARGAR TODO EL COMPONENTE
  //tira state===ERROR
  function handleClickDelete(event, id ) {
    event.preventDefault();
    const confirmDelete = window.confirm('¿Estás seguro de eliminar esta propiedad?');
    if (confirmDelete) {
      conexionServer(`propiedades/${id}`, "DELETE").then( () => {
        alert("Propiedad eliminada");
        setData(data.filter(x => x.id !== id));
      }).catch(error => {
        const parsedError = JSON.parse(error.message);
        alert(parsedError.id);
    });
    }
  }

  const childrenItem = (propiedad) => (
    <PropiedadItem
      propiedad={propiedad}
      handleClickEdit={handleClickEdit}
      handleClickDelete={handleClickDelete}
      handleClickDetail={handleClickDetail}
      localidades={localidades}
      tiposPropiedad={tiposPropiedad}
    />
  );

  return (
    <>
      <HeaderComponent/>
      <main>
        {state==="SUCCESS" ? (
          <div className="div-main">
            <FiltradoComponent data={data} setState={setState} setIds={setIdsFiltrado}/>
            <ButtonComponent type="add" handleClick={handleClickCreate} params={`/propiedad/create`} textContent='Agregar nueva Propiedad'/>
            <UlComponent data={data} state={state} childrenItem={childrenItem} filtro={idsFiltrado}/>
          </div>
        ) : state==="LOADING" || state==="Loading" ? (
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