import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validarCampos from "../../utils/validarCampos";
import conexionServer from "../../utils/conexionServer";
import FormChangeDatos from "../../components/FormChangeDatos";

//hay variables que sobran me parece
function NewReserva(){
    const navigate = useNavigate();
    const [data,setData]=useState({});
    const [state,setState]=useState("LOADING");
    const [errorMessage, setErrorMessage] = useState("");

    async function sendData(event){
        event.preventDefault();

        setState("LOADING");

        let formData = new FormData(event.target);

        let datos = {};
        formData.forEach((value, key) => {
            if(value==='true'){
                datos[key]=1;
            }else if(value==='false'){
                datos[key]=0;
            }else if(value!==''){
                datos[key] = value;
            }
        });

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
            validarCampos(datos,validaciones);

            conexionServer("reservas", setData, setState, "POST", datos);
            if(state==="SUCCESS"){
                alert('Reserva creada exitosamente.');
                navigate("/reserva");
            }
        }catch (err) {
            setState("ERROR");
            const errorObject = JSON.parse(err.message);
            setErrorMessage(errorObject);
        }
    }


    return(
        <>
            <FormChangeDatos 
                titulo="Agregar un nueva Propiedad" 
                handleSubmit={sendData} 
                params={["propiedad_id","inquilino_id","fecha_desde","cantidad_noches"]}
                state={state}
                errorMessage={errorMessage}
            />
        </>
    );
}

export default NewReserva;