import React, { useEffect, useState } from 'react';
import conexionServer from '../utils/conexionServer';
import '../assets/styles/FiltradoComponent.css';
import ButtonComponent from './ButtonComponent';

function FiltradoComponent({ data, setData, setState }) {
    const [filtrado,setFiltrado]=useState(false);
    const [localidades,setLocalidades]=useState([]);

    useEffect(()=>{
        conexionServer(`localidades`,setLocalidades,setState,"GET");
    },[]);

    //falta validar los campos
    function handleSubmit(event) {
        event.preventDefault();
        let buttonId=event.nativeEvent.submitter.id;
        if(buttonId==1){
            let form = event.target;
            /*
            let localidadesa=form.Localidades;
            console.log(form.Localidades);
            console.log(localidadesa);
            console.log(localidadesa.options);
            console.log(localidadesa.value);
            /*for(let element in localidadesa){
                console.log(element);
            };*/
            let disponible = form.Disponible.checked;
            let localidad = form.Localidades.value;
            let fechaInicio = form.Fecha_inicio.value;
            let cantidadHuespedes = form.Cantidad_huespedes.value;

            let allData={
                disponible:disponible,
                localidad_id:localidad,
                fecha_inicio_disponibilidad:fechaInicio,
                cantidad_huespedes:cantidadHuespedes
            };

            //console.log(allData);

            let newData={};
            for(let key in allData){
                //console.log(key);
                if(allData[key] !== "" && allData[key] !== null && allData[key] !== undefined){
                    if(typeof allData[key]=== "boolean"){
                        if(allData[key]){
                            allData[key]=1;
                        }else{
                            allData[key]=0;
                        }
                    }
                    newData[key]=allData[key];
                }
            }

            //console.log(newData);
            let queryParams = new URLSearchParams(newData).toString();
            console.log(`propiedades?${queryParams}`);
            conexionServer(`propiedades?${queryParams}`,setData,setState,"GET");
            console.log(data);
            if(!filtrado){
                setFiltrado(true);
            }
        }else{
            if(filtrado){
                conexionServer(`propiedades`,setData,setState,"GET");
                setFiltrado(false);
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className='formFiltrado'>
            <div>
                <label htmlFor="Disponible">Disponible: </label>
                <input type="checkbox" name="Disponible" id="Disponible" />
            </div>
            <div>
                <label htmlFor="Localidades">Localidad: </label>
                <select name="Localidades" id="Localidades">
                    {localidades.length > 0 && localidades.map(localidad => (
                        <option key={localidad.id} value={localidad.id}>
                            {localidad.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="Fecha_inicio">Fecha de inicio: </label>
                <input type="date" name="Fecha_inicio" id="Fecha_inicio" />    
            </div>
            <div>
                <label htmlFor="Cantidad_huespedes">Cantidad de huespedes: </label>
                <input type="number" name="Cantidad_huespedes" id="Cantidad_huespedes" />    
            </div>
            <div className='button-container'>
                <ButtonComponent type="add" id="1" textContent='Aplicar Filtro'/>
                <ButtonComponent type="delete" id="2" textContent='Eliminar Filtro'/>
            </div>
        </form>
    );
}

export default FiltradoComponent;
