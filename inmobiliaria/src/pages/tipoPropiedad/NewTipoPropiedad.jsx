import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validarCampos from "../../utils/validarCampos";
import conexionServer from "../../utils/conexionServer";
import FormChangeDatos from "../../components/FormChangeDatos";

//hay variables que sobran me parece
function NewTipoPropiedad(){
    const navigate = useNavigate();
    const [data,setData]=useState({});
    const [state,setState]=useState("LOADING");
    const [errorMessage, setErrorMessage] = useState("");

    async function sendData(event){
        event.preventDefault();
        const formData = new FormData(event.target);

        let datos = {};
        formData.forEach((value, key) => {
            datos[key] = value;
        });

        let validaciones = { 
            'nombre': {
                'requerido': true,
                'longitud': 50
            } 
        };

        validarCampos(datos, validaciones, setState, setErrorMessage);
        
        if(state!=="ERROR"){
            conexionServer("tipos_propiedad", setData, setState, "POST", datos, setErrorMessage);
            
            if(state==="SUCCESS"){
                alert('Ingreso de datos exitoso.');
            
                setTimeout(() => {
                    navigate("/");
                }, 5000);
            }
        }
    }


    return(
        <>
            <FormChangeDatos 
                titulo="Agregar un nuevo Tipo de Propiedad" 
                handleSubmit={sendData} 
                params={["nombre"]}
                state={state}
                errorMessage={errorMessage}
            />
        </>
    );
}

export default NewTipoPropiedad;