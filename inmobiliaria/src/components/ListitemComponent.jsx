import React from "react";
import '../assets/styles/ListitemComponent.css';

function ListItemComponent({ clave, children }) {
  return (
    <li className="list-item" key={clave}>
      {children}
    </li>
  );
}

export default ListItemComponent;
