import React, { useState } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import { Form, useNavigate } from "react-router-dom";
import validarCampos from "../../utils/validarCampos";
import conexionServer from "../../utils/conexionServer";

//no se como hacer esto :(
function NewTipoPropiedad(){
    const navigate = useNavigate();
    const [data,setData]=useState({});
    const [error,setError]=useState(null);

    //mandamos los datos el servidor
   // Modifica esta sección en el frontend
async function sendData(event){
    event.preventDefault();
    const formData = new FormData(event.target);

    let datos = {};
    formData.forEach((value, key) => {
        datos[key] = value;
    });

    let validaciones = { 
        'nombre': {
            'requerido': true,
            'longitud': 50
        } 
    };

    try {
        validarCampos(datos, validaciones);
        console.log(datos);

        await conexionServer("tipos_propiedad", setData, setError, "POST", datos);
        
        alert('Ingreso de datos exitoso.');
        
        setTimeout(() => {
           navigate("/");
        }, 5000);
        
    } catch (error) {
        console.log(error);
    }
}


    return(
        <>
            <HeaderComponent />
            <main>
                <Form onSubmit={sendData}>
                    <input type="text" name="nombre" id="nombre" placeholder="Ingresar nombre"/>
                    <button type="submit">
                        <p>Enviar</p>
                    </button>
                </Form>
            </main>
            <FooterComponent />
        </>
    );
}

export default NewTipoPropiedad;