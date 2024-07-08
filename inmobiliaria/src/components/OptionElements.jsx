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

        //ineficiente, mejorar
        conexionServer(`${url}`).then((response)=>{
            let datos=response.data;
            if(url=='propiedades'){
                let arr=[];
                datos.forEach(element => {
                    if(Number(element.disponible)==1){
                        arr.push(element);
                    }
                });
                setData(arr);
            }else if(url=='inquilinos'){
                let arr=[];
                datos.forEach(element => {
                    if(Number(element.activo)==1){
                        arr.push(element);
                    }
                });
                setData(arr);
            }else{
                setData(datos);
            }
            console.log("SUCCESS");
        }).catch((error)=>{
            console.log(error);
        });
    },[]);

    function renderSwitch(param){
        switch(param){
            case 'localidad_id':
                return 'localidad';
            case 'tipo_propiedad_id':
                return 'tipo de propiedad';
            case 'inquilino_id':
                return 'inquilino';
            case 'propiedad_id':
                return 'propiedad';
        }
    }

    return(
        <div className="ObjectCreacion">
            <label htmlFor={`${param}`}>Ingresar {renderSwitch(param)}: </label>
            <select name={`${param}`} id={`${param}`}>
                <option value="">
                    Seleccionar {renderSwitch(param)}
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