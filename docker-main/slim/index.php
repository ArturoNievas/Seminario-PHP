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

/*
FUNCION PARA VALIDAR REQUISITOS

Se envía la información obtenida en formato array como primer parámetro y
en el segundo parámetro se envía un array de la siguiente forma:
    $validacion = [
        'nombre' => ['
            'requerido'
            'longitud' => 18
        ]
        'documento' => [
            'int'
        ]
        'fecha_inicio' => [
            'fecha'
        ]
    ]
El campo 'nombre' es requerido y no debe tener más de 18 caracteres
El campo 'documento' debe ser un numero entero
El campo 'fecha' debe ser de tipo fecha

La función devuelve un array con los errores, si está vacío significa que no hubo errores
*/
function validarRequisitos($data,$validacion) {
    $error = [];

    foreach ($validacion as $campo => $reglas){
        $existe = isset($datos[$campo]) && !empty($datos[$campo]);
        foreach ($reglas as $regla => $valor){
            switch ($valor) {
                case 'requerido':
                    if (!$existe) {
                        $errores[$campo] = "El campo $campo es requerido.";
                    }
                    break;
                case 'fecha':
                    if ($existe && !esFecha($datos[$campo])) {
                        $errores[$campo] = "El campo $campo debe ser una fecha válida.";
                    }
                    break;
                case 'int' :
                    if ($existe && (!is_int($datos[$campo]) || $datos[$campo] < 0)) {
                        $errores[$campo] = "El campo $campo debe ser un número entero positivo.";
                    }
                    break;
                default:
                    if ($existe && $regla == 'longitud' && !strlen($datos[$campo]) > $valor){
                        $errores[$campo] = "El campo $campo debe tener un máximo de $valor caracteres.";
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

/*
function propiedadDisponible($reservas,$inicio,$duracion) {
    $fecha_inicio = new DateTime($inicio);
    $fecha_fin = new DateTime($inicio);
    date_add($fecha_fin,date_interval_create_from_date_string($duracion. " days"));

    foreach ($reservas as $reserva) {
        $r_inicio = new DateTime($reserva['fecha_desde']);
        $r_fin = new DateTime($reserva['fecha_desde']);
        date_add($r_fin,date_interval_create_from_date_string($reserva['cantidad_noches']. " days"));
        $disponible = !seSolapan($fecha_inicio,$fecha_fin,$r_inicio,$r_fin);
        if (!$disponible) {
            break;
        }
    }

    return $disponible;
}
*/

function propiedadDisponible($connection,$propiedad_id,$inicioIntervalo,$duracion) {
    $fecha_inicio = new DateTime($inicioIntervalo)->format("Y,m,d");
    $fecha_fin = new DateTime($inicioIntervalo);
    date_add($fecha_fin,date_interval_create_from_date_string($duracion. " days"))->format("Y,m,d");
    $reservas = $connection->query("SELECT * FROM reservas WHERE propiedad_id = $propiedad_id AND ")
}


//-----------------------------------------------------------//
//------------------------LOCALIDADES------------------------//
//-----------------------------------------------------------//



//CREAR
$app->post('/localidades', function (Request $request, Response $response) {
    // Obtener los datos de la solicitud
    $data = $request->getParsedBody();

    // Validar los datos recibidos
    if (!isset($data['nombre']) || empty($data['nombre'])) {
        $response->getBody()->write(json_encode(['error' => 'El nombre de la localidad es requerido']));
        return $response->withStatus(400);
    } elseif (strlen($data['nombre']) > 50) {
        $response->getBody()->write(json_encode(['error' => 'El nombre de la localidad tiene que tener a lo sumo 50 caracteres']));
        return $response->withStatus(400);
    } else {
        // Insertar la nueva localidad en la base de datos
        try {
            $connection = getConnection();

            $nombre = $data['nombre'];
            $localidades_repetidas = $connection->query("SELECT * FROM localidades WHERE nombre = '$nombre'");
            if ($localidades_repetidas->rowCount()>0){
                $response->getBody()->write(json_encode(['error' => 'El nombre de la localidad esta repetido']));
                return $response->withStatus(400);
            } else {
                $stmt = $connection->prepare("INSERT INTO localidades (nombre) VALUES (:nombre)");
                $stmt->bindParam(':nombre', $data['nombre']);
                $stmt->execute();
                $connection = null; // Cerrar la conexión

                $response->getBody()->write(json_encode(['success' => 'La localidad fue agregada correctamente']));
                return $response->withStatus(201);
            }
        } catch (PDOException $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500);
        }
    }
});


//ELIMINAR
$app->delete('/localidades/{id}', function (Request $request, Response $response, $args) {
    // Obtener el ID de la localidad a eliminar
    $id = $args['id'];

    // Verificar que el ID sea un número entero positivo
    if (!ctype_digit($id) || $id <= 0) {
        $response->getBody()->write(json_encode(['error' => 'ID de localidad no válido']));
        return $response->withStatus(400);
    }

    // Eliminar la localidad de la base de datos
    try {
        $connection = getConnection();

        // Verificar si existe la localidad a eliminar
        $localidad = $connection->query("SELECT * FROM localidades WHERE id = '$id'");
        if ($localidad->rowCount() == 0){
            $response->getBody()->write(json_encode(['error' => 'La localidad con el ID especificado no existe']));
            return $response->withStatus(404);
        }

        //Verificar que no haya propiedades en la localidad a eliminar
        $ocurrencias = $connection->query("SELECT * FROM propiedades WHERE localidad_id = '$id'");
        if ($ocurrencias->rowCount() != 0){
            $response->getBody()->write(json_encode(['error' => 'La localidad con el ID especificado no se puede eliminar, debido a que existen propiedades registradas en la misma']));
            return $response->withStatus(400);
        }

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
        $response->getBody()->write(json_encode(['error' => 'ID de localidad no válido']));
        return $response->withStatus(400);
    }

    // Obtener los datos enviados en el cuerpo de la solicitud
    $data = $request->getParsedBody();


    // Validar los datos recibidos
    if (!isset($data['nombre']) || empty($data['nombre'])) {
        $response->getBody()->write(json_encode(['error' => 'El nombre de la localidad es requerido']));
        return $response->withStatus(400);
    } elseif (strlen($data['nombre']) > 50) {
        $response->getBody()->write(json_encode(['error' => 'El nombre de la localidad tiene que tener a lo sumo 50 caracteres']));
        return $response->withStatus(400);
    }

    // Actualizar la localidad en la base de datos
    try {
        $connection = getConnection();

        // Verificar si el nuevo nombre está repetido
        $nombre = $data['nombre'];
        $repetidos = $connection->query("SELECT * FROM localidades WHERE nombre = '$nombre'");
        if ($repetidos->rowCount() != 0) {
            $response->getBody()->write(json_encode(['error' => "Ya existe una localidad con el nombre $nombre"]));
            return $response->withStatus(400);
        }

        $stmt = $connection->prepare("UPDATE localidades SET nombre = :nombre WHERE id = :id");
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        // Verificar si se actualizó alguna fila
        if ($stmt->rowCount() == 0) {
            $response->getBody()->write(json_encode(['error' => 'La localidad con el ID especificado no existe']));
            return $response->withStatus(404);
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
    if (!isset($data['nombre']) || empty($data['nombre'])) {
        $response->getBody()->write(json_encode(['error' => 'El nombre del tipo de propiedad es requerido']));
        return $response->withStatus(400);
    } elseif (strlen($data['nombre']) >= 50) {
        $response->getBody()->write(json_encode(['error' => 'El nombre del tipo de propiedad debe tener a lo sumo 50 caracteres']));
        return $response->withStatus(400);
    }

    // Insertar el nuevo tipo de propiedad en la base de datos
    try {
        $connection = getConnection();

        // Verificar que el nombre no esté repetido
        $nombre = $data['nombre'];
        $repetidos = $connection->query("SELECT * FROM tipo_propiedades WHERE nombre = '$nombre'");
        if ($repetidos->rowCount() != 0){
            $response->getBody()->write(json_encode(['error' => "Ya existe un tipo de propiedad con el nombre $nombre"]));
            return $response->withStatus(400);
        }

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
        $response->getBody()->write(json_encode(['error' => 'ID de tipo de propiedad no válido']));
        return $response->withStatus(400);
    }

    // Eliminar el tipo de propiedad de la base de datos
    try {
        $connection = getConnection();

        // Verificar si existe el tipo de propiedad a eliminar
        $tipo_propiedad = $connection->query("SELECT * FROM tipo_propiedades WHERE id = '$id'");
        if ($tipo_propiedad->rowCount() == 0){
            $response->getBody()->write(json_encode(['error' => 'El tipo de propiedad con el ID especificado no existe']));
            return $response->withStatus(404);
        }

        //Verificar que no haya propiedades de ese tipo
        $ocurrencias = $connection->query("SELECT * FROM propiedades WHERE tipo_propiedad_id = '$id'");
        if ($ocurrencias->rowCount() != 0){
            $response->getBody()->write(json_encode(['error' => 'El tipo de propiedad con el ID especificado no se puede eliminar, debido a que existen propiedades registradas de ese tipo']));
            return $response->withStatus(400);
        }

        $stmt = $connection->prepare("DELETE FROM tipo_propiedades WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $response->getBody()->write(json_encode(["message" => "Tipo de propiedad eliminado correctamente"]));
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
        $response->getBody()->write(json_encode(['error' => 'ID de tipo de propiedad no válido']));
        return $response->withStatus(400);
    }

    // Obtener los datos enviados en el cuerpo de la solicitud
    $data = $request->getParsedBody();

    // Validar los datos recibidos
    if (!isset($data['nombre']) || empty($data['nombre'])) {
        $response->getBody()->write(json_encode(['error' => 'El nombre del tipo de propiedad es requerido']));
        return $response->withStatus(400);
    } elseif (strlen($data['nombre']) >= 50){
        $response->getBody()->write(json_encode(['error' => 'El nombre del tipo de propiedad debe tener a lo sumo 50 caracteres']));
        return $response->withStatus(400);
    }

    // Actualizar la localidad en la base de datos
    try {
        $connection = getConnection();

        // Verificar que el nombre no esté repetido
        $nombre = $data['nombre'];
        $repetidos = $connection->query("SELECT * FROM tipo_propiedades WHERE nombre = '$nombre'");
        if ($repetidos->rowCount() != 0){
            $response->getBody()->write(json_encode(['error' => "Ya existe un tipo de propiedad con el nombre $nombre"]));
            return $response->withStatus(400);
        }

        $stmt = $connection->prepare("UPDATE tipo_propiedades SET nombre = :nombre WHERE id = :id");
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        // Verificar si se actualizó alguna fila
        if ($stmt->rowCount() == 0) {
            $response->getBody()->write(json_encode(['error' => 'El tipo de propiedad con el ID especificado no existe']));
            return $response->withStatus(404);
        }

        $connection = null; // Cerrar la conexión

        $response->getBody()->write(json_encode(['message' => 'Tipo de propiedad actualizada correctamente']));
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

    // Verificar que todos los campos requeridos estén presentes
    $requiredFields = ['apellido', 'nombre', 'documento', 'email', 'activo'];
    $error = false;
    $campos_faltantes = "";
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            $campos_faltantes = $campos_faltantes . $field .", ";
            $error = true;
        }
    }
    if ($error){
        $response->getBody()->write(json_encode(['error' => "Los campos $campos_faltantes" . "son requeridos"]));
        return $response->withStatus(400);
    }

    // Validar los datos recibidos
    $restricciones = ['apellido' => 15, 'nombre' => 25, 'email' => 20];
    foreach ($restricciones as $key => $val){
        if (strlen($data[$key]) > $restricciones[$key]){
            $response->getBody()->write(json_encode(['error' => "El campo $key debe tener a lo sumo " . $restricciones[$key] . " caracteres"]));
            return $response->withStatus(400);
        }
    }
    if (!is_numeric($data['documento']) || $data['documento'] <= 0){
        $response->getBody()->write(json_encode(['error' => "El documento debe ser un numero entero positivo"]));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        //Verificar que el dni sea único
        $dni = $data['documento'];
        $repetidos = $connection->query("SELECT * FROM inquilinos WHERE documento= '$dni'");
        if ($repetidos->rowCount() != 0){
            $response->getBody()->write(json_encode(['error' => "Ya existe un inquilino con el documento $dni"]));
            return $response->withStatus(400);
        }

        $stmt = $connection->prepare("INSERT INTO inquilinos (apellido, nombre, documento, email, activo) VALUES (:apellido, :nombre, :documento, :email, :activo)");
        $stmt->bindParam(':apellido', $data['apellido']);
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':documento', $data['documento']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':activo', $data['activo']);
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
        $response->getBody()->write(json_encode(['error' => 'ID de inquilino no válido']));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        // Verificar si existe el inquilino a eliminar
        $inquilino = $connection->query("SELECT * FROM inquilinos WHERE id = $id");
        if ($inquilino->rowCount() == 0){
            $response->getBody()->write(json_encode(['error' => 'El inquilino con el ID especificado no existe']));
            return $response->withStatus(404);
        }
        
        //Verificar que no haya reservas registradas del inquilino
        $ocurrencias = $connection->query("SELECT * FROM reservas WHERE inquilino_id = $id");
        if ($ocurrencias->rowCount() != 0){
            $response->getBody()->write(json_encode(['error' => 'El inquilino con el ID especificado no se puede eliminar, debido a que existen reservas registradas a su nombre']));
            return $response->withStatus(400);
        }

        $stmt = $connection->prepare("DELETE FROM inquilinos WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $connection = null;

        $response->getBody()->write(json_encode(['message' => 'Inquilino eliminado correctamente']));
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
        $response->getBody()->write(json_encode(['error' => 'ID de inquilino no válido']));
        return $response->withStatus(400);
    }

    $data = $request->getParsedBody();
    // Validar los datos recibidos
    $restricciones = ['apellido' => 15, 'nombre' => 25, 'email' => 20];
    foreach ($restricciones as $key => $val){
        if (strlen($data[$key]) > $restricciones[$key]){
            $response->getBody()->write(json_encode(['error' => "El campo $key debe tener a lo sumo " . $restricciones[$key] . " caracteres"]));
            return $response->withStatus(400);
        }
    }

    $documento = $data['documento'];

    if (!is_numeric($documento) || $documento <= 0){
        $response->getBody()->write(json_encode(['error' => "El documento debe ser un numero entero positivo"]));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        //el documento debe ser unico
        $repetidos = $connection->query("SELECT * FROM inquilinos WHERE documento = '$documento' AND id != '$id'");
        if($repetidos->rowCount() > 0){
            $response->getBody()->write(json_encode(['error' => "Ya existe un inquilino con el documento '$documento'"]));
            return $response->withStatus(400);
        }

        //todos los campos son requeridos
        $stmt = $connection->prepare("UPDATE `inquilinos` SET `apellido`=:apellido, `nombre`=:nombre, `documento`=:documento, `email`=:email, `activo`=:activo WHERE id = $id");
        $stmt->bindParam(':apellido', $data['apellido']);
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':documento', $documento);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':activo', $data['activo']);
        $stmt->execute();

        if ($stmt->rowCount() == 0) {
            $response->getBody()->write(json_encode(['message' => 'El inquilino con el ID especificado no existe']));
            return $response->withStatus(404);
        }

        $connection = null;

        $response->getBody()->write(json_encode(['message' => 'Inquilino actualizado correctamente']));
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

    if (!ctype_digit($id) || $id <= 0) {
        $response->getBody()->write(json_encode(['error' => 'ID de inquilino no válido']));
        return $response->withStatus(400);
    }

    try {
        $conn = getConnection();
        $query = $conn->query("SELECT * FROM inquilinos WHERE id = '$id'");

        if ($query->rowCount() == 0) {
            $response->getBody()->write(json_encode(['error' => "El inquilino con el ID '$id' no existe"]));
            return $response->withStatus(400);    
        }

        $data = $query->fetchAll(PDO::FETCH_ASSOC);
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

    if (!ctype_digit($id) || $id <= 0) {
        $response->getBody()->write(json_encode(['error' => 'ID de inquilino no válido']));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();
        $stmt = $connection->prepare("SELECT * FROM reservas WHERE inquilino_id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($reservas)) {
            $response->getBody()->write(json_encode(['message' => 'El inquilino no tiene reservas registradas']));
            return $response->withStatus(200);
        }

        $connection = null;

        $response->getBody()->write(json_encode($reservas));
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

    // Verificar que todos los campos requeridos estén presentes
    $requiredFields = ['domicilio', 'localidad_id', 'cantidad_huespedes', 'fecha_inicio_disponibilidad', 'cantidad_dias', 'disponible', 'valor_noche', 'tipo_propiedad_id'];
    $error = false;
    $campos_faltantes = "";
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            $campos_faltantes = $campos_faltantes . $field .", ";
            $error = true;
        }
    }
    if ($error){
        $response->getBody()->write(json_encode(['error' => "Los campos $campos_faltantes" . "son requeridos"]));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        $campos = "";
        $parametros = "";
        foreach ($data as $key => $value) {
            if (isset($value) && !empty($value)){
                $campos = $campos . "$key, ";
                $parametros = $parametros . ":$key, ";
            }
        }
        $campos = substr($campos, 0, -2);
        $parametros = substr($parametros, 0, -2);
        
        $stmt = $connection->prepare("INSERT INTO propiedades ($campos) VALUES ($parametros)");
        
        foreach ($data as $key => $value) {
            if (isset($value) && !empty($value)){
                $stmt->bindParam(":$key",$value);
            }
        }

        $stmt->execute($data);

        $connection = null;

        $response->getBody()->write(json_encode(['message' => 'Propiedad creada correctamente']));
        return $response->withStatus(400);
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }   
});

//ELIMINAR
$app->delete('/propiedades/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id'];

    if (!ctype_digit($id) || $id <= 0) {
        $response->getBody()->write(json_encode(['error' => 'ID de propiedad no válido']));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        // Verificar si existe la propiedad a eliminar
        $propiedad = $connection->query("SELECT * FROM propiedades WHERE id = $id");
        if ($propiedad->rowCount() == 0){
            $response->getBody()->write(json_encode(['error' => 'La propiedad con el ID especificado no existe']));
            return $response->withStatus(404);
        }

        //Verificar que no haya reservas de esa propiedad
        $ocurrencias = $connection->query("SELECT * FROM reservas WHERE propiedad_id = $id");
        if ($ocurrencias->rowCount() != 0){
            $response->getBody()->write(json_encode(['error' => 'La propiedad con el ID especificado no se puede eliminar, debido a que existen reservas registradas de la misma']));
            return $response->withStatus(400);
        }

        $stmt = $connection->prepare("DELETE FROM propiedades WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $connection = null;

        $response->getBody()->write(json_encode(['message' => 'Propiedad eliminada correctamente']));
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

    if (!ctype_digit($id) || $id <= 0) {
        $response->getBody()->write(json_encode(['error' => 'ID de propiedad no válido']));
        return $response->withStatus(400);
    }

    //No creo que para editar sea necesario meter todos los datos, por ahí solo quiere editar uno de ellos
    
    // Verificar que todos los campos requeridos estén presentes
    $requiredFields = ['domicilio', 'localidad_id', 'cantidad_huespedes', 'fecha_inicio_disponibilidad', 'cantidad_dias', 'disponible', 'valor_noche', 'tipo_propiedad_id'];
    $error = false;
    $campos_faltantes = "";
    foreach ($requiredFields as $field) {
        if (!isset($data[$field])) {
            $campos_faltantes = $campos_faltantes . $field ." ";
            $error = true;
        }
    }
    if ($error){
        $response->getBody()->write(json_encode(['error' => "Los campos $campos_faltantes son requeridos"]));
        return $response->withStatus(400);
    }
    

    try {
        $connection = getConnection();

        $fecha_inicio_disponibilidad = $data["fecha_inicio_disponibilidad"];

        $fecha_fin_mayor = new DateTime('0000-00-00');

        $stmt = $connection->query("SELECT * FROM reservas WHERE propiedad_id = '$id'");

        while ($reserva = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $fecha_desde = new DateTime($reserva['fecha_desde']);
            $fecha_fin_reserva = clone $fecha_desde;
            $fecha_fin_reserva->modify('+' . $reserva['cantidad_noches'] . ' days');

            if ($fecha_fin_reserva > $fecha_fin_mayor) {
                $fecha_fin_mayor = $fecha_fin_reserva;
            }
        }

        $fecha_fin_mayor_format = $fecha_fin_mayor->format('Y-m-d');

        $stmt = $connection->query("SELECT * FROM propiedades WHERE id = '$id'");
        $propiedad = $stmt->fetch(PDO::FETCH_ASSOC);

        $fecha_inicio_disponibilidad_dt = new DateTime($propiedad['fecha_inicio_disponibilidad']);
        $diferencia = $fecha_inicio_disponibilidad_dt->diff($fecha_fin_mayor);
        if ($diferencia->format('%R') === '-') {
            $response->getBody()->write(json_encode(['error' => "No se puede modificar la fecha de inicio de disponibilidad de una propiedad para que sea anterior a la fecha requerida por la última reserva realizada"]));
            return $response->withStatus(404);
        } 
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

        if ($stmt->rowCount() == 0) {
            $response->getBody()->write(json_encode(['error' => 'La propiedad con el ID especificado no existe']));
            return $response->withStatus(404);
        }

        $connection = null;

        $response->getBody()->write(json_encode(['message' => 'Propiedad actualizada correctamente']));
        return $response->withStatus(200);
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }
});

//LISTAR
$app->get("/propiedades",function(Request $request,Response $response,$args){
    $data = $request->getQueryParams();

    try {
        $conn = getConnection();

        //Armamos la consulta SQL
        $sql = "SELECT * FROM propiedades";
        $condiciones = "";
        foreach ($data as $key => $value) {
            if (isset($value) && !empty($value)){
                $condiciones = $condiciones . " $key = $value AND";
            }
        }
        if ($condiciones!=""){
            $condiciones = substr($condiciones, 0, -4);
            $sql = $sql . " WHERE" . $condiciones;
        }
        
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
            "code" => 400,
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
        $response->getBody()->write(json_encode(['error' => 'ID de propiedad no válido']));
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
            $response->getBody()->write(json_encode(['error' => 'La propiedad con el ID especificado no existe']));
            return $response->withStatus(404);
        }
        
        $propiedad = $stmt->fetch(PDO::FETCH_ASSOC);

        $connection = null;

        
        $payload = [
            "status" => "success",
            "code" => 200,
            "data" => $propiedad
        ];

        /*
        if(count($errores)>0){
            $response->getBody()->write($errores); 
            return $response->withStatus(404);
        }else{
        */
            $response->getBody()->write(json_encode($payload));
            return $response->withHeader('Content-Type','application/json');
        //}
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

    // Verificar que todos los campos requeridos estén presentes
    $requiredFields = ['propiedad_id', 'inquilino_id', 'fecha_desde', 'cantidad_noches'];
    $error = false;
    $campos_faltantes = "";
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            $campos_faltantes = $campos_faltantes . $field .", ";
            $error = true;
        }
    }
    if ($error){
        $response->getBody()->write(json_encode(['error' => "Los campos $campos_faltantes" . "son requeridos"]));
        return $response->withStatus(400);
    }

    // Insertar la nueva reserva en la base de datos
    try {
        $connection = getConnection();

        $inquilino_id = $data['inquilino_id'];
        $inquilino = $connection->query("SELECT activo FROM inquilinos WHERE id = '$inquilino_id'");
        $propiedad_id = $data['propiedad_id'];
        $propiedad = $connection->query("SELECT * FROM propiedades WHERE id = '$propiedad_id'");
        
        if($propiedad->rowCount()==0){
            $response->getBody()->write(json_encode(['error' => "El inquilino con el id '$inquilino_id' no existe"]));
            return $response->withStatus(404);
        }

        if($inquilino->rowCount()==0){
            $response->getBody()->write(json_encode(['error' => "El inquilino con el id '$inquilino_id' no existe"]));
            return $response->withStatus(404);
        }

        $inquilino = $inquilino->fetch(PDO::FETCH_ASSOC);
        $propiedad = $propiedad->fetch(PDO::FETCH_ASSOC);
        $fecha_inicio_disponibilidad = new DateTime($propiedad['fecha_inicio_disponibilidad']);
        $fecha_desde = new DateTime($data['fecha_desde']);

        if (!$inquilino['activo']){
            $response->getBody()->write(json_encode(['error' => 'El inquilino no está activo']));
            return $response->withStatus(400);
        } elseif (!$propiedad['disponible']){
            $response->getBody()->write(json_encode(['error' => 'La propiedad no está disponible para ser alquilada']));
            return $response->withStatus(400);
        } 
        
        elseif ($fecha_desde <= $fecha_inicio_disponibilidad){
            $response->getBody()->write(json_encode(['error' => 'La propiedad no está disponible para la fecha solicitada']));
            return $response->withStatus(400);
        } 
        else {
            $stmt = $connection->prepare("INSERT INTO reservas (propiedad_id, inquilino_id, fecha_desde, cantidad_noches, valor_total) VALUES (:propiedad_id, :inquilino_id, :fecha_desde, :cantidad_noches, :valor_total)");
            
            $valorTotal = $propiedad['valor_noche'] * $data['cantidad_noches'];
            $stmt->bindParam(':propiedad_id', $data['propiedad_id']);
            $stmt->bindParam(':inquilino_id', $data['inquilino_id']);
            $stmt->bindParam(':fecha_desde', $data['fecha_desde']);
            $stmt->bindParam(':cantidad_noches', $data['cantidad_noches']);
            $stmt->bindParam(':valor_total',$valorTotal);

            $stmt->execute();
            
            $fecha_fin_reserva = clone $fecha_desde;
            $fecha_fin_reserva = $fecha_fin_reserva->modify('+' . $data['cantidad_noches'] . ' days');

            $fecha_fin_myqsl = $fecha_fin_reserva->format('Y-m-d');    
            $query = $connection->query("UPDATE propiedades SET fecha_inicio_disponibilidad = '$fecha_fin_myqsl' WHERE id = '$propiedad_id'");

            $response->getBody()->write(json_encode(['success' => 'La reserva fue agregada correctamente']));
            return $response->withStatus(201);
        }
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
        return $response->withStatus(500);
    }
});

//ELIMINAR
$app->delete('/reservas/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id'];

    if (!ctype_digit($id) || $id <= 0) {
        $response->getBody()->write(json_encode(['error' => 'ID de reserva no válido']));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        $reserva = $connection->query("SELECT * FROM reservas WHERE id = '$id'");

        if ($reserva->rowCount() == 0) {
            $connection = null;
            $response->getBody()->write(json_encode(['error' => 'La reserva con el ID especificado no existe']));
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
            $response->getBody()->write(json_encode(['error' => 'No se puede cancelar una reserva que pasada o en curso']));
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

// ----------------------------------------------------  FALTA CHECKEAR --------------------------------------------------------------------
//EDITAR
$app->put('/reservas/{id}', function (Request $request, Response $response, $args) {
    $data = $request->getParsedBody();
    $id = $args['id'];

    if (!ctype_digit($id) || $id <= 0) {
        $response->getBody()->write(json_encode(['error' => 'ID de propiedad no válido']));
        return $response->withStatus(400);
    }

    // Verificar que todos los campos requeridos estén presentes
    $requiredFields = ['propiedad_id', 'inquilino_id', 'fecha_desde', 'cantidad_noches'];
    $error = false;
    $campos_faltantes = "";
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            $campos_faltantes = $campos_faltantes . $field .", ";
            $error = true;
        }
    }
    if ($error){
        $response->getBody()->write(json_encode(['error' => "Los campos $campos_faltantes" . "son requeridos"]));
        return $response->withStatus(400);
    }

    $fecha_desde = new DateTime($data['fecha_desde']);

    if ($fecha_desde <= date("Y-m-d")){
        $connection = null;
        $response->getBody()->write(json_encode(['error' => 'La fecha de inicio debe ser posterior a la fecha actual']));
        return $response->withStatus(400);
    }

    try {
        $connection = getConnection();

        $nuevo_inquilino = $connection->query("SELECT * FROM inquilinos WHERE id = " . $data['inquilino_id'])->fetch(PDO::FETCH_ASSOC);
        if (!$nuevo_inquilino['activo']){
            $connection = null;
            $response->getBody()->write(json_encode(['error' => 'El nuevo inquilino no está activo']));
            return $response->withStatus(400);
        }
        
        $nueva_propiedad = $connection->query("SELECT * FROM propiedades WHERE id = " . $data['propiedad_id'])->fetch(PDO::FETCH_ASSOC);
        if (!$nueva_propiedad['disponible']){
            $connection = null;
            $response->getBody()->write(json_encode(['error' => 'La nueva propiedad no está disponible']));
            return $response->withStatus(400);
        }

        $reserva = $connection->query("SELECT * FROM reservas WHERE id = " . $id)->fetch(PDO::FETCH_ASSOC);

        if (empty($reserva)){
            $connection = null;
            $response->getBody()->write(json_encode(['error' => 'La reserva con el ID especificado no existe']));
            return $response->withStatus(404);
        }

        //Verificamos que la reserva no esté en curso

        if (fechaEnIntervalo(date("Y-m-d"),$reserva['fecha_desde'],$reserva['cantidad_noches'])){
            $connection = null;
            $response->getBody()->write(json_encode(['error' => 'No se puede editar una reserva en curso']));
            return $response->withStatus(400);
        } 
        
        //Verificamos que la propiedad esté disponible para la fecha solicitada
        $fecha_inicio_disponibilidad = new DateTime($nueva_propiedad['fecha_inicio_disponibilidad']);
        
        if ($fecha_desde <= $fecha_inicio_disponibilidad){
            $response->getBody()->write(json_encode(['error' => 'La propiedad no está disponible para la fecha solicitada']));
            return $response->withStatus(400);
        }

        //Editamos la reserva
        $stmt = $connection->prepare("UPDATE reservas SET propiedad_id = :propiedad_id, inquilino_id = :inquilino_id, fecha_desde = :fecha_desde, cantidad_noches = :cantidad_noches WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':propiedad_id',$data['propiedad_id']);
        $stmt->bindParam(':inquilino_id',$data['inquilino_id']);
        $stmt->bindParam(':fecha_desde',$data['fecha_desde']);
        $stmt->bindParam(':cantidad_noches',$data['cantidad_noches']);
        $stmt->bindParam(':valor_total',$reserva['valor_noche']/$reserva['cantidad_noches']*$data['cantidad_noches']);

        $stmt->execute($data);

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
