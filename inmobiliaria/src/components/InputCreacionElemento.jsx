function input({ param, data }){
    return (
        <>
            <input 
                type="text" 
                name={`${param}`} 
                id={`${param}`} 
                defaultValue={data ? data[param] : ''}
                placeholder={`ingresar ${param}`}
            />
        </>
    );
}

export default input;