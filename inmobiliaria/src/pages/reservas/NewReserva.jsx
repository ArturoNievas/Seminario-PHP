import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import validarCampos from "../../utils/validarCampos";
import conexionServer from "../../utils/conexionServer";
import FormChangeDatos from "../../components/FormChangeDatos";

function NewReserva(){
    const navigate = useNavigate();
    const { id } = useParams();
    const [data,setData]=useState({});
    const [state,setState]=useState();
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(()=>{
        conexionServer(`propiedades/${id}`).then(event=>{
            setData(event.data);
            console.log(event.data)
        })
    },[]);

    async function sendData(event){
        event.preventDefault();

        let formData = new FormData(event.target);

        let datos={ propiedad_id: id };
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

            conexionServer("reservas", "POST", datos).then(() => {
                alert('Ingreso de datos exitoso.');
                navigate("/reserva");
            }).catch(error => {
                console.log(error.message);
                setState("ERROR");
                const parsedError = JSON.parse(error.message);
                setErrorMessage(parsedError); 
            });
            
        }catch (err) {
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
                titulo="Agregar una nueva Reserva" 
                handleSubmit={sendData} 
                params={["fecha_inicio_disponibilidad","cantidad_noches"]}
                state={state}
                data={data}
                errorMessage={errorMessage}
                camposDeSeleccion={["inquilino_id"]}
            />
        </>
    );
}

export default NewReserva;