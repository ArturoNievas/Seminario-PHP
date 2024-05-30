import config from "./config";

function conexionServer(endpoint,setData, setError){
    console.log("Intentando conectar a:", `${config.backendUrl}/${endpoint}`);
    fetch(`${config.backendUrl}/${endpoint}`)
        .then(response=>{
            if(!response.ok){
                throw new Error("error al conectarse a la base de datos");
            }
            return response.json();
        })
        .then(dataJson=>{
            if(dataJson.status=='success'){
                setData(dataJson.data);
            }else{
                throw new Error("error al hacer el fetch de los datos");
            }
        })
        .catch(error=>{
            setError(error);
            console.log("error: ",error);
        })
}

export default conexionServer;