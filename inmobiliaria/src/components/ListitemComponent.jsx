import React from "react";
import '../assets/styles/ListitemComponent.css';

function ListItemComponent({ children }) {
  return (
    <li className="list-item">
      {children}
    </li>
  );
}

export default ListItemComponent;
