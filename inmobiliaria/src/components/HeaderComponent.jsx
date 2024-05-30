import '../assets/styles/HeaderComponent.css';
import imgList from '../assets/images/list.svg';
import logo from '../assets/images/zarla-real-viva-1x1-2400x2400-20210603-tvj4xbp97wqkbcyqj7dr.png';
import React, { useState } from "react";
import NavBarComponent from './NavBarComponent';

function HeaderComponent() {
    const [isOpen, setIsOpen] = useState(false);

    function handleClick() {
        setIsOpen(!isOpen);
    }

    return (
        <header>
            <div>
                <div className="desplegable-container" onClick={handleClick}>
                    <img src={imgList} alt="button-desplegable-list-anchors" height='35px'/>
                </div>
                {isOpen && <NavBarComponent value={isOpen} handleClick={handleClick}/>} 
            </div>
            <img className="logo" src={logo} alt="logo"/>
            <div></div>
        </header>
    );
}

export default HeaderComponent;
