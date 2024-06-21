import config from "./config";

function conexionServer(endpoint,setData, setState, method = "GET", newData={}, setErrorMessage){
    fetch(`${config.backendUrl}/${endpoint}`,{
        method: method,
        headers:{
            'Content-Type': 'application/json'
        },
        body: (method === "GET" && Object.keys(newData).length === 0) ? null : JSON.stringify(newData),
    })
        .then(response=>{
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
        .catch(error => {
            setState("ERROR");
            const parsedError = JSON.parse(error.message);
            setErrorMessage(parsedError); 
        });
}

export default conexionServer;