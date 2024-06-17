import React from "react";
import '../assets/styles/ListitemComponent.css';
import { useNavigate } from "react-router-dom";

function ListItemComponent({ propiedad, url, tipo, children }) {
  const navigate=useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    
    navigate(url,{ state: { propiedad } });
  };

  return (
    <form className="list-item" onSubmit={handleSubmit} method={tipo}>
      {children}
    </form>
  );
}

export default ListItemComponent;
