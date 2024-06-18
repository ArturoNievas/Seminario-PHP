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
                    <h3>Editar Tipo de Propiedad</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="nombre"
                            id="nombre"
                            defaultValue={data ? data.nombre : ''}
                            placeholder="Ingresar nombre"
                        />
                        <button type="submit">Enviar</button>
                    </form>
                    {state === "ERROR" && <p style={{ color: 'red' }}>{`${state}: ${errorMessage.nombre}`}</p>}
                </main>
            )}
            <FooterComponent />
        </>
    );
}

export default EditTipoPropiedad;
