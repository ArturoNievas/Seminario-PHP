import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import validarCampos from '../../utils/validarCampos';
import conexionServer from '../../utils/conexionServer';

function EditTipoPropiedad() {
    const { id } = useParams();
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchTipoPropiedad() {
            try {
                const data = await conexionServer(`tipos_propiedad/${id}`, setNombre, setError, 'GET');
                setNombre(data.nombre);
            } catch (err) {
                setError(err.message);
            }
        }
        fetchTipoPropiedad();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const datos = { nombre };

        let validaciones = {
            'nombre': {
                'requerido': true,
                'longitud': 50
            }
        };

        try {
            validarCampos(datos, validaciones);
            await conexionServer(`tipos_propiedad/${id}`, setNombre, setError, 'PUT', datos);
            alert('Tipo de propiedad actualizado exitosamente.');
            navigate('/tipoPropiedad');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Editar Tipo de Propiedad</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ingresar nombre"
                />
                <button type="submit">Enviar</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}

export default EditTipoPropiedad;
