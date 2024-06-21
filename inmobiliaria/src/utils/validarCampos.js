import validarUrl from "./validarUrl";

function validarCampos(datos, validacion) {
    let errores = {};

    for (let campo in validacion) {
        let existe = (datos[campo] !== null && datos[campo] !== '' && datos[campo]!==undefined);
        
        for (let regla in validacion[campo]) {
            if (regla === 'requerido' && validacion[campo][regla]) {
                if (!existe) {
                    errores[campo] = campo + " es requerido.";
                }
            } else if (regla === 'bool' && existe) {
                if (datos[campo] !== 1 && datos[campo] !== 0) {
                    errores[campo] = campo + " debe ser un valor booleano.";
                }
            } else if (regla === 'int' && existe) {
                if (!Number.isInteger(Number(datos[campo]))) {
                    errores[campo] = campo + " debe ser un entero.";
                }
            } else if (regla === 'fecha' && existe) {
                if (isNaN(Date.parse(datos[campo]))) {
                    errores[campo] = campo + " debe ser una fecha válida (formato yyyy-mm-dd).";
                }
            } else if (regla === 'double' && existe) {
                if (isNaN(parseFloat(datos[campo]))) {
                    errores[campo] = campo + " debe ser un número.";
                }
            } else if (regla === 'url' && existe) {
                validarUrl(datos[campo]);
            } else if (regla === 'longitud' && existe) {
                if (datos[campo].length > validacion[campo][regla]) {
                    errores[campo] = campo + " debe tener un máximo de " + validacion[campo][regla] + " caracteres.";
                }
            }
        }
    }

    if (Object.keys(errores).length > 0) {
        throw new Error(JSON.stringify(errores));
    }
}

export default validarCampos;