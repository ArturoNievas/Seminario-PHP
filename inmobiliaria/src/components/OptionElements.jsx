import { useEffect, useState } from "react";
import conexionServer from "../utils/conexionServer";
import '../assets/styles/InputCreacion.css';

function OptionElements({ param, datos }){
    const [data,setData]=useState([]);

    useEffect(()=>{
        let url=param;
        if(param==='inquilino_id'){
            url='inquilinos';
        } else if(param === 'propiedad_id'){
            url='propiedades';
        }else if(param == 'localidad_id'){
            url='localidades';
        }else if(param == 'tipo_propiedad_id'){
            url='tipos_propiedad';
        }

        conexionServer(`${url}`).then((response)=>{
            setData(response.data);
            console.log("SUCCESS");
        }).catch((error)=>{
            console.log(error);
        });
    },[]);

    return(
        <div className="ObjectCreacion">
            <label htmlFor={`${param}`}>Ingresar {param}: </label>
            <select name={`${param}`} id={`${param}`}>
                <option value="">
                    Seleccionar {param=='localidad_id'?'localidad':param=='tipo_propiedad_id'?'tipo de propiedad':''}
                </option>
                {data && data.map((dato)=>(
                    <>
                        { datos && datos[param] && datos[param]===dato.id?(
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