<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();
$app->addRoutingMiddleware();
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

// ACÁ VAN LOS ENDPOINTS
$app->get('/',function(Request $request,Response $response,$args){
    $response->getBody()->write('Hola mundo!!');
    return $response->withHeader('Content-Type', 'application/json');
});

/*
falta checkear
$app->post('/localidades',function(Request $request,Response $response,$args){
    $data = $request->getParsedBody();
    $name = $data['name'];

    $connection->getConnection();
    try {
        $query = $connection->query("INSERT INTO `productos`(`nombre`) VALUES ('$name')");
        
        $response->getBody()->write(json_encode(['status' => 'success', 'message' => 'Producto agregado correctamente']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode(['status' => 'error', 'message' => 'Error al agregar producto: ' . $e->getMessage()]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
});
*/


//-----------------------------------------------------------//
//------------------------LOCALIDADES------------------------//
//-----------------------------------------------------------//


//CREAR
$app->post('/localidades', function (Request $request, Response $response) {
    // Obtener los datos de la solicitud
    $data = $request->getParsedBody();

    // Validar los datos recibidos
    if (!isset($data['nombre']) || empty($data['nombre']) || strlen($data['nombre']) <= 50) {
        return $response->withJson(['error' => 'El nombre de la localidad es requerido'], 400);
    }

    // Insertar la nueva localidad en la base de datos
    try {
        $connection = getConnection();
        $stmt = $connection->prepare("INSERT INTO localidades (nombre) VALUES (:nombre)");
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->execute();
        $connection = null; // Cerrar la conexión

        return $response->withJson(['message' => 'Localidad insertada correctamente'], 201);
    } catch (PDOException $e) {
        return $response->withJson(['error' => 'Error al insertar la localidad'], 500);
    }
});

