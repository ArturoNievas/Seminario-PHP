// ReservaPage.js
import React, { useEffect, useState } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import conexionServer from '../../utils/conexionServer';
import { Oval } from 'react-loader-spinner';
import UlComponent from '../../components/UlComponent';
import { useNavigate } from 'react-router-dom';
import ButtonComponent from '../../components/ButtonComponent';
import ReservaItem from '../../components/ReservaItem';

function ReservaPage() {
  const [data, setData] = useState(null);
  const [state, setState] = useState("LOADING");
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const [propiedades,setPropiedades] = useState(null);
  const [inquilinos,setInquilinos] = useState(null);

  useEffect(() => {
    setState("LOADING");
    conexionServer('reservas').then(data => {
        setData(data.data);
        setState("SUCCESS");
      })
    conexionServer("propiedades").then( response => {
      setPropiedades(response.data);
    });
    conexionServer("inquilinos").then( response => {
      setInquilinos(response.data);
    });
  }, []);

  function handleClickCreate(event, url) {
    event.preventDefault();
    navigate(url);
  };

  function handleClickEdit(event, url) {
    event.preventDefault();
    navigate(url);
  };

  function handleClickDelete(event, id) {
    event.preventDefault();
    const confirmDelete = window.confirm('¿Estás seguro de eliminar esta reserva?');
    if (confirmDelete) {
      conexionServer(`reservas/${id}`, "DELETE")
        .then(() => {
          alert("reserva eliminada");
          setData(data.filter(x => x.id !== id));
        })
        .catch(error => {
          const parsedError = JSON.parse(error.message);
          alert(parsedError.id);
        });
    }
  }

  const childrenItem = (reserva) => (
    <ReservaItem
      reserva={reserva}
      handleClickEdit={handleClickEdit}
      handleClickDelete={handleClickDelete}
      propiedades={propiedades}
      inquilinos={inquilinos}
    />
  );

  return (
    <>
      <HeaderComponent />
      <main>
        {state === "SUCCESS" ? (
          <div className="div-main">
            <ButtonComponent type="add" handleClick={handleClickCreate} params={`/reserva/create`} textContent='Agregar nueva Reserva'/>
            <UlComponent data={data} state={state} childrenItem={childrenItem} />
          </div>
        ) : state === "LOADING" ? (
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
      <FooterComponent />
    </>
  );
}

export default ReservaPage;