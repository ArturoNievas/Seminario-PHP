import '../assets/styles/Button.css';

function ButtonComponent({ type }){
    const buttonText = {
        delete: "Eliminar",
        edit: "Editar",
        add: "Agregar"
    }

    return(
        <button className={'button-'+type}>
            <p>{buttonText[type]}</p>
        </button>
    );
}

export default ButtonComponent;