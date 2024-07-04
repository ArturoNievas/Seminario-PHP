import React, { useEffect, useState } from 'react';
import ButtonComponent from './ButtonComponent';
import conexionServer from '../utils/conexionServer';
import '../assets/styles/ListitemComponent.css';

//no me gusta como se maneja esto, hay que corregirlo
//para mi no se tendria que mostrar el item entero hasta que cargue cada componente
//el css se estropea cuando se carga la info
//tira un par de errores en la consola, revisar
const ReservaItem = ({ reserva, handleClickEdit, handleClickDelete, propiedades, inquilinos }) => {
  const [propiedad, setPropiedad] = useState("");
  const [inquilino, setInquilino] = useState("");
  
  if(propiedades!=null && propiedad==""){
    let i=0;
    while(i<propiedades.length && propiedades[i].id!=reserva.propiedad_id)i++
    if(i<propiedades.length){
      setPropiedad(propiedades[i])
    }
  }

  if(inquilinos!=null && inquilino==""){
    let i=0;
    while(i<inquilinos.length && inquilinos[i].id!=reserva.inquilino_id)i++
    if(i<inquilinos.length){
      setInquilino(inquilinos[i])
    }
  }

  /*
    useEffect(() => {
        conexionServer(`propiedades/${reserva.propiedad_id}`)
          .then(data => {
            setPropiedad(data.data);
          })
          .catch((e) => console.log("ERROR: ",e));
        conexionServer(`inquilinos/${reserva.inquilino_id}`)
        .then(data => {
          setInquilino(data.data);
        })
        .catch((e) => console.log("ERROR: ",e));
    }, [reserva]);
  */

  return (
    <li className="list-item" key={reserva.id}>
      <p className='title-li'>{propiedad===""?"Cargando...":propiedad.domicilio}</p>
      <p className='title-li'>{inquilino===""?"Cargando...":inquilino.nombre}</p>
      <p className='title-li'>{reserva.fecha_desde}</p>
      <p className='title-li'>{reserva.cantidad_noches}</p>
      <p className='title-li'>{reserva.valor_total}</p>
      <div className='buttons'>
        <ButtonComponent type="edit" handleClick={(event) => handleClickEdit(event,`/reserva/edit/${reserva.id}`)} />
        <ButtonComponent type="delete" handleClick={(event) => handleClickDelete(event,reserva.id)} />
      </div>
    </li>
  );
};

export default ReservaItem;
