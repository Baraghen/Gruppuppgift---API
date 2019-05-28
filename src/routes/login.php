<?php

return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';

  // Add a login route
  $app->post('/api/login', function ($request, $response) {
    $data = $request->getParsedBody();
    $login = new Login($this->db);
    if($login->loginUser($data['username'], $data['password']) == "error"){
      return $response->withStatus(401);
    }else {
    return $response->withJson($login->loginUser($data['username'], $data['password']));
    }
  });

  // Register a user
  $app->post('/api/register', function ($request, $response) {
    $data = $request->getParsedBody();
    $login = new Login($this->db);
    if($login->registerUser($data['username'], $data['password']) == "error"){
      return $response->withStatus(401);
    } 
  });

  // Add a ping route
  $app->get('/api/ping', function ($request, $response, $args) {
    return $response->withJson(['loggedIn' => true]);
  })->add($auth);
};
