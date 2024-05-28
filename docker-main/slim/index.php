<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();
$app->addRoutingMiddleware();
$app -> addBodyParsingMiddleware();
$app->addErrorMiddleware(true, true, true);
$app->add( function ($request, $handler) {
    $response = $handler->handle($request);

    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
        ->withHeader('Content-Type', 'application/json')
    ;
});

function getConnection(){
    $dbhost="db";
    $dbname="seminariophp";
    $dbuser="seminariophp";
    $dbpass="seminariophp";

    $connection = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    return $connection;
}

function esFecha($cadena, $formato = 'Y-m-d') {
    $fecha = DateTime::createFromFormat($formato, $cadena);
    return $fecha && $fecha->format($formato) === $cadena;
}


function validarRequisitos($datos, $validacion)
{
    $errores = [];

    foreach ($validacion as $campo => $reglas) {
        $existe=isset($datos[$campo]) && (!empty($datos[$campo]) || $datos[$campo] == false || $datos[$campo] == 0);
        foreach ($reglas as $regla => $valor) {
            switch ($valor) {
                case 'requerido':
                    if ($existe==0) {
                        $errores[$campo][] = "El campo $campo es requerido.";
                    }
                    break;
                case 'fecha':
                    if ($existe && !esFecha($datos[$campo])) {
                        $errores[$campo][] = "El campo $campo debe ser una fecha en el formato 'YY-MM-DD'.";
                    }
                    break;
                case 'int':
                    if ($existe && (!is_numeric($datos[$campo]) || $datos[$campo] < 0)) {
                        $errores[$campo][] = "El campo $campo debe ser un número entero positivo.";
                    }
                    break;
                case 'bool':
                    if ($existe && !($datos[$campo] == 1 || $datos[$campo] == 0)) {
                        $errores[$campo][] = "El campo $campo debe ser un booleano válido (true o false).";
                    }
                    break;
                case 'double':
                    if ($existe && (!is_numeric($datos[$campo]) || $datos[$campo] <= 0)) {
                        $errores[$campo][] = "El campo $campo debe ser un número positivo.";
                    }
                    break;
                default:
                    if ($existe && $regla == 'longitud' && strlen($datos[$campo]) > $valor) {
                        $errores[$campo][] = "El campo $campo debe tener un máximo de $valor caracteres.";
                    }
                    break;
            }
        }
    }

    return $errores;
}

function fechaEnIntervalo($fecha, $inicioIntervalo, $duracion) {
    // Convertir las fechas a objetos DateTime para facilitar la comparación
    $inicio = new DateTime($inicioIntervalo);
    $fin = new DateTime($inicioIntervalo);
    date_add($fin,date_interval_create_from_date_string($duracion. " days"));


    // Verificar si la fecha está dentro del intervalo
    return ($fecha >= $inicio && $fecha <= $fin);
}

function seSolapan($inicio1,$fin1,$inicio2,$fin2) {
    return !($fin1 < $inicio2 || $inicio1 > $fin2);
}

//Función que verifica que la propiedad esté disponible para el intervalo de tiempo ingresado
function propiedadDisponible($connection,$propiedad_id,$inicioIntervalo,$duracion,$reserva_id=null) {
    // Convertir la fecha de inicio al formato deseado
    $fecha_inicio = $inicioIntervalo->format("Y-m-d");
    // Calcular la fecha final sumando la duración al inicio
    $fecha_fin = $inicioIntervalo->add(new DateInterval("P{$duracion}D"))->format("Y-m-d");
    
    // Consulta SQL preparada para evitar inyecciones de SQL
    $query = "SELECT * 
              FROM reservas r INNER JOIN propiedades p ON r.propiedad_id = p.id
              WHERE propiedad_id = '$propiedad_id'
                  AND NOT ('$fecha_fin' <= fecha_desde OR '$fecha_inicio' >= ADDDATE(fecha_desde, INTERVAL cantidad_noches DAY))
                  AND '$fecha_fin' > p.fecha_inicio_disponibilidad";

    // Si se proporciona un ID de reserva, excluimos esa reserva de la verificación de disponibilidad
    echo $reserva_id;
    if ($reserva_id !== null) {
        $query = $query . " AND r.id <> '$reserva_id'";
    }

    // Preparar la consulta
    $stmt = $connection->query($query);

    $stmt->execute();

    return ($stmt->rowCount() == 0);
}


//-----------------------------------------------------------//
//------------------------LOCALIDADES------------------------//
//-----------------------------------------------------------//



//CREAR
$app->post('/localidades', function (Request $request, Response $response) {
    // Obtener los datos de la solicitud
    $data = $request->getParsedBody();

    // Validar los datos recibidos
    $validacion = [
        'nombre' => [
            'requerido',
            'longitud' => 50
        ]
    ];
    $errores = validarRequisitos($data,$validacion);
    if (!empty($errores)) {
        $response->getBody()->write(json_encode($errores));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        // Verificar que no existan localidades registradas con el mismo nombre
        $stmt = $connection->prepare("SELECT * FROM localidades WHERE nombre = :nombre");
        $stmt->bindParam(":nombre",$data['nombre']);
        $stmt->execute();
        $localidades_repetidas = $stmt->fetchAll();
        if (Count($localidades_repetidas)>0){
            $response->getBody()->write(json_encode(['nombre' => 'Ya existe una localidad registrada con ese nombre']));
            return $response->withStatus(400);
        }

        // Insertar nueva localidad
        $stmt = $connection->prepare("INSERT INTO localidades (nombre) VALUES (:nombre)");
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->execute();
        $connection = null; // Cerrar la conexión

        $response->getBody()->write(json_encode(['success' => 'La localidad fue agregada correctamente']));
        return $response->withStatus(201);
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }
});

