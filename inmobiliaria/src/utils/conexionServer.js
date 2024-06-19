import config from "./config";

function conexionServer(endpoint,setData, setState, method = "GET", newData={}){
    fetch(`${config.backendUrl}/${endpoint}`,{
        method: method,
        headers:{
            'Content-Type': 'application/json'
        },
        body: (method === "GET" && Object.keys(newData).length === 0) ? null : JSON.stringify(newData),
    })
        .then(response=>{
            if(!response.ok){
                throw new Error(response);
            }
            if (response.status === 204) {
                return null;
            }
            return response.json();
        })
        .then(dataJson=>{
            if (dataJson) {
                setData(dataJson.data);
            } else {
                setData(null);
            }
            setState("SUCCESS");
        })
        .catch(error=>{
            setState(error);
            console.log("error: ",error);
        })
}

export default conexionServer;