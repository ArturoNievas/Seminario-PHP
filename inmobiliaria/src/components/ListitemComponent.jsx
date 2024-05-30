import React from "react";
import '../assets/styles/ListitemComponent.css';

function ListItemComponent({ id, children }) {
  return (
    <li key={id} className="list-item">
      {children}
    </li>
  );
}

export default ListItemComponent;
