import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import validarCampos from "../../utils/validarCampos";
import conexionServer from "../../utils/conexionServer";
import FormChangeDatos from "../../components/FormChangeDatos";

function NewReserva(){
    const navigate = useNavigate();
    const [state,setState]=useState();
    const [errorMessage, setErrorMessage] = useState(""); 

    async function sendData(event){
        event.preventDefault();

        let formData = new FormData(event.target);

        let datos={};
        formData.forEach((value, key) => {
            if(value==='true'){
                datos[key]=1;
            }else if(value==='false'){
                datos[key]=0;
            }else if(value!==''){
                datos[key] = value;
            }
        });

        console.log("holaa");

        let validaciones = { 
            'propiedad_id': {
                'requerido': true,
                'int':50
            },
            'inquilino_id' : {
                'requerido':true,
                'int':50
            },
            'fecha_desde' : {
                'requerido':true,
                'fecha':50
            },
            'cantidad_noches' : {
                'requerido':true,
                'int':50
            }
        };

        try {
            console.log("pincho?")
            validarCampos(datos,validaciones);
            console.log("pase las validaciones")

            conexionServer("reservas", "POST", datos).then(() => {
                alert('Ingreso de datos exitoso.');
                navigate("/reserva");
            }).catch(err => {
                setState("ERROR");
                let errorObject;
                try {
                    errorObject = JSON.parse(err.message);
                } catch (parseError) {
                    errorObject = { message: "Error inesperado. Por favor, inténtelo de nuevo más tarde." };
                }

                setErrorMessage(errorObject);
            });
            
        }catch (err) {
            setState("ERROR");
            console.log(err);
            let errorObject;
            try {
                errorObject = JSON.parse(err.message);
            } catch (parseError) {
                errorObject = { message: "Error inesperado. Por favor, inténtelo de nuevo más tarde." };
            }

            setErrorMessage(errorObject);
        }
    }

    //si cambio el inquilino_id por inquilinos el select funciona pero 
    //aca no me saltan los errores porq para que salte tendria que ser el campo
    // === inquilino_id y es inquilinos
    return(
        <>
            <FormChangeDatos 
                titulo="Agregar una nueva Reserva" 
                handleSubmit={sendData} 
                params={["fecha_desde","cantidad_noches"]}
                state={state}
                errorMessage={errorMessage}
                camposDeSeleccion={["inquilino_id","propiedad_id"]}
            />
        </>
    );
}

export default NewReserva;