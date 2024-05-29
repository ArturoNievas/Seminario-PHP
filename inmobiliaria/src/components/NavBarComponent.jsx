import React from "react";
import imgX from '../assets/images/x.svg';
import '../assets/styles/NavBarComponent.css';

function NavBarComponent({value, handleClick}) {
    return (
        <>
            <nav>
                <button className="btn-cancel" onClick={handleClick}>
                    <img src={imgX} alt="btn-cancel" height="20px"/>
                </button>
                <ul className="lista">
                    <li>
                        <a href="#">Propiedades</a>
                    </li>
                    <li>
                        <a href="#">Reservas</a>
                    </li>
                    <li>
                        <a href="#">Tipo de propiedades</a>
                    </li>
                    <li>
                        <a href="#">Tipo de propiedades</a>
                    </li>
                </ul>
            </nav>
            <div className="capa-outside" onClick={handleClick}></div>
        </>
    );
}
  
export default NavBarComponent;