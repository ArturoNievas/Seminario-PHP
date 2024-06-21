import '../assets/styles/InputCreacion.css';

function input({ param, data }){
    return (
        <div className='ObjectCreacion'>
            <div className='LabelCreacion'>
                <label htmlFor={`${param}`}>{`Ingresar ${param}:`}</label>
            </div>
            <div className="InputCreacion">
                <input 
                    type="text" 
                    name={`${param}`} 
                    id={`${param}`} 
                    defaultValue={data ? data[param] : ''}
                    placeholder={`ingresar ${param}`}
                />
            </div>
        </div>
    );
}

export default input;