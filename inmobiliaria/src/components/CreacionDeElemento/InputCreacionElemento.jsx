function input({ data, handleChange }){
    return (
        <>
            <input 
                type="text" 
                name={`${data}`} 
                id={`${data}`} 
                placeholder={`ingresar ${data}`}
                onChange={handleChange}
            />
        </>
    );
}

export default input;