<?php

return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';
  
  // Gets all users from the DB
  $app->get('/user/all', function ($request, $response) {
    $user = new User($this->db);
    return $response->withJson($user->getAllUsers());
  })->add($auth);
  
  // Basic protected GET route 
  $app->get('/user/{id}', function ($request, $response, $args) {
    $userID = $args['id'];
    $user = new User($this->db);

    return $response->withJson($user->getUserByID($userID));
  })->add($auth);
  
};
