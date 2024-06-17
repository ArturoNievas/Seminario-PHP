import React, { useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import validarCampos from '../../utils/validarCampos';
import conexionServer from '../../utils/conexionServer';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';

function EditTipoPropiedad() {
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const datosUrl = location.state;

    if (!datosUrl) {
        return <p>No hay datos disponibles.</p>;
    }

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
            await conexionServer(`tipos_propiedad/${datosUrl.id}`, setNombre, setError, 'PUT', datos);
            alert('Tipo de propiedad actualizado exitosamente.');
            
        } catch (err) {
            setError(err.message);
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
                        defaultValue={datosUrl.nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ingresar nombre"
                    />
                    <button type="submit">Enviar</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </div>
            <FooterComponent />
        </>
    );
}

export default EditTipoPropiedad;
