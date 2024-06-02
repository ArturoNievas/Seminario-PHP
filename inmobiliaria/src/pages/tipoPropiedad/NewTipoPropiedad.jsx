import React, { useState } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import { Form, useNavigate } from "react-router-dom";
import conexionServer from "../../utils/conexionServer";

//no se como hacer esto :(
function NewTipoPropiedad(){
    const navigate = useNavigate();
    const [data,setData]=useState({});
    const [error,setError]=useState(null);

    //mandamos los datos el servidor
    async function sendData(event){
        event.preventDefault();
        const formData = new FormData(event.target);

        console.log(formData.get("nombre"));
        navigate("/");
        /*
        try{
            await conexionServer("tipos_propiedad",setData,setError,"POST",formData); 
            if(!error){
                alert('Ingreso de datos exitoso.');
            
                //no hace falta esperar pero lo puse para ver el mensaje.
                setTimeout(() => {
                    console.log(data.status);
                    
                    //modificar esto a conveniencia.
                    navigate("/");
                }, 5000);
            }else{
                throw new Error(error);
            }    
        }catch (err){
            console.error("Error:", err);
            alert("Error en el envío de datos");
        }
        */
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