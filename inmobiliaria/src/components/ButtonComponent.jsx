import '../assets/styles/Button.css';

function ButtonComponent({ type , handleClick=null, params, textContent='', id='' }){
    const buttonText = {
        delete: "Eliminar",
        edit: "Editar",
        add: "Agregar",
        detail: "Detalle"
    }

    function manejadorClick(event){
        if(handleClick!=null){
            handleClick(event, params);
        }
    }

    return(
        <button id={id} className={'button-' + type} type="submit" onClick={(event)=>manejadorClick(event)}>
            <p>{`${textContent!=''? `${textContent}`: `${buttonText[type]}`}`}</p>
        </button>
    );
}

export default ButtonComponent;