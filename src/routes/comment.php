<?php

return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';

  // Add comment
$app->post('/comment', function ($request, $response) {
    $data = $request->getParsedBody();
    $comment = new Comment($this->db);
    $comment->addComment($data["entryID"], $data["content"]);
    return $response;
})->add($auth);

  // Delete comment
$app->delete('/comment/{id}', function ($request, $response, $args){
  $id = $args['id'];
  $comment = new Comment($this->db);
  $comment->deleteComment($id);
})->add($auth);

  // Edit comment
$app->put('/comment/{id}', function ($request, $response, $args){
  $data = $request->getParsedBody();
  $id = $args['id'];
  $comment = new Comment($this->db);
  $comment->editComment($id, $data['content']);
  return $response;
})->add($auth);

  // Get comments by post ID
$app->get('/comments/{id}', function ($request, $response, $args) {
  $id = $args['id'];
  $comment = new Comment($this->db);
  return $response->withJson($comment->getCommentsById($id));
});

};