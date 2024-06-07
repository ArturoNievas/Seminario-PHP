import config from "./config";

function conexionServer(endpoint,setData, setState, method = "GET", newData={}){
    // Convertir FormData a un objeto JSON
    /*const jsonData = {};
    newData.forEach((value, key) => {
        jsonData[key] = value;
    });*/
    fetch(`${config.backendUrl}/${endpoint}`,{
        method: method,
        headers:{
            'Content-Type': 'application/json'
        },
        body: method !== "GET" ? JSON.stringify(newData) : null,
    })
        .then(response=>{
            if(!response.ok){
                throw new Error("error al conectarse a la base de datos");
            }
            return response.json();
        })
        .then(dataJson=>{
            if(dataJson.status=='success'){
                setData(dataJson.data);
                setState("SUCCESS");
            }else{
                throw new Error("error al hacer el fetch de los datos");
            }
        })
        .catch(error=>{
            setState("Error");
            console.log("error: ",error);
            throw new Error(error);
        })
}

export default conexionServer;