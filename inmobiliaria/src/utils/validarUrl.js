function validarUrl(url){
    try {
        new URL(url);
    } catch (e) {
        throw new Error(`URL inválida: ${url}`);
    }
}

export default validarUrl;