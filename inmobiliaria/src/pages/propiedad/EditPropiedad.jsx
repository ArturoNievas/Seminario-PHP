import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import validarCampos from '../../utils/validarCampos';
import conexionServer from '../../utils/conexionServer';
import '../../assets/styles/root.css';
import '../../assets/styles/loading-oval.css';
import '../../assets/styles/editStyle.css';
import FormChangeDatos from '../../components/FormChangeDatos';

//lo unico que no anda es cuando le editas un boolean.
function EditPropiedad() {
    let { id } = useParams();
    const [data, setData] = useState(null);
    const [state, setState] = useState("Loading");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(()=>{
        setState("LOADING");
        conexionServer(`propiedades/${id}`)
        .then(data => {
            console.log("Data", data);
            setData(data.data);
            setState("SUCCESS");
        })
        .catch(() => setState("ERROR"));
    },[]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        let formData = new FormData(event.target);


        let datos = {};
        formData.forEach((value, key) => {
            if(value==='true' || value==='1'){
                datos[key]=1;
            }else if(value==='false' || value==='0'){
                datos[key]=0;
            }else if(value!==''){
                if(key == 'localidades_id'){
                    datos["localidad_id"]=value;
                }else if(key == 'tipos_propiedad_id'){
                    datos["tipo_propiedad_id"]=value;
                }else{
                    datos[key] = value;
                }
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
            validarCampos(datos,validaciones);

            conexionServer(`propiedades/${id}`, "PUT", datos).then(() => {
                alert('Propiedad actualizada exitosamente.');
                navigate("/propiedad");
            }).catch(err => {
                setState("ERROR");
                let errorObject;
                try {
                    errorObject = JSON.parse(err.message);
                } catch (parseError) {
                    errorObject = { message: "Error inesperado. Por favor, inténtelo de nuevo más tarde." };
                }

                setErrorMessage(errorObject);
                //const parsedError = JSON.parse(error.message);
                //setErrorMessage(parsedError); 
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
    };

    return (
        <>
            <FormChangeDatos 
                titulo="Editar Propiedad" 
                handleSubmit={handleSubmit} 
                params={["domicilio","cantidad_habitaciones","cantidad_banios"
                    ,"cochera","cantidad_huespedes","fecha_inicio_disponibilidad","cantidad_dias"
                    ,"disponible","valor_noche"]}
                state={state}
                errorMessage={errorMessage}
                data={data}
                camposDeSeleccion={["localidad_id","tipo_propiedad_id"]}
            />
        </>
    );
}

export default EditPropiedad;
