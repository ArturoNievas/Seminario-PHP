import React, { useEffect, useState } from 'react';
import conexionServer from '../utils/conexionServer';
import '../assets/styles/FiltradoComponent.css';
import ButtonComponent from './ButtonComponent';

function FiltradoComponent({ data, setState, setIds }) {
    const [filtrado,setFiltrado]=useState(false);
    const [localidades,setLocalidades]=useState([]);

    useEffect(()=>{
        conexionServer("localidades").then( response => {
            setLocalidades(response.data);
            setState("SUCCESS");
          });
    },[]);

    function handleSubmit(event) {
        event.preventDefault();
        let buttonId=event.nativeEvent.submitter.id;
        let form = event.target;
        if(buttonId==1){
            let disponible = form.Disponible.checked;
            let localidad = form.Localidades.value;

            console.log(localidad)

            let fechaInicio = form.Fecha_inicio.value;
            let cantidadHuespedes = form.Cantidad_huespedes.value;

            let allData={
                disponible:disponible,
                localidad_id:localidad,
                fecha_inicio_disponibilidad:fechaInicio,
                cantidad_huespedes:cantidadHuespedes
            };

            console.log(allData);

            let newData={};
            for(let key in allData){
                console.log(key);
                if(allData[key] !== "" && allData[key] !== null && allData[key] !== undefined){
                    console.log(allData[key]);  
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

            let queryParams = new URLSearchParams(newData).toString();
            console.log(`propiedades?${queryParams}`);
            conexionServer(`propiedades?${queryParams}`).then( response => {
                let datos=response.data;
                let ids=[];

                datos.forEach(element => {
                    ids.push(element.id);
                });

                console.log("ids: ",ids);
                setIds(ids);
                setState("SUCCESS");
            });
            if(!filtrado){
                setFiltrado(true);
            }
        }else{
            if(filtrado){
                conexionServer(`propiedades`).then( response => {
                    console.log(data);
                    let ids=[];
                    
                    data.forEach(element=>{
                        ids.push(element.id);
                    });
                    
                    setIds(ids);
                    setState("SUCCESS");
                });
                setFiltrado(false);
                form.reset();
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
                    <option key="0" value="">
                        Seleccione una localidad
                    </option>
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
