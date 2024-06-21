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
        conexionServer(`propiedades/${id}`, setData, setState);
    },[]);

    const handleSubmit = async (event) => {
        event.preventDefault();
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

            conexionServer(`propiedades/${id}`, setData, setState, 'PUT', datos);
            
            if(state==="SUCCESS"){
                alert('Propiedad actualizada exitosamente.');
                navigate("/propiedad");
            }
        }catch (err) {
            setState("ERROR");
            const errorObject = JSON.parse(err.message);
            setErrorMessage(errorObject);
        }
    };

    return (
        <>
            <FormChangeDatos 
                titulo="Editar Propiedad" 
                handleSubmit={handleSubmit} 
                params={["domicilio","localidad_id","cantidad_habitaciones","cantidad_banios"
                    ,"cochera","cantidad_huespedes","fecha_inicio_disponibilidad","cantidad_dias"
                    ,"disponible","valor_noche","tipo_propiedad_id"]}
                state={state}
                errorMessage={errorMessage}
                data={data}
            />
        </>
    );
}

export default EditPropiedad;
