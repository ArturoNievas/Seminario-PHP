import React from "react";
import '../assets/styles/ul.css';
import '../assets/styles/root.css';
import '../assets/styles/loading-oval.css';

function UlComponent({ data,childrenItem, filtro=null }){
    return (
        <ul className='ul'>
            {Array.isArray(data) && data.length > 0 &&(
                data.map(item => { 
                    if(filtro===null || filtro.some(element => element === item.id)){
                        return childrenItem(item)
                    }
                })
            )}
        </ul>
    );
}

export default UlComponent;