//ELIMINAR
$app->delete('/localidades/{id}', function (Request $request, Response $response, $args) {
    // Obtener el ID de la localidad a eliminar
    $id = $args['id'];

    // Verificar que el ID sea un número entero positivo
    if (!ctype_digit($id) || $id <= 0) {
        return $response->withJson(['error' => 'ID de localidad no válido'], 400);
    }

    // Eliminar la localidad de la base de datos
    try {
        $connection = getConnection();
        $stmt = $connection->prepare("DELETE FROM localidades WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        // Verificar si se eliminó alguna fila
        if ($stmt->rowCount() == 0) {
            return $response->withJson(['error' => 'La localidad con el ID especificado no existe'], 404);
        }

        $connection = null; // Cerrar la conexión

        return $response->withJson(['message' => 'Localidad eliminada correctamente']);
    } catch (PDOException $e) {
        return $response->withJson(['error' => 'Error al eliminar la localidad'], 500);
    }
});

//EDITAR
$app->put('/localidades/{id}', function (Request $request, Response $response, $args) {
    // Obtener el ID de la localidad a editar
    $id = $args['id'];

    // Verificar que el ID sea un número entero positivo
    if (!ctype_digit($id) || $id <= 0 ) {
        return $response->withJson(['error' => 'ID de localidad no válido'], 400);
    }

    // Obtener los datos enviados en el cuerpo de la solicitud
    $data = $request->getParsedBody();

    // Validar los datos recibidos
    if (!isset($data['nombre']) || empty($data['nombre']) || strlen($data['nombre']) <= 50) {
        return $response->withJson(['error' => 'El nombre de la localidad es requerido'], 400);
    }

    // Actualizar la localidad en la base de datos
    try {
        $connection = getConnection();
        $stmt = $connection->prepare("UPDATE localidades SET nombre = :nombre WHERE id = :id");
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        // Verificar si se actualizó alguna fila
        if ($stmt->rowCount() == 0) {
            return $response->withJson(['error' => 'La localidad con el ID especificado no existe'], 404);
        }

        $connection = null; // Cerrar la conexión

        return $response->withJson(['message' => 'Localidad actualizada correctamente']);
    } catch (PDOException $e) {
        return $response->withJson(['error' => 'Error al actualizar la localidad'], 500);
    }
});

//LISTAR
$app->get("/localidades",function(Request $request,Response $response,$args){
    $conn = getConnection();
    try {
        //code...
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
            'data' => $e.getMessage()
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
    if (!isset($data['nombre']) || empty($data['nombre']) || strlen($data['nombre']) <= 50) {
        return $response->withJson(['error' => 'El nombre del tipo de propiedad es requerido'], 400);
    }

    // Insertar el nuevo tipo de propiedad en la base de datos
    try {
        $connection = getConnection();
        $stmt = $connection->prepare("INSERT INTO tipos_propiedad (nombre) VALUES (:nombre)");
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->execute();
        $connection = null; // Cerrar la conexión

        return $response->withJson(['message' => 'Tipo de propiedad insertado correctamente'], 201);
    } catch (PDOException $e) {
        return $response->withJson(['error' => 'Error al insertar el tipo de propiedad'], 500);
    }
});

//ELIMINAR
$app->delete('/tipos_propiedad/{id}', function (Request $request, Response $response, $args) {
    // Obtener el ID del tipo de propiedad a eliminar
    $id = $args['id'];

    // Verificar que el ID sea un número entero positivo
    if (!ctype_digit($id) || $id <= 0) {
        return $response->withJson(['error' => 'ID de tipo de propiedad no válido'], 400);
    }

    // Eliminar el tipo de propiedad de la base de datos
    try {
        $connection = getConnection();
        $stmt = $connection->prepare("DELETE FROM tipos_propiedad WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        // Verificar si se eliminó alguna fila
        if ($stmt->rowCount() == 0) {
            return $response->withJson(['error' => 'El tipo de propiedad con el ID especificado no existe'], 404);
        }

        $connection = null; // Cerrar la conexión

        return $response->withJson(['message' => 'Tipo de propiedad eliminado correctamente']);
    } catch (PDOException $e) {
        return $response->withJson(['error' => 'Error al eliminar el tipo de propiedad'], 500);
    }
});

//EDITAR
$app->put('/tipos_propiedad/{id}', function (Request $request, Response $response, $args) {
    // Obtener el ID del tipo de propiedad a editar
    $id = $args['id'];

    // Verificar que el ID sea un número entero positivo
    if (!ctype_digit($id) || $id <= 0) {
        return $response->withJson(['error' => 'ID de tipo de propiedad no válido'], 400);
    }

    // Obtener los datos enviados en el cuerpo de la solicitud
    $data = $request->getParsedBody();

    // Validar los datos recibidos
    if (!isset($data['nombre']) || empty($data['nombre']) || strlen($data['nombre']) <= 50) {
        return $response->withJson(['error' => 'El nombre del tipo de propiedad es requerido'], 400);
    }

    // Actualizar la localidad en la base de datos
    try {
        $connection = getConnection();
        $stmt = $connection->prepare("UPDATE tipos_propiedad SET nombre = :nombre WHERE id = :id");
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        // Verificar si se actualizó alguna fila
        if ($stmt->rowCount() == 0) {
            return $response->withJson(['error' => 'El tipo de propiedad con el ID especificado no existe'], 404);
        }

        $connection = null; // Cerrar la conexión

        return $response->withJson(['message' => 'Tipo de propiedad actualizada correctamente']);
    } catch (PDOException $e) {
        return $response->withJson(['error' => 'Error al actualizar el tipo de propiedad'], 500);
    }
});

//LISTAR
$app->get("/tipos_propiedad",function(Request $request,Response $response, $args){
    $conn = getConnection();
    try {
        $query = $conn->query("INSERT INTO nombre_tabla VALUES (val1, val2, ...)");
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
    $restricciones = strlen($data['apellido'])<=15 && strlen($data['nombre'])<=25 && strlen($data['email'])<=20 && is_int($data['documento']) && is_bool($data['activo']);
    if (!isset($data['apellido']) || !isset($data['nombre']) || !isset($data['documento']) || !isset($data['email']) || !isset($data['activo']) || !$restricciones) {
        return $response->withJson(['error' => 'Todos los campos son requeridos'], 400);
    }

    try {
        $connection = getConnection();
        $stmt = $connection->prepare("INSERT INTO inquilinos (apellido, nombre, documento, email, activo) VALUES (:apellido, :nombre, :documento, :email, :activo)");
        $stmt->bindParam(':apellido', $data['apellido']);
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':documento', $data['documento']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':activo', $data['activo']);
        $stmt->execute();
        $connection = null;

        return $response->withJson(['message' => 'Inquilino creado correctamente'], 201);
    } catch (PDOException $e) {
        return $response->withJson(['error' => 'Error al crear el inquilino'], 500);
    }
});

//ELIMINAR
$app->delete('/inquilinos/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id'];

    if (!ctype_digit($id) || $id <= 0) {
        return $response->withJson(['error' => 'ID de inquilino no válido'], 400);
    }

    try {
        $connection = getConnection();
        $stmt = $connection->prepare("DELETE FROM inquilinos WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        if ($stmt->rowCount() == 0) {
            return $response->withJson(['error' => 'El inquilino con el ID especificado no existe'], 404);
        }

        $connection = null;

        return $response->withJson(['message' => 'Inquilino eliminado correctamente']);
    } catch (PDOException $e) {
        return $response->withJson(['error' => 'Error al eliminar el inquilino'], 500);
    }
});


//EDITAR
$app->put('/inquilinos/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id'];

    if (!ctype_digit($id) || $id <= 0) {
        return $response->withJson(['error' => 'ID de inquilino no válido'], 400);
    }

    $data = $request->getParsedBody();

    // Validar los datos recibidos
    $restricciones = strlen($data['apellido'])<=15 && strlen($data['nombre'])<=25 && strlen($data['email'])<=20 && is_int($data['documento']) && is_bool($data['activo']);
    if (!isset($data['apellido']) || !isset($data['nombre']) || !isset($data['documento']) || !isset($data['email']) || !isset($data['activo']) || !$restricciones) {
        return $response->withJson(['error' => 'Todos los campos son requeridos'], 400);
    }

    try {
        $connection = getConnection();
        $stmt = $connection->prepare("UPDATE inquilinos SET apellido = :apellido, nombre = :nombre, documento = :documento, email = :email, activo = :activo WHERE id = :id");
        $stmt->bindParam(':apellido', $data['apellido']);
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':documento', $data['documento']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':activo', $data['activo']);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        if ($stmt->rowCount() == 0) {
            return $response->withJson(['error' => 'El inquilino con el ID especificado no existe'], 404);
        }

        $connection = null;

        return $response->withJson(['message' => 'Inquilino actualizado correctamente']);
    } catch (PDOException $e) {
        return $response->withJson(['error' => 'Error al actualizar el inquilino'], 500);
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
            "code" => 400,
            "data" => $e->getMessage()
        ];

        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type','application/json');
    }
});
//VER_INQUILINO
$app->post("/inquilinos",function(Request $request,Response $response, $args){
    $conn = getConnection();
    $data = $request->getParsedBody();
    try {
        $apellido = $data["apellido"];
        $nombre = $data["nombre"];
        $documento = $data["documento"];
        $email = $data["email"];
        $activo = $data["activo"];
        $query = $conn->query("INSERT INTO `inquilinos`(`apellido`, `nombre`, `documento`, `email`, `activo`) VALUES ('$apellido','$nombre','$documento','$email','$activo')");

        $response->getBody()->write(["message" => "ejecutado"]);
        return $response->withHeader("Content-Type","application/json");
    } catch (PDOException $e) {
        $response->getBody()->write(["message" => e.getMessage()]);
        return $response->withHeader("Content-Type","application/json");
    }
});

