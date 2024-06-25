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

  useEffect(() => {
    setState("LOADING");
    conexionServer('reservas')
      .then(data => {
        console.log("Data", data);
        setData(data.data);
        setState("SUCCESS");
      })
      .catch(() => setState("ERROR"));
  }, [refresh]);

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
          setRefresh(!refresh);
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
    />
  );

  return (
    <>
      <HeaderComponent />
      <main>
        {state === "SUCCESS" ? (
          <div className="div-main">
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