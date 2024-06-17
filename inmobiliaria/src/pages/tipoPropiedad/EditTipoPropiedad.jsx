import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import ButtonComponent from "../../components/ButtonComponent";
import conexionServer from "../../utils/conexionServer";
import validarCampos from "../../utils/validarCampos";

function EditTipoPropiedad(){
    const location = useLocation();
    const [ data, setData ]=useState(null);
    const [ error, setError ]=useState(null);
    const datosUrl = location.state;

    if (!datosUrl) {
        return <p>No hay datos disponibles.</p>;
    }

    async function handleSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);

        let datos = {};
        formData.forEach((value, key) => {
            datos[key] = value;
        });

        console.log(datos);
    
        let validaciones = { 
            'nombre': {
                'requerido': true,
                'longitud': 50
            } 
        };
    
        try {
            validarCampos(datos, validaciones);
            console.log(datos);
    
            await conexionServer(`tipos_propiedad/${datosUrl.id}`, setData, setError, "PUT", datos);
            
            setTimeout(() => {
                alert('edicion de datos exitoso.');    
            }, 5000);
            
        } catch (error) {
            console.log(error);
        }
    }
  
    return (
      <>
        <HeaderComponent/>
        <main>
            <form onSubmit={handleSubmit}>
                <h4>Editar Tipo Propiedad</h4>
                <input type="text" name="nombre" id="nombre" defaultValue={datosUrl.nombre}/>
                <ButtonComponent type="edit"/>
            </form>
        </main>
        <FooterComponent/>
      </>
    );
}


export default EditTipoPropiedad;