$app->delete("/inquilinos/{id}", function(Request $request, Response $response, $args) {
    $id = $args["id"];
    $conn = getConnection();
    try {
        $query = $conn->prepare("DELETE FROM inquilinos WHERE id = :id");
        $query->execute([':id' => $id]);

        if ($query->rowCount() > 0) {
            $payload = [
                "status" => "success",
                "code" => 200,
                "message" => "Registro eliminado correctamente"
            ];
        } else {
            $payload = [
                "status" => "error",
                "code" => 404,
                "message" => "No se encontró el registro con el ID proporcionado"
            ];
        }

        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type','application/json');
    } catch (PDOException $e) {
        $payload = [
            "status" => "error",
            "code" => 500,
            "message" => "Error al eliminar el registro: " . $e->getMessage()
        ];

        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type','application/json');
    }
});

$app->get("/inquilinos/{id}",function(Request $request,Response $response,$args){
    $id=$args["id"];
    $conn=getConnection();
    try {
        $query = $conn->query("SELECT * FROM inquilinos WHERE id = $id");
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

//HISTORIAL DE RESERVAS
$app->get('/inquilinos/{idInquilino}/reservas', function (Request $request, Response $response, $args) {
    $id = $args['idInquilino'];

    if (!ctype_digit($id) || $id <= 0) {
        return $response->withJson(['error' => 'ID de inquilino no válido'], 400);
    }

    try {
        $connection = getConnection();
        $stmt = $connection->prepare("SELECT * FROM reservas WHERE inquilino_id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($reservas)) {
            return $response->withJson(['message' => 'El inquilino no tiene reservas']);
        }

        $connection = null;

        return $response->withJson($reservas);
    } catch (PDOException $e) {
        return $response->withJson(['error' => 'Error al obtener el historial de reservas del inquilino'], 500);
    }
});


//-----------------------------------------------------------//
//------------------------PROPIEDADES------------------------//
//-----------------------------------------------------------//


//CREAR
$app->post('/propiedades', function (Request $request, Response $response) {
    $data = $request->getParsedBody();

    // Verificar que todos los campos requeridos estén presentes
    $requiredFields = ['domicilio', 'localidad_id', 'cantidad_huespedes', 'fecha_inicio_disponibilidad', 'cantidad_dias', 'disponible', 'valor_noche', 'tipo_propiedad_id', 'imagen', 'tipo_imagen'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field])) {
            return $response->withJson(['error' => "El campo $field es requerido"], 400);
        }
    }

    try {
        $connection = getConnection();
        $stmt = $connection->prepare("INSERT INTO propiedades (domicilio, localidad_id, cantidad_habitaciones, cantidad_banios, cochera, cantidad_huespedes, fecha_inicio_disponibilidad, cantidad_dias, disponible, valor_noche, tipo_propiedad_id, imagen, tipo_imagen) VALUES (:domicilio, :localidad_id, :cantidad_habitaciones, :cantidad_banios, :cochera, :cantidad_huespedes, :fecha_inicio_disponibilidad, :cantidad_dias, :disponible, :valor_noche, :tipo_propiedad_id, :imagen, :tipo_imagen)");
        $stmt->execute($data);
        $connection = null;

        return $response->withJson(['message' => 'Propiedad creada correctamente'], 201);
    } catch (PDOException $e) {
        return $response->withJson(['error' => 'Error al crear la propiedad'], 500);
    }
});

