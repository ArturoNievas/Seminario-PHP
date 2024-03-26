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

// ACÁ VAN LOS ENDPOINTS
$app->post('/localidades',function(Request $request,Response $response,$args){
    $connection->getConnection();
    try {
        //crear fila con $name
        $name=$args['name'];
        $query=$connection->$query('INSERT INTO `productos`(`nombre`) VALUES ('[$name]')');

        //...
    } catch (PDOException $e) {
        //throw $e;
    }
});

$app->egt('/localidades',function(Request $request,Response $response,$args){
    $connection->getConnection();
    try {
        $query = $connection->query('SELECT * FROM localidades');
        $tipos = $query->fetchAll(FDO::FETCH_ASSOC);

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
