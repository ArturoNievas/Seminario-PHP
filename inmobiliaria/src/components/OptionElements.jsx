import { useEffect, useState } from "react";
import conexionServer from "../utils/conexionServer";
import '../assets/styles/InputCreacion.css';

function OptionElements({ param, datos }){
    const [data,setData]=useState([]);

    let defaultId;
    if(param==='inquilinos'){
        defaultId=datos['inquilino_id'];
    } else if(param === 'propiedades'){
        defaultId=datos['propiedad_id'];
    }

    useEffect(()=>{
        console.log(param);
        conexionServer(`${param}`).then((response)=>{
            setData(response.data);
            console.log("SUCCESS");
        }).catch((error)=>{
            console.log(error);
        });
    },[]);

    return(
        <div className="ObjectCreacion">
            <label htmlFor={`${param}_id`}>Ingresar {param}: </label>
            <select name={`${param}_id`} id={`${param}_id`}>
                {data && data.map((dato)=>(
                    <>
                        {defaultId===dato.id?(
                            <option name={`${dato.id}`} id={`${dato.id}`} value={dato.id} selected> 
                                {dato.nombre !== undefined ? dato.nombre : dato.domicilio}
                            </option>
                        ) : ( 
                            <option name={`${dato.id}`} id={`${dato.id}`} value={dato.id}>
                                {dato.nombre !== undefined ? dato.nombre : dato.domicilio}
                            </option>
                        )}
                    </>
                ))}
            </select>
        </div>
    );
}

export default OptionElements;