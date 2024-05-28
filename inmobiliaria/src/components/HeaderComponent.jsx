import '../assets/styles/HeaderComponent.css';
import imagen1 from '../assets/images/png-transparent-hamburger-button-hot-dog-computer-icons-pancake-hot-dog-share-icon-navbar-menu-thumbnail.png';
import imagen2 from '../assets/images/pngwing.com.png';
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
                    <img src={imagen1} alt="..." height='20px'/>
                </button>
                {isOpen && <NavBarComponent />} 
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
