import '../assets/styles/InputCreacion.css';

function InputCreacionElemento({ param, data }){
    return (
        <div className='ObjectCreacion'>
            <div className='LabelCreacion'>
                <label htmlFor={`${param}`}>{`Ingresar ${param}:`}</label>
            </div>
            <div className="InputCreacion">
                { param=='fecha_inicio_disponibilidad' || param=='fecha_desde' ?(
                    <input 
                        type="date" 
                        name={`${param}`} 
                        id={`${param}`} 
                        defaultValue={data ? data[param] : ''}
                        placeholder={`ingresar ${param}`}
                    />
                ): param=='imagen' ?(
                    <input 
                        type="file" 
                        name={`${param}`} 
                        id={`${param}`} 
                        accept="image/*"
                    />
                ) : (
                    <input 
                        type="text" 
                        name={`${param}`} 
                        id={`${param}`} 
                        defaultValue={data ? data[param] : ''}
                        placeholder={`ingresar ${param}`}
                    />
                )}
            </div>
        </div>
    );
}

export default InputCreacionElemento;