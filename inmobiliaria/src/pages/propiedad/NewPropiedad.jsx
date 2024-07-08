import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validarCampos from "../../utils/validarCampos";
import conexionServer from "../../utils/conexionServer";
import FormChangeDatos from "../../components/FormChangeDatos";

function NewPropiedad(){
    const navigate = useNavigate();
    const [state,setState]=useState();
    const [errorMessage, setErrorMessage] = useState("");

    async function sendData(event){
        event.preventDefault();

        setState("LOADING");

        let formData = new FormData(event.target);

        let datos = {};
        for (let key of formData.keys()) {
            let value = formData.get(key);

            if (key === 'disponible' && (value === 'true' || value === '1')) {
                datos[key] = 1;
            } else if (key === 'disponible' && (value === 'false' || value === '0')) {
                datos[key] = 0;
            } else if (value !== '') {
                if (key === 'localidades_id') {
                    datos["localidad_id"] = value;
                } else if (key === 'tipos_propiedad_id') {
                    datos["tipo_propiedad_id"] = value;
                } else if (key === 'imagen' && value.size > 0) {
                    try {
                        let base64 = await new Promise((resolve, reject) => {
                            let reader = new FileReader();
                            reader.onloadend = () => {
                                resolve(reader.result);
                            };
                            reader.onerror = reject;
                            reader.readAsDataURL(value);
                        });
                        let parts = base64.match(/^data:image\/([a-z0-9]+);base64,(.+)$/);
                        datos['imagen'] = parts[2];
                        datos['tipo_imagen'] = parts[1];
                    } catch (error) {
                        console.error("Error reading file:", error);
                    }
                } else {
                    datos[key] = value;
                }
            }
        }

        let validaciones = { 
            'domicilio': {
                'requerido': true,
                'longitud': 25
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

            conexionServer("propiedades", "POST", datos).then( () => {
                setState("SUCCESS");
                alert('Ingreso de datos exitoso.');
                navigate("/propiedad");
            }).catch( err => {
                setState("ERROR");
                let errorObject;
                try {
                    errorObject = JSON.parse(err.message);
                } catch (parseError) {
                    errorObject = { message: "Error inesperado. Por favor, inténtelo de nuevo más tarde." };
                }

                setErrorMessage(errorObject);
            });
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

    // Función para leer un archivo como URL de datos (base64)
    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return(
        <>
            <FormChangeDatos 
                titulo="Agregar un nueva Propiedad" 
                handleSubmit={sendData} 
                params={["domicilio","cantidad_habitaciones","cantidad_banios"
                    ,"cochera","cantidad_huespedes","fecha_inicio_disponibilidad","cantidad_dias"
                    ,"disponible","valor_noche","imagen (accesible desde el navegador)","tipo_imagen"]}
                state={state}
                errorMessage={errorMessage}
                camposDeSeleccion={["localidad_id","tipo_propiedad_id"]}
            />
        </>
    );
}

export default NewPropiedad;