import config from "./config";

function conexionServer(endpoint,setData=null, setState=null, method = "GET", newData={}){
    fetch(`${config.backendUrl}/${endpoint}`,{
        method: method,
        headers:{
            'Content-Type': 'application/json'
        },
        body: method !== "GET" ? JSON.stringify(newData) : null,
    })
        .then(response=>{
            if(!response.ok){
                throw new Error(response);
            }
            return response.json();
        })
        .then(dataJson=>{
            if(setData && setState){
                setData(dataJson.data);
                setState("SUCCESS");
            }
        })
        .catch(error=>{
            setState("Error");
            console.log("error: ",error);
            throw new Error(error);
        })
}

export default conexionServer;