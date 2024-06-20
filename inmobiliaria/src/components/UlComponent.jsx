import React from "react";
import '../assets/styles/ul.css';
import '../assets/styles/root.css';
import '../assets/styles/loading-oval.css';

function UlComponent({ data,state,childrenItem }){
    return (
        <ul className='ul'>
            {Array.isArray(data) && data.length > 0 &&(
                data.map(item => childrenItem(item))
            )}
        </ul>
    );
}

export default UlComponent;