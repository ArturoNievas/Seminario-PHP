import React, { useEffect, useState } from 'react';
import { useNavigate,useLocation, useParams } from 'react-router-dom';
import validarCampos from '../../utils/validarCampos';
import conexionServer from '../../utils/conexionServer';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';

function EditTipoPropiedad() {
    let { id } = useParams();
    const [data, setData] = useState(null);
    const [state, setState] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(()=>{
        conexionServer(`tipos_propiedad/${id}`, setData, setState);
    },[]);

    if (!data) {
        return <p>No hay datos disponibles.</p>;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log(data);

        let validaciones = {
            'nombre': {
                'requerido': true,
                'longitud': 50
            }
        };

        try {
            if (data == null || data ==""){
                throw new Error('nombre es requerido');
            } else if ( data > 50) {
                throw new Error('nombre debe tener a lo sumo 50 caracteres');
            }
            conexionServer(`tipos_propiedad/${id}`, setData, setState, 'PUT', {nombre: data});
            alert('Tipo de propiedad actualizado exitosamente.');
            navigate(`/`);
        } catch (err) {
            console.log(err);
            setState(err.message);
        }
    };

    return (
        <>
            <HeaderComponent />
            <div>
                <h4>Editar Tipo de Propiedad</h4>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="nombre"
                        defaultValue={data.nombre}
                        onChange={(e) => setData(e.target.value)}
                        placeholder="Ingresar nombre"
                    />
                    <button type="submit">Enviar</button>
                    {state == "ERROR" && <p style={{ color: 'red' }}>{state}</p>}
                </form>
            </div>
            <FooterComponent />
        </>
    );
}

export default EditTipoPropiedad;