//ELIMINAR
$app->delete('/localidades/{id}', function (Request $request, Response $response, $args) {
    // Obtener el ID de la localidad a eliminar
    $id = $args['id'];

    // Verificar que el ID sea un número entero positivo
    if (!ctype_digit($id) || $id <= 0) {
        $response->getBody()->write(json_encode(['id' => 'ID de localidad no válido']));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        // Verificar si existe la localidad a eliminar
        $localidad = $connection->query("SELECT * FROM localidades WHERE id = '$id'");
        if ($localidad->rowCount() == 0){
            $response->getBody()->write(json_encode(['id' => 'La localidad con el ID especificado no existe']));
            return $response->withStatus(404);
        }

        //Verificar que no haya propiedades en la localidad a eliminar
        $propiedades = $connection->query("SELECT * FROM propiedades WHERE localidad_id = '$id'");
        if ($propiedades->rowCount() > 0){
            $response->getBody()->write(json_encode(['id' => 'La localidad con el ID especificado no se puede eliminar, debido a que existen propiedades registradas en la misma']));
            return $response->withStatus(400);
        }

        // Eliminar la localidad de la base de datos
        $stmt = $connection->prepare("DELETE FROM localidades WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $connection = null; // Cerrar la conexión

        $response->getBody()->write(json_encode(['success' => 'Localidad eliminada correctamente']));
        return $response->withStatus(204);
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }
});

//EDITAR
$app->put('/localidades/{id}', function (Request $request, Response $response, $args) {
    // Obtener el ID de la localidad a editar
    $id = $args['id'];

    // Verificar que el ID sea un número entero positivo
    if (!ctype_digit($id) || $id <= 0 ) {
        $response->getBody()->write(json_encode(['id' => 'ID de localidad no válido']));
        return $response->withStatus(400);
    }

    // Obtener los datos enviados en el cuerpo de la solicitud
    $data = $request->getParsedBody();

    // Validar los datos recibidos
    $validacion = [
        'nombre' => [
            'requerido',
            'longitud' => 50
        ]
    ];
    $errores = validarRequisitos($data,$validacion);
    if (!empty($errores)) {
        $response->getBody()->write(json_encode($errores));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        // Verificar si el nuevo nombre está repetido
        $nombre = $data['nombre'];
        $repetidos = $connection->query("SELECT * FROM localidades WHERE nombre = '$nombre' AND id <> '$id'");
        if ($repetidos->rowCount() != 0) {
            $response->getBody()->write(json_encode(['nombre' => "Ya existe una localidad con el nombre $nombre"]));
            return $response->withStatus(400);
        }

        // Verificar si existe la localidad con el id especificado
        $stmt = $connection->query("SELECT * FROM localidades WHERE id = '$id'");
        $dato = $stmt->fetch(PDO::FETCH_ASSOC);
        if(!$dato){
            $response->getBody()->write(json_encode(['id' => 'La localidad con el ID especificado no existe']));
            return $response->withStatus(404);
        }

        // Actualizar la localidad en la base de datos
        $stmt = $connection->prepare("UPDATE localidades SET nombre = :nombre WHERE id = :id");
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        // Verificar si se actualizó alguna fila
        if ($stmt->rowCount() == 0) {
            $response->getBody()->write(json_encode(['message' => "No se cambió ningún dato de la localidad"]));
            return $response->withStatus(200);
        }

        $connection = null; // Cerrar la conexión

        $response->getBody()->write(json_encode(['success' => 'Localidad actualizada correctamente']));
        return $response->withStatus(200);
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }
});

//LISTAR
$app->get("/localidades",function(Request $request,Response $response,$args){
    $conn = getConnection();
    try {
        $query = $conn->query('SELECT * FROM localidades');
        $data = $query->fetchAll(PDO::FETCH_ASSOC);

        $payload= [
            'status' => 'success',
            'code' => 200,
            'data' => $data
        ];

        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type','application/json');
    } catch (PDOException $e) {
        $payload = [
            'status' => 'error',
            'code' => 400,
            'data' => $e->getMessage()
        ];

        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type','application/json');
    }
});


//------------------------------------------------------------------//
//------------------------TIPOS DE PROPIEDAD------------------------//
//------------------------------------------------------------------//


//CREAR
$app->post('/tipos_propiedad', function (Request $request, Response $response) {
    // Obtener los datos de la solicitud
    $data = $request->getParsedBody();

    // Validar los datos recibidos
    $validacion = [
        'nombre' => [
            'requerido',
            'longitud' => 50
        ]
    ];
    $errores = validarRequisitos($data,$validacion);
    if (!empty($errores)) {
        $response->getBody()->write(json_encode($errores));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        // Verificar que el nombre no esté repetido
        $nombre = $data['nombre'];
        $repetidos = $connection->query("SELECT * FROM tipo_propiedades WHERE nombre = '$nombre'");
        if ($repetidos->rowCount() != 0){
            $response->getBody()->write(json_encode(['nombre' => "Ya existe un tipo de propiedad registrado con ese nombre"]));
            return $response->withStatus(400);
        }

        // Insertar el nuevo tipo de propiedad en la base de datos
        $stmt = $connection->prepare("INSERT INTO tipo_propiedades (nombre) VALUES (:nombre)");
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->execute();
        $connection = null; // Cerrar la conexión

        $response->getBody()->write(json_encode(['success' => 'Tipo de propiedad insertado correctamente']));
        return $response->withStatus(201);
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }
});

//ELIMINAR
$app->delete('/tipos_propiedad/{id}', function (Request $request, Response $response, $args) {
    // Obtener el ID del tipo de propiedad a eliminar
    $id = $args['id'];

    // Verificar que el ID sea un número entero positivo
    if (!ctype_digit($id) || $id <= 0) {
        $response->getBody()->write(json_encode(['id' => 'ID de tipo de propiedad no válido']));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        // Verificar si existe el tipo de propiedad a eliminar
        $tipo_propiedad = $connection->query("SELECT * FROM tipo_propiedades WHERE id = '$id'");
        if ($tipo_propiedad->rowCount() == 0){
            $response->getBody()->write(json_encode(['id' => 'El tipo de propiedad con el ID especificado no existe']));
            return $response->withStatus(404);
        }

        //Verificar que no haya propiedades de ese tipo
        $ocurrencias = $connection->query("SELECT * FROM propiedades WHERE tipo_propiedad_id = '$id'");
        if ($ocurrencias->rowCount() != 0){
            $response->getBody()->write(json_encode(['id' => 'El tipo de propiedad con el ID especificado no se puede eliminar, debido a que existen propiedades registradas de ese tipo']));
            return $response->withStatus(400);
        }

        // Eliminar el tipo de propiedad de la base de datos
        $stmt = $connection->prepare("DELETE FROM tipo_propiedades WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $response->getBody()->write(json_encode(["success" => "Tipo de propiedad eliminado correctamente"]));
        return $response->withStatus(204);
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }
});

//EDITAR
$app->put('/tipos_propiedad/{id}', function (Request $request, Response $response, $args) {
    // Obtener el ID del tipo de propiedad a editar
    $id = $args['id'];

    // Verificar que el ID sea un número entero positivo
    if (!ctype_digit($id) || $id <= 0) {
        $response->getBody()->write(json_encode(['id' => 'ID de tipo de propiedad no válido']));
        return $response->withStatus(400);
    }

    // Obtener los datos enviados en el cuerpo de la solicitud
    $data = $request->getParsedBody();

    // Validar los datos recibidos
    $validacion = [
        'nombre' => [
            'requerido',
            'longitud' => 50
        ]
    ];
    $errores = validarRequisitos($data,$validacion);
    if (!empty($errores)) {
        $response->getBody()->write(json_encode($errores));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        // Verificar que el nombre no esté repetido
        $nombre = $data['nombre'];
        $repetidos = $connection->query("SELECT * FROM tipo_propiedades WHERE nombre = '$nombre' AND id <> '$id'");
        if ($repetidos->rowCount() != 0){
            $response->getBody()->write(json_encode(['nombre' => "Ya existe un tipo de propiedad con el nombre $nombre"]));
            return $response->withStatus(400);
        }

        // Verificar si existe el tipo de propiedad con el id especificado
        $stmt = $connection->query("SELECT * FROM tipos_propiedad WHERE id = '$id'");
        $dato = $stmt->fetch(PDO::FETCH_ASSOC);
        if(!$dato){
            $response->getBody()->write(json_encode(['id' => 'El tipo de propiedad con el ID especificado no existe']));
            return $response->withStatus(404);
        }

        // Actualizar la localidad en la base de datos
        $stmt = $connection->prepare("UPDATE tipo_propiedades SET nombre = :nombre WHERE id = :id");
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        // Verificar si se actualizó alguna fila
        if ($stmt->rowCount() == 0) {
            $response->getBody()->write(json_encode(['message' => "No se cambió ningún dato del tipo de propiedad"]));
            return $response->withStatus(200);
        }

        $connection = null; // Cerrar la conexión

        $response->getBody()->write(json_encode(['success' => "Tipo de propiedad actualizada correctamente"]));
        return $response->withStatus(200);
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }
});

//LISTAR
$app->get("/tipos_propiedad",function(Request $request,Response $response, $args){
    $conn = getConnection();
    try {
        $query = $conn->query("SELECT * FROM tipo_propiedades");
        $data = $query->fetchAll(PDO::FETCH_ASSOC);

        $payload = [
            "status" => "success",
            "code" => 200,
            "data" => $data
        ];

        $response->getBody()->write(json_encode($payload));
        return $response -> withHeader('Content-Type','application/json');
    } catch (PDOException $e) {
        $payload = [
            "status" => "error",
            "code" => 400,
            "data" => $e->getMessage()
        ];

        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type','application/json');
    }
});


//----------------------------------------------------------//
//------------------------INQUILINOS------------------------//
//----------------------------------------------------------//


//CREAR
$app->post('/inquilinos', function (Request $request, Response $response) {
    $data = $request->getParsedBody();

    // Validar los datos recibidos
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
    $errores = validarRequisitos($data,$validacion);
    if (!empty($errores)) {
        $response->getBody()->write(json_encode($errores));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        //Verificar que el dni sea único
        $dni = $data['documento'];
        $repetidos = $connection->query("SELECT * FROM inquilinos WHERE documento= '$dni'");
        if ($repetidos->rowCount() != 0){
            $response->getBody()->write(json_encode(['documento' => "Ya existe un inquilino con el documento $dni"]));
            return $response->withStatus(400);
        }

        // Convertir el valor de 'activo' a un booleano
        $activo = strtolower($data['activo']) === 'true';

        // Convertir el booleano a entero (0 o 1)
        $activo_int = $activo ? 1 : 0;

        // Insertar inquilino en la base de datos
        $stmt = $connection->prepare("INSERT INTO inquilinos (apellido, nombre, documento, email, activo) VALUES (:apellido, :nombre, :documento, :email, :activo)");
        $stmt->bindParam(':apellido', $data['apellido']);
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':documento', $data['documento']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':activo', $activo_int);
        $stmt->execute();
        $connection = null;

        $response->getBody()->write(json_encode(['success' => 'Inquilino insertado correctamente']));
        return $response->withStatus(201);
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }
});

//ELIMINAR
$app->delete('/inquilinos/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id'];

    if (!ctype_digit($id) || $id <= 0) {
        $response->getBody()->write(json_encode(['id' => 'ID de inquilino no válido']));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        // Verificar si existe el inquilino a eliminar
        $inquilino = $connection->query("SELECT * FROM inquilinos WHERE id = $id");
        if ($inquilino->rowCount() == 0){
            $response->getBody()->write(json_encode(['id' => 'El inquilino con el ID especificado no existe']));
            return $response->withStatus(404);
        }
        
        //Verificar que no haya reservas registradas del inquilino
        $ocurrencias = $connection->query("SELECT * FROM reservas WHERE inquilino_id = $id");
        if ($ocurrencias->rowCount() != 0){
            $response->getBody()->write(json_encode(['id' => 'El inquilino con el ID especificado no se puede eliminar, debido a que existen reservas registradas a su nombre']));
            return $response->withStatus(400);
        }

        // Eliminar el inquilino de la base de datos
        $stmt = $connection->prepare("DELETE FROM inquilinos WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $connection = null;

        $response->getBody()->write(json_encode(['success' => 'Inquilino eliminado correctamente']));
        return $response->withStatus(204);
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }
});

