import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import validarCampos from '../../utils/validarCampos';
import conexionServer from '../../utils/conexionServer';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import { Oval } from "react-loader-spinner";
import '../../assets/styles/root.css';
import '../../assets/styles/loading-oval.css';
import '../../assets/styles/editStyle.css';

function EditTipoPropiedad() {
    let { id } = useParams();
    const [data, setData] = useState(null);
    const [state, setState] = useState("Loading");
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
            validarCampos(datos,validaciones);
            conexionServer(`tipos_propiedad/${id}`, setData, setState, 'PUT', {nombre: datos.nombre});
            alert('Tipo de propiedad actualizado exitosamente.');
            navigate("/");
        } catch (err) {
            setState(err.message);
        }
    };

    return (
        <>
            <HeaderComponent />
            {state==="Loading"?(
                <div className="loading-oval-container">
                    <Oval
                        className="loading-oval"
                        visible={true}
                        color="var(--color-oval)"
                        secondaryColor="var(--color-oval)"
                        ariaLabel="oval-loading"
                    />
                </div>
            ):(
                <main className="main-edit">
                    <h4>Editar Tipo de Propiedad</h4>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="nombre"
                            id="nombre"
                            defaultValue={data ? data.nombre : ''}
                            placeholder="Ingresar nombre"
                        />
                        <button type="submit">Enviar</button>
                        {state === "ERROR" && <p style={{ color: 'red' }}>{state}</p>}
                    </form>
                </main>
            )}
            <FooterComponent />
        </>
    );
}

export default EditTipoPropiedad;
