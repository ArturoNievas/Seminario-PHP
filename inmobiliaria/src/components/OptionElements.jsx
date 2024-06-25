import { useEffect, useState } from "react";
import conexionServer from "../utils/conexionServer";
import '../assets/styles/InputCreacion.css';

function OptionElements(content){
    const [data,setData]=useState([]);

    useEffect(()=>{
        console.log(content.param);
        conexionServer(`${content.param}`).then((response)=>{
            setData(response.data);
            console.log("SUCCESS");
        }).catch((error)=>{
            console.log(error);
        });
    },[]);

    return(
        <div className="ObjectCreacion">
            <label htmlFor="inquilino_id">Ingresar inquilino: </label>
            <select name="inquilino_id" id="inquilino_id">
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