//EDITAR
$app->put('/inquilinos/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id'];

    if (!ctype_digit($id) || $id <= 0) {
        $response->getBody()->write(json_encode(['id' => 'ID de inquilino no válido']));
        return $response->withStatus(400);
    }

    $data = $request->getParsedBody();

    // Validar los datos recibidos
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
    $errores = validarRequisitos($data,$validacion);
    if (!empty($errores)) {
        $response->getBody()->write(json_encode($errores));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        // Verificar que el documento no se repita
        $documento = $data['documento'];
        $repetidos = $connection->query("SELECT * FROM inquilinos WHERE documento = '$documento' AND id != '$id'");
        if($repetidos->rowCount() > 0){
            $response->getBody()->write(json_encode(['documento' => "Ya existe un inquilino con el documento '$documento'"]));
            return $response->withStatus(400);
        }

        // Verificar si existe el inquilino con el id especificado
        $stmt = $connection->query("SELECT * FROM inquilinos WHERE id = '$id'");
        $dato = $stmt->fetch(PDO::FETCH_ASSOC);
        if(!$dato){
            $response->getBody()->write(json_encode(['id' => 'El inquilino con el ID especificado no existe']));
            return $response->withStatus(404);
        }

        // Actualizamos los datos del inquilino en la base de datos
        $stmt = $connection->prepare("UPDATE `inquilinos` SET `apellido`=:apellido, `nombre`=:nombre, `documento`=:documento, `email`=:email, `activo`=:activo WHERE id = $id");
        $stmt->bindParam(':apellido', $data['apellido']);
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':documento', $documento);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':activo', $data['activo']);
        $stmt->execute();

        // Verifico si se cambió algun dato
        if ($stmt->rowCount() == 0) {
            $response->getBody()->write(json_encode(['message' => 'No se cambio ningun dato del inquilino']));
            return $response->withStatus(200);
        }

        $connection = null;

        $response->getBody()->write(json_encode(['success' => 'Inquilino actualizado correctamente']));
        return $response->withStatus(200);
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }
});

