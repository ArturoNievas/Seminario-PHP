import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import validarCampos from '../../utils/validarCampos';
import conexionServer from '../../utils/conexionServer';
import '../../assets/styles/root.css';
import '../../assets/styles/loading-oval.css';
import '../../assets/styles/editStyle.css';
import FormChangeDatos from '../../components/FormChangeDatos';

function EditTipoPropiedad() {
    let { id } = useParams();
    const [data, setData] = useState(null);
    const [state, setState] = useState("Loading");
    const [errorMessage, setErrorMessage] = useState({});
    const navigate=useNavigate();

    useEffect(()=>{
        conexionServer(`tipos_propiedad/${id}`).then( data => {
            setData(data.data);
            setState("SUCCESS");
        });
    },[]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        let nombre=event.target.nombre.value;
        const datos={"nombre":nombre};

        let validaciones = {
            'nombre': {
                'requerido': true,
                'longitud': 50
            }
        };

        try {
            validarCampos(datos,validaciones);
            conexionServer(`tipos_propiedad/${id}`, 'PUT', {nombre: datos.nombre}).then( () => {
                    alert('Tipo de propiedad actualizado exitosamente.');
                    navigate("/");
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
    };

    return (
        <>
            <FormChangeDatos 
                titulo="Editar Tipo de Propiedad" 
                handleSubmit={handleSubmit} 
                params={["nombre"]}
                state={state}
                errorMessage={errorMessage}
                data={data}
            />
        </>
    );
}

export default EditTipoPropiedad;
