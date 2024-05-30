import React from "react";
import imgX from '../assets/images/x.svg';
import '../assets/styles/NavBarComponent.css';
import { NavLink } from "react-router-dom";

function NavBarComponent({value, handleClick}) {
    return (
        <>
            <nav>
                <div className="btn-cancel" onClick={handleClick}>
                    <img src={imgX} alt="btn-cancel" height="35px"/>
                </div>
                <ul className="lista">
                    <li>
                        <NavLink to="/propiedad">Propiedades</NavLink>
                    </li>
                    <li>
                        <NavLink to="/reserva">Reservas</NavLink>
                    </li>
                    <li>
                        <NavLink to="/tipoPropiedad">Tipo de propiedades</NavLink>
                    </li>
                </ul>
            </nav>
            <div className="capa-outside" onClick={handleClick}></div>
        </>
    );
}
  
export default NavBarComponent;