//LISTAR
$app->get("/inquilinos",function(Request $request,Response $response,$args){
    $conn = getConnection();
    try {
        $query = $conn->query("SELECT * FROM inquilinos");
        $data = $query->fetchAll(PDO::FETCH_ASSOC);

        $payload = [
            "status" => "success",
            "code" => 200,
            "data" => $data
        ];

        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type','application/json');
    } catch (PDOException $e) {
        $payload = [
            "status" => "error",
            "code" => 500,
            "data" => $e->getMessage()
        ];

        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type','application/json');
    }
});

//VER_INQUILINO
$app->get("/inquilinos/{id}",function(Request $request,Response $response, $args){
    $id = $args['id'];

    // Verificar que el id ingresado sea válido
    if (!ctype_digit($id) || $id <= 0) {
        $response->getBody()->write(json_encode(['id' => 'ID de inquilino no válido']));
        return $response->withStatus(400);
    }

    try {
        $conn = getConnection();

        // Verificar si existe el inquilino con el id especificado
        $query = $conn->query("SELECT * FROM inquilinos WHERE id = '$id'");
        if ($query->rowCount() == 0) {
            $response->getBody()->write(json_encode(['id' => "El inquilino con el ID '$id' no existe"]));
            return $response->withStatus(404);    
        }

        $data = $query->fetch(PDO::FETCH_ASSOC);
        $response->getBody()->write(json_encode($data));
        return $response->withStatus(200);
    } catch (PDOException $e) {
        $payload = [
            "status" => "error",
            "code" => 500,
            "data" => $e->getMessage()
        ];

        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type','application/json');
    }
});

