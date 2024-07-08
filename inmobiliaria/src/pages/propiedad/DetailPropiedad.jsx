import { useState, useEffect } from "react";
import FooterComponent from "../../components/FooterComponent";
import HeaderComponent from "../../components/HeaderComponent";
import conexionServer from "../../utils/conexionServer";
import { useParams } from "react-router-dom";
import '../../assets/styles/Detail.css';
import { Oval } from "react-loader-spinner";

function VerDetalle(){
    const [datos, setDatos]=useState(null);
    const { id }=useParams();
    const [localidad,setLocalidad]=useState(null);
    const [tipoPropiedad,setTipoPropiedad]=useState(null);

    useEffect(()=>{
        conexionServer(`propiedades/${id}`).then(respuesta=>{
            let datos=respuesta.data;
            setDatos(datos);
            conexionServer(`localidades/${datos['localidad_id']}`).then(response=>{
                setLocalidad(response.data);
            });
            conexionServer(`tipos_propiedad/${datos['tipo_propiedad_id']}`).then(response=>{
                setTipoPropiedad(response.data);
            });
        });

    },[]);

    return(
        <>
            <HeaderComponent />
            <main className="details-main">
                <>
                    {datos && localidad && tipoPropiedad && Object.keys(datos).length > 0 ? (
                        <>
                        <h3>{`Detalles de la propiedad: ${datos['domicilio']}`}</h3>
                        <div className="details-container">
                            {Object.keys(datos).map((key, index) => (
                                <>
                                    {datos[key]!=null && key!='id' && key!='domicilio' &&(
                                        <div className="details-item">
                                            {key=='localidad_id' ? (
                                                <>
                                                    <p>{`localidad:`}</p>
                                                    <p>{localidad.nombre}</p>
                                                </>
                                            ): key=='tipo_propiedad_id' ? (
                                                <>
                                                    <p>{`tipo de propiedad:`}</p>
                                                    <p>{tipoPropiedad.nombre}</p>
                                                </>
                                            ): key == 'disponible' || key == 'cochera'? (
                                                <>
                                                    <p>{`${key}:`}</p>
                                                    <p>{datos[key]==1?'Si':'No'}</p>
                                                </>
                                            ):(
                                                <>
                                                    <p>{`${key}:`}</p>
                                                    <p>{datos[key]}</p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </>
                            ))}
                        </div>
                        </>
                    ) : (
                        <Oval
                            className="loading-oval"
                            visible={true}
                            color="var(--color-oval)"
                            secondaryColor="var(--color-oval)"
                            ariaLabel="oval-loading"
                        />
                    )}
                </>
            </main>
            <FooterComponent />
        </>
    );
}

export default VerDetalle;