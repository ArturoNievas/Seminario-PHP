import '../assets/styles/Button.css';

function ButtonComponent({ type , handleClick, params }){
    const buttonText = {
        delete: "Eliminar",
        edit: "Editar",
        add: "Agregar"
    }

    return(
        <button className={'button-' + type} type="submit" onClick={(event)=>handleClick(event, params)}>
            <p>{buttonText[type]}</p>
        </button>
    );
}

export default ButtonComponent;