//HISTORIAL DE RESERVAS
$app->get('/inquilinos/{idInquilino}/reservas', function (Request $request, Response $response, $args) {
    $id = $args['idInquilino'];

    // Verificar que el id ingresado sea válido
    if (!ctype_digit($id) || $id <= 0) {
        $response->getBody()->write(json_encode(['id' => 'ID de inquilino no válido']));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        // Levantar las reservas del inquilino
        $stmt = $connection->prepare("SELECT * FROM reservas WHERE inquilino_id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $connection = null;

        $payload = [
            "status" => "success",
            "code" => 200,
            "data" => $reservas
        ];

        $response->getBody()->write(json_encode($payload));
        return $response->withStatus(200);
    } catch (PDOException $e) {
        $payload = [
            "status" => "error",
            "code" => 500,
            "data" => $e->getMessage()
        ];

        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type','application/json');
    }
});


//-----------------------------------------------------------//
//------------------------PROPIEDADES------------------------//
//-----------------------------------------------------------//


//CREAR
$app->post('/propiedades', function (Request $request, Response $response) {
    $data = $request->getParsedBody();

    // Validar los datos recibidos
    $validacion = [
        'domicilio' => [
            'requerido',
        ],
        'localidad_id' => [
            'requerido',
            'int'
        ],
        'cantidad_habitaciones' => [
            'int'
        ],
        'cantidad_banios' => [
            'int'
        ],
        'cochera' => [
            'bool'
        ],
        'cantidad_huespedes' => [
            'requerido',
            'int'
        ],
        'fecha_inicio_disponibilidad' => [
            'requerido',
            'fecha'
        ],
        'cantidad_dias' => [
            'requerido',
            'int'
        ],
        'disponible' => [
            'requerido',
            'bool'
        ],
        'valor_noche' => [
            'requerido',
            'double'
        ],
        'tipo_propiedad_id' => [
            'requerido',
            'int'
        ]
    ];
    $errores = validarRequisitos($data,$validacion);
    if (!empty($errores)) {
        $response->getBody()->write(json_encode($errores));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        // Insertar nueva propiedad en la base de datos
        $campos = "";
        $parametros = "";
        foreach ($data as $key => $value) {
            if (isset($value) && (!empty($value) || $value==false || $value==0)){
                $campos = $campos . "$key, ";
                $parametros = $parametros . ":$key, ";
            }
        }
        $campos = substr($campos, 0, -2);
        $parametros = substr($parametros, 0, -2);

        $stmt = $connection->prepare("INSERT INTO propiedades ($campos) VALUES ($parametros)");

        foreach ($data as $key => $value) {
            if (isset($value) && (!empty($value) || $value==false || $value==0)){
                if($key === 'disponible'){
                     // Convertir el valor de 'activo' a un booleano
                    $disponible = strtolower($data['disponible']) === 'true';
                    
                    $activo_int = $data['disponible'] ? 1 : 0;
                        
                    $stmt->bindParam(":$key", $activo_int);
                }else{
                    $stmt->bindParam(":$key", $data[$key]);
                }
            }
        }

        $stmt->execute();

        $connection = null;

        $response->getBody()->write(json_encode(['success' => 'Propiedad creada correctamente']));
        return $response->withStatus(201);
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }   
});

//ELIMINAR
$app->delete('/propiedades/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id'];

    // Verificamos que el id sea válido
    if (!ctype_digit($id) || $id <= 0) {
        $response->getBody()->write(json_encode(['id' => "ID de propiedad no válido"]));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        // Verificar si existe la propiedad a eliminar
        $propiedad = $connection->query("SELECT * FROM propiedades WHERE id = $id");
        if ($propiedad->rowCount() == 0){
            $response->getBody()->write(json_encode(['id' => "La propiedad con el ID especificado no existe"]));
            return $response->withStatus(404);
        }

        //Verificar que no haya reservas de esa propiedad
        $ocurrencias = $connection->query("SELECT * FROM reservas WHERE propiedad_id = $id");
        if ($ocurrencias->rowCount() != 0){
            $response->getBody()->write(json_encode(['id' => 'La propiedad con el ID especificado no se puede eliminar, debido a que existen reservas registradas de la misma']));
            return $response->withStatus(400);
        }

        // Eliminar la propiedad de la base de datos
        $stmt = $connection->prepare("DELETE FROM propiedades WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $connection = null;

        $response->getBody()->write(json_encode(['success' => 'Propiedad eliminada correctamente']));
        return $response->withStatus(204);
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }
});

