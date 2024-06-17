import '../assets/styles/Button.css';

function ButtonComponent({ type , handleClick }){
    const buttonText = {
        delete: "Eliminar",
        edit: "Editar",
        add: "Agregar"
    }

    return(
        <button className={'button-' + type} type="submit" onClick={handleClick}>
            <p>{buttonText[type]}</p>
        </button>
    );
}

export default ButtonComponent;