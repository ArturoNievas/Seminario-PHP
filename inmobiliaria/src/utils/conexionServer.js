import config from "./config";

function conexionServer(endpoint, method = "GET", newData={}){
    console.log(`${config.backendUrl}/${endpoint}`);
    console.log("newData: ",newData);
    console.log((method === "GET" && Object.keys(newData).length === 0) ? null : JSON.stringify(newData));
    return fetch(`${config.backendUrl}/${endpoint}`,{
        method: method,
        headers:{
            'Content-Type': 'application/json'
        },
        body: (method === "GET" && Object.keys(newData).length === 0) ? null : JSON.stringify(newData),
    })
        .then(response=>{
            console.log("llegue");
            if(!response.ok){
                return response.text().then(text => {
                    try {
                        const errorData = JSON.parse(text);
                        throw new Error(JSON.stringify(errorData));
                    } catch (e) {
                        throw new Error(text);
                    }
                });
            }
            if (response.status === 204) {
                return null;
            }
            console.log("hola");
            console.log("respuesta: ",response);
            return response.json();
        });
}

export default conexionServer;