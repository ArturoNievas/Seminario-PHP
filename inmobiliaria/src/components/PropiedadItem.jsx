import '../assets/styles/ListitemComponent.css';
import React, { useEffect, useState } from 'react';
import ButtonComponent from './ButtonComponent';
import conexionServer from '../utils/conexionServer';
//import imagen from '../assets/images/840_560.jpeg';

//no me gusta como se maneja esto, hay que corregirlo
//para mi no se tendria que mostrar el item entero hasta que cargue cada componente
//el css se estropea cuando se carga la info
//tira un par de errores en la consola, revisar
const PropiedadItem = ({ propiedad, handleClickEdit, handleClickDelete, handleClickAdd }) => {
  const [tipoPropiedad, setTipoPropiedad] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [err,setErr]=useState();

    useEffect(() => {
      conexionServer(`tipos_propiedad/${propiedad.tipo_propiedad_id}`)
      .then(data => {
        setTipoPropiedad(data.data);
      })
      .catch((e) => console.log("ERROR: ",e));
      conexionServer(`localidades/${propiedad.localidad_id}`)
      .then(data => {
        setLocalidad(data.data);
      })
      .catch((e) => console.log("ERROR: ",e));
    }, [propiedad]);

  return (
    <li className="list-item" key={propiedad.id}>
      <p className='title-li'>Dirección: {propiedad.domicilio}</p>
      {propiedad.imagen!=null && ( <img src={propiedad.imagen} type={`image/${propiedad.tipo_imagen}`} alt="imagen de la casa"/> )}
      <p className='title-li'>{localidad===""?"Cargando...":localidad.nombre}</p>
      <p className='title-li'>{tipoPropiedad===""?"Cargando...":tipoPropiedad.nombre}</p>
      <p className='title-li'>Inicio disponibilidad: {propiedad.fecha_inicio_disponibilidad}</p>
      <p className='title-li'>Huéspedes: {propiedad.cantidad_huespedes}</p>
      <p className='title-li'>Valor noche: {propiedad.valor_noche}</p>
      <div className='buttons'>
        <ButtonComponent type="add" handleClick={(event) => handleClickAdd(event,`/reserva/create/${propiedad.id}`)} textContent='Agregar reserva'/>
        <ButtonComponent type="edit" handleClick={(event) => handleClickEdit(event,`/propiedad/edit/${propiedad.id}`)} />
        <ButtonComponent type="delete" handleClick={(event) => handleClickDelete(event,propiedad.id)} />
      </div>
    </li>
  );
};

export default PropiedadItem;
