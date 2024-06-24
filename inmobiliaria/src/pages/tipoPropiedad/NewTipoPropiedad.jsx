import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validarCampos from "../../utils/validarCampos";
import conexionServer from "../../utils/conexionServer";
import FormChangeDatos from "../../components/FormChangeDatos";

//hay variables que sobran me parece
function NewTipoPropiedad(){
    const navigate = useNavigate();
    const [data,setData] = useState({});
    const [state,setState] = useState("LOADING");
    const [errorMessage, setErrorMessage] = useState({});

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

        try {
            validarCampos(datos, validaciones);
            console.log(datos);

            conexionServer("tipos_propiedad", setData, setState, "POST", datos);
            if(state==="SUCCESS"){
                alert('Ingreso de datos exitoso.');
            
                setTimeout(() => {
                    navigate("/");
                }, 5000);
            }
        } catch (err) {
            setState("ERROR");
            let errorObject;
            try {
                errorObject = JSON.parse(err.message);
            } catch (parseError) {
                errorObject = { message: "Error inesperado. Por favor, inténtelo de nuevo más tarde." };
            }

            setErrorMessage(errorObject);
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