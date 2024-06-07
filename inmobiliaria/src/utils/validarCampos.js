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

    for(let reglas in validacion){
        let existe=((datos[reglas]!==null) && (datos[reglas]!==''));
        for(let regla in validacion[reglas]){
            switch(regla){
                case 'requerido':
                    if(!existe){
                        errores.push(`El campo ${reglas} es requerido`);
                    }
                    break;
                case 'bool':
                    console.log('bool');
                    break;
                case 'int':
                    console.log('int');
                    break;
                case 'fecha':
                    console.log('fecha');
                    break;
                case 'double':
                    console.log('double');
                    break;
                default:
                    if(existe && datos[reglas].length>validacion[reglas][regla]){
                        errores.push(`El campo ${reglas} debe tener un maximo de ${validacion[reglas][regla]} caracteres.`);
                    }
            }
        }
    }

    if(errores.length>0){
        throw new Error(errores);
    }
}

export default validarCampos;