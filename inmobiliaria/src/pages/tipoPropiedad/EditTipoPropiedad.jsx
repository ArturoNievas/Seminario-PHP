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
    const [errorMessage, setErrorMessage] = useState("");
    const navigate=useNavigate();

    useEffect(()=>{
        conexionServer(`tipos_propiedad/${id}`, setData, setState);
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
            console.log('entre');
            validarCampos(datos,validaciones);
            console.log('sali');
            conexionServer(`tipos_propiedad/${id}`, setData, setState, 'PUT', {nombre: datos.nombre});
            alert('Tipo de propiedad actualizado exitosamente.');
            navigate("/");
        } catch (err) {
            setState("ERROR");
            const errorObject = JSON.parse(err.message);
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