//EDITAR
$app->put('/propiedades/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();

    // Vericar que el id sea válido
    if (!ctype_digit($id) || $id <= 0) {
        $response->getBody()->write(json_encode(['id' => 'ID de propiedad no válido']));
        return $response->withStatus(400);
    }

    // Validar los datos recibidos
    $validacion = [
        'domicilio' => [
            'requerido',
        ],
        'localidad_id' => [
            'requerido',
            'int'
        ],
        'cantidad_habitaciones' => [
            'int'
        ],
        'cantidad_banios' => [
            'int'
        ],
        'cochera' => [
            'bool'
        ],
        'cantidad_huespedes' => [
            'requerido',
            'int'
        ],
        'fecha_inicio_disponibilidad' => [
            'requerido',
            'fecha'
        ],
        'cantidad_dias' => [
            'requerido',
            'int'
        ],
        'disponible' => [
            'requerido',
            'bool'
        ],
        'valor_noche' => [
            'requerido',
            'double'
        ],
        'tipo_propiedad_id' => [
            'requerido',
            'int'
        ]
    ];
    $errores = validarRequisitos($data,$validacion);
    if (!empty($errores)) {
        $response->getBody()->write(json_encode($errores));
        return $response->withStatus(400);
    }
    
    try {
        $connection = getConnection();

        // Verificar si existe la propiedad con el id especificado
        $stmt = $connection->query("SELECT * FROM propiedades WHERE id = '$id'");
        $dato = $stmt->fetch(PDO::FETCH_ASSOC);
        if(!$dato){
            $response->getBody()->write(json_encode(['id' => 'La propiedad con el ID especificado no existe']));
            return $response->withStatus(404);
        }
        
        // Actualizar los datos en la base de datos
        $parametros = "";
        foreach ($data as $key => $value) {
            if (isset($value) && !empty($value)){
                $parametros .= "$key = :$key, ";
            }
        }
        $parametros = rtrim($parametros, ', '); // Eliminar la última coma y el espacio

        $stmt = $connection->prepare("UPDATE propiedades SET $parametros WHERE id = :id");

        foreach ($data as $key => $value) {
            if (isset($value) && !empty($value)){
                $stmt->bindValue(":$key", $value);
            }
        }
        $stmt->bindValue(":id", $id);

        $stmt->execute();

        // Verifico si se cambió algun dato
        if ($stmt->rowCount() == 0) {
            $response->getBody()->write(json_encode(['message' => 'No se cambio ningun dato de la propiedad']));
            return $response->withStatus(200);
        }

        $connection = null;

        $response->getBody()->write(json_encode(['success' => 'Propiedad actualizada correctamente']));
        return $response->withStatus(200);
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }
});

//LISTAR
$app->get("/propiedades",function(Request $request,Response $response,$args){
    $data = $request->getQueryParams();

    // Validamos los datos del filtro
    $validacion = [
        'disponible' => [
            'bool',
        ],
        'localidad_id' => [
            'int'
        ],
        'fecha_inicio_disponibilidad' => [
            'fecha'
        ],
        'cantidad_huespedes' => [
            'int'
        ]
    ];
    $errores = validarRequisitos($data,$validacion);
    if (!empty($errores)) {
        $response->getBody()->write(json_encode($errores));
        return $response->withStatus(400);
    }
    
    try {
        $conn = getConnection();

        // Armamos la consulta SQL
        $sql = "SELECT * FROM propiedades WHERE 1 = 1";
        foreach ($data as $key => $value) {
            if (isset($value) && (!empty($value) || $value == 0 || $value == false)){
                if ($key == 'fecha_inicio_disponibilidad') {
                    // Se hace la distincion de campos porque este requiere una comparación de <= y no de igualdad
                    $fecha_inicio_disponibilidad = $data[$key];
                    $sql = $sql . " AND $key <= '$fecha_inicio_disponibilidad'";
                } else {
                    $sql = $sql . " AND $key = $value";
                }
            }
        }
        
        // Levantamos las propiedades filtradas
        $query = $conn->query($sql);
        $propiedades = $query->fetchAll(PDO::FETCH_ASSOC);

        $payload = [
            "status" => "success",
            "code" => 200,
            "data" => $propiedades
        ];

        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type','application/json');
    } catch (PDOException $e) {
        $payload = [
            "status" => "error",
            "code" => 500,
            "data" => $e->getMessage()
        ];

        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type','application/json');
    }
});

//VER_PROPIEDAD
$app->get('/propiedades/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id'];
    //$errores= array();

    if (!ctype_digit($id) || $id <= 0) {
        //$errores['error']='ID de propiedad no válido';
        $response->getBody()->write(json_encode(['id' => 'ID de propiedad no válido']));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();
        $stmt = $connection->prepare("SELECT * FROM propiedades WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        //Verifico si la propiedad existe
        if ($stmt->rowCount() == 0) {
            //$errores['error']='La propiedad con el ID especificado no existe';
            $response->getBody()->write(json_encode(['id' => 'La propiedad con el ID especificado no existe']));
            return $response->withStatus(404);
        }
        
        $propiedad = $stmt->fetch(PDO::FETCH_ASSOC);

        $connection = null;

        $payload = [
            "status" => "success",
            "code" => 200,
            "data" => $propiedad
        ];

        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type','application/json');
    } catch (PDOException $e) {
        $payload = [
            "status" => "error",
            "code" => 500,
            "data" => $e->getMessage()
        ];

        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type','application/json');;
    }
});

//--------------------------------------------------------//
//------------------------RESERVAS------------------------//
//--------------------------------------------------------//

