import React from "react";
import '../assets/styles/ul.css';

function UlComponent({ data,childrenItem }){
    return (
        <ul className='ul'>
            {Array.isArray(data) && data.length > 0 ? (
                data.map(item => childrenItem(item))
            ) : (
                <p>No hay datos disponibles</p>
            )}
        </ul>
    );
}

export default UlComponent;