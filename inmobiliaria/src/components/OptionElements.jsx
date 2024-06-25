import { useEffect, useState } from "react";
import conexionServer from "../utils/conexionServer";
import '../assets/styles/InputCreacion.css';

function OptionElements({ param }){
    const [data,setData]=useState([]);

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
                    <option name={`${dato.id}`} id={`${dato.id}`} value={dato.id}>
                        {dato.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default OptionElements;