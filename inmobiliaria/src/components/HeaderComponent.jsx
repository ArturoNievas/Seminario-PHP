import '../assets/styles/HeaderComponent.css';
import imgList from '../assets/images/list.svg';
import React, { useState, useEffect } from "react";
import NavBarComponent from './NavBarComponent';

function HeaderComponent() {
    const [isOpen, setIsOpen] = useState(false);

    function handleClick() {
        setIsOpen(!isOpen);
    }

    return (
        <header>
            <div>
                <button className="desplegable-container" onClick={handleClick}>
                    <img src={imgList} alt="..." height='20px'/>
                </button>
                {isOpen && <NavBarComponent value={isOpen} handleClick={handleClick}/>} 
            </div>
            <div>
                asda
            </div>
            aaa
            bbb
        </header>
    );
}

export default HeaderComponent;
