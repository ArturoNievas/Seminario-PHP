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

$app->get('/localidades',function(Request $request,Response $response,$args){
    $connection = getConnection();
    try {
        $query = $connection->query('SELECT * FROM localidades');
        $tipos = $query->fetchAll(PDO::FETCH_ASSOC);

        $playload = json_encode([
            'status' => 'success',
            'code' => 200,
            'data' => $tipos
        ]);

        $response->getBody()->write($playload);
        return $response->withHeader('Content-Type', 'application/json');
    } catch (PDOException $e) {
        $playload = json_encode([
            'status' => 'success',
            'code' => 400
        ]);

        $response->getBody()->write($playload);
        return $response->withHeader('Content-Type', 'application/json');
    }
});

$app->run();
