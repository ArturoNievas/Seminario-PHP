import React from 'react';
import conexionServer from '../utils/conexionServer';

function FiltradoComponent({ setData, setState }) {
    
    //NO FUNCIONA PERO ALGO ASI SERIA JAJA
    function handleSubmit(event) {
        event.preventDefault();
        let form = event.target;
        
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

        console.log(allData);

        let newData={};
        for(let key in allData){
            console.log(key);
            if(allData[key] !== "" && allData[key] !== null && allData[key] !== undefined){
                newData[key]=allData[key];
            }
        }

        console.log(newData);
        let queryParams = new URLSearchParams(newData).toString();
        console.log(queryParams);
        conexionServer(`propiedades?${queryParams}`,setData,setState,"GET");
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="Disponible">Disponible: </label>
            <input type="checkbox" name="Disponible" id="Disponible" />
            
            <label htmlFor="Localidades">Localidad: </label>
            <select name="Localidades" id="Localidades">
                {/* localidades */}
            </select>
            
            <label htmlFor="Fecha_inicio">Fecha de inicio: </label>
            <input type="date" name="Fecha_inicio" id="Fecha_inicio" />
            
            <label htmlFor="Cantidad_huespedes">Cantidad de huespedes: </label>
            <input type="number" name="Cantidad_huespedes" id="Cantidad_huespedes" />
            
            <button type="submit">Aplicar Filtro</button>
        </form>
    );
}

export default FiltradoComponent;