//ELIMINAR
$app->delete('/propiedades/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id'];

    if (!ctype_digit($id) || $id <= 0) {
        return $response->withJson(['error' => 'ID de propiedad no válido'], 400);
    }

    try {
        $connection = getConnection();
        $stmt = $connection->prepare("DELETE FROM propiedades WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        if ($stmt->rowCount() == 0) {
            return $response->withJson(['error' => 'La propiedad con el ID especificado no existe'], 404);
        }

        $connection = null;

        return $response->withJson(['message' => 'Propiedad eliminada correctamente']);
    } catch (PDOException $e) {
        return $response->withJson(['error' => 'Error al eliminar la propiedad'], 500);
    }
});

//EDITAR
$app->put('/propiedades/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id'];
    $data = $request->getParsedBody();

    if (!ctype_digit($id) || $id <= 0) {
        return $response->withJson(['error' => 'ID de propiedad no válido'], 400);
    }

    // Verificar que todos los campos requeridos estén presentes
    $requiredFields = ['domicilio', 'localidad_id', 'cantidad_huespedes', 'fecha_inicio_disponibilidad', 'cantidad_dias', 'disponible', 'valor_noche', 'tipo_propiedad_id'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field])) {
            return $response->withJson(['error' => "El campo $field es requerido"], 400);
        }
    }

    try {
        $connection = getConnection();
        $stmt = $connection->prepare("UPDATE propiedades SET domicilio = :domicilio, localidad_id = :localidad_id, cantidad_habitaciones = :cantidad_habitaciones, cantidad_banios = :cantidad_banios, cochera = :cochera, cantidad_huespedes = :cantidad_huespedes, fecha_inicio_disponibilidad = :fecha_inicio_disponibilidad, cantidad_dias = :cantidad_dias, disponible = :disponible, valor_noche = :valor_noche, tipo_propiedad_id = :tipo_propiedad_id, imagen = :imagen, tipo_imagen = :tipo_imagen WHERE id = :id");
        $stmt->execute($data);

        if ($stmt->rowCount() == 0) {
            return $response->withJson(['error' => 'La propiedad con el ID especificado no existe'], 404);
        }

        $connection = null;

        return $response->withJson(['message' => 'Propiedad actualizada correctamente']);
    } catch (PDOException $e) {
        return $response->withJson(['error' => 'Error al actualizar la propiedad'], 500);
    }
});

//LISTAR
$app->get("/propiedades",function(Request $request,Response $response,$args){
    $conn = getConnection();
    try {
        $query = $conn->query("SELECT * FROM propiedades");
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

//VER_PROPIEDAD
$app->get('/propiedades/{id}', function (Request $request, Response $response, $args) {
    $id = $args['id'];

    if (!ctype_digit($id) || $id <= 0) {
        return $response->withJson(['error' => 'ID de propiedad no válido'], 400);
    }

    try {
        $connection = getConnection();
        $stmt = $connection->prepare("SELECT * FROM propiedades WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $propiedad = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$propiedad) {
            return $response->withJson(['error' => 'La propiedad con el ID especificado no existe'], 404);
        }

        $connection = null;

        return $response->withJson($propiedad);
    } catch (PDOException $e) {
        return $response->withJson(['error' => 'Error al obtener la propiedad'], 500);
    }
});



//--------------------------------------------------------//
//------------------------RESERVAS------------------------//
//--------------------------------------------------------//




$app->run();
