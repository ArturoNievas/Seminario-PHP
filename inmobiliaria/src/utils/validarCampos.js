/*
para guiarme

$validacion = [
    'apellido' => [
        'requerido',
        'longitud' => 15
    ],
    'nombre' => [
        'requerido',
        'longitud' => 25
    ],
    'documento' => [
        'requerido',
        'int'
    ],
    'email' => [
        'requerido',
        'longitud' => 20
    ],
    'activo' => [
        'requerido',
        'bool'
    ]
];
*/

function validarCampos(datos,validacion){
    let errores=[];

    for(let campo in validacion){
        let existe=((datos[campo]!==null) && (datos[campo]!==''));
        for(let regla in validacion[campo]){
            switch(regla){
                case 'requerido':
                    if(!existe){
                        errores[campo] = campo + " es requerido.";
                    }
                    break;
                case 'bool':
                    if (existe && typeof datos[campo] !== 'boolean') {
                        errores[campo] = campo + " debe ser un valor booleano.";
                    }
                    break;
                case 'int':
                    if (existe && !Number.isInteger(Number(datos[campo]))) {
                        errores[campo] = campo + " debe ser un entero.";
                    }
                    break;
                case 'fecha':
                    if (existe && isNaN(Date.parse(datos[campo]))) {
                        errores[campo] = campo + " debe ser una fecha válida.";
                    }
                    break;
                case 'double':
                    if (existe && isNaN(parseFloat(datos[campo]))) {
                        errores[campo] = campo + " debe ser un número.";
                    }
                    break;
                case 'longitud':
                    if (existe && datos[campo].length > validacion[campo][regla]) {
                        errores[campo] = campo + " debe tener un máximo de " + validacion[campo][regla] + " caracteres.";
                    }
                    break;
                default:
                    break;
            }
        }
    }

    if(errores.length>0){
        throw new Error(errores);
    }
}

export default validarCampos;