//CREAR
$app->post('/reservas', function (Request $request, Response $response) {
    // Obtener los datos de la solicitud
    $data = $request->getParsedBody();

    // Validar los datos recibidos
    $validacion = [
        'propiedad_id' => [
            'requerido',
            'int'
        ],
        'inquilino_id' => [
            'requerido',
            'int'
        ],
        'fecha_desde' => [
            'requerido',
            'fecha'
        ],
        'cantidad_noches' => [
            'requerido',
            'int'
        ]
    ];
    $errores = validarRequisitos($data,$validacion);
    if (!empty($errores)) {
        $response->getBody()->write(json_encode($errores));
        return $response->withStatus(400);
    }

    // Insertar la nueva reserva en la base de datos
    try {
        $connection = getConnection();

        // Verificar si existe la propiedad
        $propiedad_id = $data['propiedad_id'];
        $propiedad = $connection->query("SELECT * FROM propiedades WHERE id = '$propiedad_id'");
        if($propiedad->rowCount() == 0){
            $response->getBody()->write(json_encode(['propiedad_id' => "La propiedad con el id '$propiedad_id' no existe"]));
            return $response->withStatus(404);
        }

        // Verificar si existe el inquilino
        $inquilino_id = $data['inquilino_id'];
        $inquilino = $connection->query("SELECT * FROM inquilinos WHERE id = '$inquilino_id'");
        if($inquilino->rowCount() == 0){
            $response->getBody()->write(json_encode(['inquilino_id' => "El inquilino con el id '$inquilino_id' no existe"]));
            return $response->withStatus(404);
        }

        $inquilino = $inquilino->fetch(PDO::FETCH_ASSOC);
        $propiedad = $propiedad->fetch(PDO::FETCH_ASSOC);
        $fecha_inicio_disponibilidad = new DateTime($propiedad['fecha_inicio_disponibilidad']);
        $fecha_desde = new DateTime($data['fecha_desde']);
        $cantidad_noches = $data['cantidad_noches'];

        // Verificar si el inquilino se encuentra activo
        if (!$inquilino['activo']){
            $response->getBody()->write(json_encode(['inquilino_id' => 'El inquilino no está activo']));
            return $response->withStatus(400);
        }

        // Verificar si la fecha de inicio es posterior al día actual
        if ($fecha_desde <= new DateTime()){
            $response->getBody()->write(json_encode(['fecha_desde' => 'La fecha de inicio de la reserva debe ser posterior al día de hoy']));
            return $response->withStatus(400);
        }

        // Verificar que la propiedad esté disponible
        if (!$propiedad['disponible']){
            $connection = null;
            $response->getBody()->write(json_encode(['propiedad_id' => 'La propiedad no está disponible']));
            return $response->withStatus(400);
        }
        
        // Verificar si la propiedad está disponible para ser alquilada en el período ingresado
        if (!$propiedad['disponible'] || $fecha_desde <= $fecha_inicio_disponibilidad || !propiedadDisponible($connection,$propiedad_id,$fecha_desde,$cantidad_noches)){
            $response->getBody()->write(json_encode(['propiedad_id' => 'La propiedad no está disponible para ser alquilada en el período ingresado']));
            return $response->withStatus(400);
        }

        // Insertar nueva reserva en la base de datos
        $stmt = $connection->prepare("INSERT INTO reservas (propiedad_id, inquilino_id, fecha_desde, cantidad_noches, valor_total) VALUES (:propiedad_id, :inquilino_id, :fecha_desde, :cantidad_noches, :valor_total)");
        $valorTotal = $propiedad['valor_noche'] * $data['cantidad_noches'];
        $stmt->bindParam(':propiedad_id', $data['propiedad_id']);
        $stmt->bindParam(':inquilino_id', $data['inquilino_id']);
        $stmt->bindParam(':fecha_desde', $data['fecha_desde']);
        $stmt->bindParam(':cantidad_noches', $data['cantidad_noches']);
        $stmt->bindParam(':valor_total',$valorTotal);

        $stmt->execute();

        $connection = null;

        $response->getBody()->write(json_encode(['success' => 'La reserva fue agregada correctamente']));
        return $response->withStatus(201);

    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }
});

//ELIMINAR
$app->delete('/reservas/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id'];

    if (!ctype_digit($id) || $id <= 0) {
        $response->getBody()->write(json_encode(['id' => 'ID de reserva no válido']));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        // Verificar si existe la reserva con el id especificado
        $reserva = $connection->query("SELECT * FROM reservas WHERE id = '$id'");
        if ($reserva->rowCount() == 0) {
            $connection = null;
            $response->getBody()->write(json_encode(['id' => 'La reserva con el ID especificado no existe']));
            return $response->withStatus(400);
        }

        $reserva = $reserva->fetch(PDO::FETCH_ASSOC);

        $propiedad_id = $reserva['propiedad_id'];

        $fecha_actual = new DateTime(); // Obtiene la fecha y hora actuales

        $fecha_desde_reserva = new DateTime($reserva['fecha_desde']);

        $diferencia_desde = $fecha_desde_reserva->diff($fecha_actual);//obtener la diferencia entre la fecha actual y la fecha de inicio de la reserva

        $fecha_fin_reserva =  $fecha_desde_reserva->modify('+' . $reserva['cantidad_noches'] . ' days');//obtener la fecha de fin de la reserva

        $diferecia_hasta = $fecha_fin_reserva->diff($fecha_actual);//obtener la diferencia entre la fecha actual y la fecha de fin de la reserva
        if ($diferencia_desde->format('%R') === '+') {
            $connection = null;
            $response->getBody()->write(json_encode(['id' => 'No se puede cancelar una reserva que pasada o en curso']));
            return $response->withStatus(400);
        }

        $stmt = $connection->prepare("DELETE FROM reservas WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $stmt = $connection->query("SELECT * FROM reservas WHERE propiedad_id = '$propiedad_id'");
        $fecha_fin_mayor = new DateTime();

        while ($reserva = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $fecha_fin_reserva = new DateTime($reserva['fecha_desde']);
            $fecha_fin_reserva->modify('+' . $reserva['cantidad_noches'] . ' days');

            if ($fecha_fin_reserva > $fecha_fin_mayor) {
                $fecha_fin_mayor = $fecha_fin_reserva;
            }
        }

        $fecha_fin_mayor_format = $fecha_fin_mayor->format('Y-m-d');

        $stmt = $connection->query("SELECT * FROM propiedades WHERE id = '$propiedad_id'");
        $propiedad = $stmt->fetch(PDO::FETCH_ASSOC);

        $fecha_inicio_disponibilidad_dt = new DateTime($propiedad['fecha_inicio_disponibilidad']);
        $diferencia = $fecha_inicio_disponibilidad_dt->diff($fecha_fin_mayor);
        if ($diferencia->format('%R') === '-') {
            // Aquí actualizas la fecha de inicio de disponibilidad si es necesario
            $stmt = $connection->query("UPDATE propiedades SET fecha_inicio_disponibilidad = '$fecha_fin_mayor_format'  WHERE id = '$propiedad_id'");
        } 

        $connection = null;

        $response->getBody()->write(json_encode(['message' => 'Reserva eliminada correctamente']));
        return $response->withStatus(200);
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }
});

