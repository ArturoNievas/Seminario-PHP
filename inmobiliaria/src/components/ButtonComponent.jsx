import '../assets/styles/Button.css';
import conexionServer from "../utils/conexionServer";

function ButtonComponent({ type , elemento , handleClick=null }){
    const buttonText = {
        delete: "Eliminar",
        edit: "Editar",
        add: "Agregar"
    }

    clickHandler (() => {
        if(type="edit") {
            navigate(`${url}/${type}`);
        } else if (type="delete") {
            conexionServer(`tipos_propiedad/{${elemento.id}}`, setData, setError, "DELETE")
        } else {

        }
    })

    return(
        <button className={'button-'+type} type="submit" onClick={handleClick({type})}>
            <p>{buttonText[type]}</p>
        </button>
    );
}

export default ButtonComponent;