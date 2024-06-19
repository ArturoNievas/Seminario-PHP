import React, { useEffect, useState } from 'react';
import ListItemComponent from './ListitemComponent';
import ButtonComponent from './ButtonComponent';
import conexionServer from '../utils/conexionServer';

//no me gusta como se maneja esto, hay que corregirlo
//para mi no se tendria que mostrar el item entero hasta que cargue cada componente
//el css se estropea cuando se carga la info
//tira un par de errores en la consola, revisar
const PropiedadItem = ({ propiedad, handleClickEdit, handleClickDelete }) => {
  const [tipoPropiedad, setTipoPropiedad] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [err,setErr]=useState();

    useEffect(() => {
        conexionServer(`tipos_propiedad/${propiedad.tipo_propiedad_id}`,setTipoPropiedad,setErr);
        conexionServer(`localidades/${propiedad.localidad_id}`,setLocalidad,setErr);
    }, []);

  return (
    <ListItemComponent key={propiedad.id}>
      <p className='title-li'>{propiedad.domicilio}</p>
      <p className='title-li'>{localidad===""?"Cargando...":localidad.nombre}</p>
      <p className='title-li'>{tipoPropiedad===""?"Cargando...":tipoPropiedad.nombre}</p>
      <p className='title-li'>{propiedad.fecha_inicio_disponibilidad}</p>
      <p className='title-li'>{propiedad.cantidad_huespedes}</p>
      <p className='title-li'>{propiedad.valor_noche}</p>
      <div className='buttons'>
        <ButtonComponent type="edit" handleClick={(event) => handleClickEdit(event,`/propiedad/edit/${propiedad.id}`)} />
        <ButtonComponent type="delete" handleClick={(event) => handleClickDelete(event,propiedad.id)} />
      </div>
    </ListItemComponent>
  );
};

export default PropiedadItem;
