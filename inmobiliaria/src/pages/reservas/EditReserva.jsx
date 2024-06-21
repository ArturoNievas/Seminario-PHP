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
    const navigate=useNavigate();

    useEffect(()=>{
        conexionServer(`reservas/${id}`, setData, setState);
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

            conexionServer(`reservas/${id}`, setData, setState, 'PUT', datos);
            if(state==="SUCCESS"){
                alert('Reserva actualizada exitosamente.');
                navigate("/reserva");
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
                titulo="Editar reserva" 
                handleSubmit={handleSubmit} 
                params={["propiedad_id","inquilino_id","fecha_desde","cantidad_noches"]}
                state={state}
                errorMessage={errorMessage}
                data={data}
            />
        </>
    );
}

export default EditPropiedad;
