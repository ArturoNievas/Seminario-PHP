import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validarCampos from "../../utils/validarCampos";
import conexionServer from "../../utils/conexionServer";
import FormChangeDatos from "../../components/FormChangeDatos";

//hay variables que sobran me parece
function NewPropiedad(){
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
                console.log(typeof datos[key]);
            }else if(value!==''){
                datos[key] = value;
            }
        });

        let validaciones = { 
            'domicilio': {
                'requerido': true,
                'longitud': 25
            },
            'tipo_imagen': {
                'url': true,
                'longitud': 50
            },
            'localidad_id' : {
                'requerido':true,
                'int':50
            },
            'cantidad_habitaciones' : {
                'int':50
            },
            'cantidad_banios' : {
                'int':50
            },
            'cochera' : {
                'bool':true
            },
            'cantidad_huespedes' : {
                'requerido':true,
                'int':50
            },
            'fecha_inicio_disponibilidad' : {
                'requerido':true,
                'fecha':20
            },
            'cantidad_dias' : {
                'requerido':true,
                'int':50
            },
            'disponible' : {
                'requerido':true,
                'bool':true
            },
            'valor_noche' : {
                'requerido':true,
                'double':2.0
            },
            'tipo_propiedad_id' : {
                'requerido':true,
                'int':50
            }
        };

        try {
            validarCampos(datos, validaciones);

            conexionServer("propiedades", setData, setState, "POST", datos);
             
            if(state==="SUCCESS"){
                alert('Ingreso de datos exitoso.');

                setTimeout(() => {
                    navigate("/propiedad");
                }, 5000);
            }
        } catch (err) {
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
                params={["domicilio","localidad_id","cantidad_habitaciones","cantidad_banios"
                    ,"cochera","cantidad_huespedes","fecha_inicio_disponibilidad","cantidad_dias"
                    ,"disponible","valor_noche","tipo_propiedad_id","imagen (accesible desde el navegador)","tipo_imagen"]}
                state={state}
                errorMessage={errorMessage}
            />
        </>
    );
}

export default NewPropiedad;