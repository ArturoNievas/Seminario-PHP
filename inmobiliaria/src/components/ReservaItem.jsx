import React, { useEffect, useState } from 'react';
import ListItemComponent from './ListitemComponent';
import ButtonComponent from './ButtonComponent';
import conexionServer from '../utils/conexionServer';

//no me gusta como se maneja esto, hay que corregirlo
//para mi no se tendria que mostrar el item entero hasta que cargue cada componente
//el css se estropea cuando se carga la info
//tira un par de errores en la consola, revisar
const ReservaItem = ({ reserva, handleClickEdit, handleClickDelete }) => {
  const [propiedad, setPropiedad] = useState("");
  const [inquilino, setInquilino] = useState("");
  const [err,setErr]=useState();

    useEffect(() => {
        conexionServer(`propiedades/${reserva.propiedad_id}`,setPropiedad,setErr);
        conexionServer(`inquilinos/${reserva.inquilino_id}`,setInquilino,setErr);
    }, [reserva]);

  return (
    <ListItemComponent key={reserva.id}>
      <p className='title-li'>{propiedad===""?"Cargando...":propiedad.domicilio}</p>
      <p className='title-li'>{inquilino===""?"Cargando...":inquilino.nombre}</p>
      <p className='title-li'>{reserva.fecha_desde}</p>
      <p className='title-li'>{reserva.cantidad_noches}</p>
      <p className='title-li'>{reserva.valor_total}</p>
      <div className='buttons'>
        <ButtonComponent type="edit" handleClick={(event) => handleClickEdit(event,`/reserva/edit/${reserva.id}`)} />
        <ButtonComponent type="delete" handleClick={(event) => handleClickDelete(event,reserva.id)} />
      </div>
    </ListItemComponent>
  );
};

export default ReservaItem;
