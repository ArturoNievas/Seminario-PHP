import React, { useState } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import { Form, useNavigate } from "react-router-dom";
import conexionServer from "../../utils/conexionServer";

//no se como hacer esto :(
function NewTipoPropiedad(){
    const navigate = useNavigate;
    const [data,setData]=useState({});
    const [error,setError]=useState(null);

    //mandamos los datos el servidor
    function sendData(formData){

        //validar que el servidos nos retorno el status code 200 o el que sea
        //y nos pide mostrar una alert
        return new Promise((resolve, reject) => {
            
            conexionServer("tipos_propiedad",setData,setError,"POST",formData);
            
            if(error=null){
                // Mostramos la alerta
                alert('Ingreso de datos exitoso.');
            
                // Configuramos un temporizador para esperar 5 segundos
                setTimeout(() => {
                    console.log(data.status);
                    // Después de 5 segundos, resolvemos la promesa
                    resolve();
                }, 5000); // 5000 milisegundos = 5 segundos
            }else{
                reject(error)
            }
        });
    }
    
    // Esto se ejecutará después de que la alerta haya sido mostrada y hayan pasado 5 segundos
    //modificar url si es necesario
    sendData().then(() => {
        //useNavigate here
        navigate("/");
    });

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