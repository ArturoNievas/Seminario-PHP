import { useState } from "react";
import ButtonComponent from "../ButtonComponent";
import InputCreacionElemento from "./InputCreacionElemento";
import conexionServer from "../../utils/conexionServer";

function CrearElemento({ params, endpoint, setDatosPadre ,setState }){
    let [data,setData]=useState(null);
    
    function handleChange(event){
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    }

    function handleClick(event){
        event.preventDefault();
        conexionServer(endpoint,setDatosPadre,setState,"POST",data);
    }

    return (
        <div>
            {params.map(param=>
                <InputCreacionElemento data={param} handleChange={handleChange}/>
            )}
            <ButtonComponent type="add" handleClick={handleClick}/>
        </div>
    );
}

export default CrearElemento;