<?php

return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';

  // Add entry
$app->post('/entry', function ($request, $response) {
    $data = $request->getParsedBody();
    $entry = new Entry($this->db);

    $entry->addEntry($data["title"], $data["content"]);
})->add($auth);

  // Get entry by ID
  $app->get('/entry/{id}', function ($request, $response, $args){
    $id = $args['id'];
    $entry = new Entry($this->db);
    return $response->withJson($entry->getEntry($id));
  });

  // Edit entry
  $app->put('/entry/{id}', function ($request, $response, $args){
    $data = $request->getParsedBody();
    $id = $args['id'];
    $entry = new Entry($this->db);
    $entry->editEntry($id, $data['title'], $data['content']);
  })->add($auth);
  
  // Delete entry
  $app->delete('/entry/{id}', function ($request, $response, $args){
    $id = $args['id'];
    $entry = new Entry($this->db);
    $entry->deleteEntry($id);
  })->add($auth);

  // Get x-amount of entries from DB
  $app->get('/index/entries/{num}', function ($request, $response, $args) {
    $num = $args['num'];
    $entry = new Entry($this->db);
    return $response->withJson($entry->getSomeEntries($num));
  });
  
  // Get all entries from DB
  $app->get('/entries/all', function ($request, $response, $args) {
    $entry = new Entry($this->db);
    return $response->withJson($entry->getAllEntries());
  })->add($auth);
  
  // Get all entries from specific user
  $app->get('/entries/{id}', function ($request, $response, $args) {
    $id = $args['id'];
    $entry = new Entry($this->db);
    return $response->withJson($entry->getEntriesByUser($id));
  })->add($auth);
  
};