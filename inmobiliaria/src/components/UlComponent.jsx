import React from "react";
import '../assets/styles/ul.css';
import { Oval } from "react-loader-spinner";
import '../assets/styles/root.css';
import '../assets/styles/loading-oval.css';

function UlComponent({ data,state,childrenItem }){
    return (
            //este proceso se puede moduilarizar y siempre que entramos 
            //a un endpoint mostramos el oval hasta que cargue,
            //le pasamos un children para que muestre lo que sea cuando
            //status === "SUCCESS";
        <>
            {state==="SUCCESS" ? (
                <ul className='ul'>
                    {Array.isArray(data) && data.length > 0 &&(
                        data.map(item => childrenItem(item))
                    )}
                </ul>
            ) : state==="LOADING" ? (
                <div className="loading-oval-container">
                    <Oval
                        className="loading-oval"
                        visible={true}
                        color="var(--color-oval)"
                        secondaryColor="var(--color-oval)"
                        ariaLabel="oval-loading"
                    />
                </div>
            ) : (
                <p>No hay datos disponibles</p>
            )}
        </>
    );
}

export default UlComponent;