//EDITAR
$app->put('/reservas/{id}', function (Request $request, Response $response, $args) {
    // Obtener los datos de la solicitud
    $data = $request->getParsedBody();
    $id = $args["id"];

    // Validar los datos recibidos
    $validacion = [
        'propiedad_id' => [
            'requerido',
            'int'
        ],
        'inquilino_id' => [
            'requerido',
            'int'
        ],
        'fecha_desde' => [
            'requerido',
            'fecha'
        ],
        'cantidad_noches' => [
            'requerido',
            'int'
        ]
    ];
    $errores = validarRequisitos($data,$validacion);
    if (!empty($errores)) {
        $response->getBody()->write(json_encode($errores));
        return $response->withStatus(400);
    }
    try {
        $connection = getConnection();

        // Verificar que el inquilino esté activo
        $nuevo_inquilino = $connection->query("SELECT * FROM inquilinos WHERE id = " . $data['inquilino_id'])->fetch(PDO::FETCH_ASSOC);
        if (!$nuevo_inquilino['activo']){
            $connection = null;
            $response->getBody()->write(json_encode(['inquilino_id' => 'El nuevo inquilino no está activo']));
            return $response->withStatus(400);
        }
        
        // Verificar que la propiedad esté disponible
        $nueva_propiedad = $connection->query("SELECT * FROM propiedades WHERE id = " . $data['propiedad_id'])->fetch(PDO::FETCH_ASSOC);
        if (!$nueva_propiedad['disponible']){
            $connection = null;
            $response->getBody()->write(json_encode(['propiedad_id' => 'La nueva propiedad no está disponible']));
            return $response->withStatus(400);
        }

        // Verificar que exista la reserva
        $reserva = $connection->query("SELECT * FROM reservas WHERE id = " . $id)->fetch(PDO::FETCH_ASSOC);
        if (empty($reserva)){
            $connection = null;
            $response->getBody()->write(json_encode(['id' => 'La reserva con el ID especificado no existe']));
            return $response->withStatus(404);
        }

        //Verificamos que la reserva no esté en curso
        if (fechaEnIntervalo(date("Y-m-d"),$reserva['fecha_desde'],$reserva['cantidad_noches'])){
            $connection = null;
            $response->getBody()->write(json_encode(['id' => 'No se puede editar una reserva en curso']));
            return $response->withStatus(400);
        }

        // Verificar si la fecha de inicio es posterior al día actual
        $fecha_desde= new DateTime($data["fecha_desde"]);
        if ($fecha_desde <= new DateTime()){
            $response->getBody()->write(json_encode(['fecha_desde' => 'La fecha de inicio de la reserva debe ser posterior al día de hoy']));
            return $response->withStatus(400);
        }
        
        // Verificamos que la propiedad esté disponible para la fecha solicitada
        $fecha_inicio_disponibilidad = new DateTime($nueva_propiedad['fecha_inicio_disponibilidad']);
        if ($fecha_desde <= $fecha_inicio_disponibilidad || !propiedadDisponible($connection,$data['propiedad_id'],$fecha_desde,$data['cantidad_noches'],$id)){
            $response->getBody()->write(json_encode(['propiedad_id' => 'La propiedad no está disponible para la fecha solicitada']));
            return $response->withStatus(400);
        }

        // Editamos la reserva
        $valor_total = $nueva_propiedad["valor_noche"]*$data['cantidad_noches'];
        $stmt = $connection->prepare("UPDATE reservas SET propiedad_id = :propiedad_id, inquilino_id = :inquilino_id, fecha_desde = :fecha_desde, cantidad_noches = :cantidad_noches, valor_total = :valor_total WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':propiedad_id',$data['propiedad_id']);
        $stmt->bindParam(':inquilino_id',$data['inquilino_id']);
        $stmt->bindParam(':fecha_desde',$data['fecha_desde']);
        $stmt->bindParam(':cantidad_noches',$data['cantidad_noches']);
        $stmt->bindParam(':valor_total',$valor_total);

        $stmt->execute();

        // Verifico si se cambió algun dato
        if ($stmt->rowCount() == 0) {
            $response->getBody()->write(json_encode(['message' => 'No se cambio ningun dato de la reserva']));
            return $response->withStatus(200);
        }

        $connection = null;

        $response->getBody()->write(json_encode(['message' => 'Reserva actualizada correctamente']));
        return $response->withStatus(200);
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }
});

//LISTAR
$app->get("/reservas",function(Request $request,Response $response,$args){
    $conn = getConnection();
    try {
        $query = $conn->query("SELECT * FROM reservas");
        $data = $query->fetchAll(PDO::FETCH_ASSOC);

        $payload = [
            "status" => "success",
            "code" => 200,
            "data" => $data
        ];

        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type','application/json');
    } catch (PDOException $e) {
        $payload = [
            "status" => "error",
            "code" => 400,
            "data" => $e->getMessage()
        ];

        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type','application/json');
    }
});

$app->run();
