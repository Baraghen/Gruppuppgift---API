<?php

class Comment extends Mapper {

  // Selects all comments that belong to a specific post
  public function getCommentsById($entryID) {
    $orderby = 'DESC';
    $statement = $this->db->prepare("SELECT * FROM comments WHERE entryID = :entryID ORDER BY createdAt {$orderby}");
    $statement->bindParam(':entryID', $entryID, PDO::PARAM_INT);
    $statement->execute();
    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }

  // Adds comment to the database
  public function addComment($entryID, $content) {
    $statement = $this->db->prepare("INSERT INTO comments (entryID, content, createdBy, createdAt)
    VALUES (:entryID, :content, :createdBy, :createdAt)");
    $statement->bindParam(':entryID', $entryID, PDO::PARAM_INT);
    $statement->bindParam(':content', $content);
    $statement->bindParam(':createdBy', $_SESSION["userID"], PDO::PARAM_INT);
    $statement->bindParam(':createdAt', date('Y-m-d H:i:s'));
    $statement->execute();
  }

  // Deletes comment from the database
  public function deleteComment($id){
    $statement = $this->db->prepare("DELETE FROM comments WHERE commentID = :id");
    $statement->bindParam(':id', $id, PDO::PARAM_INT);
    $statement->execute();
  }

  // Edits comment from the database
  public function editComment($id, $content){
    $statement = $this->db->prepare("UPDATE comments SET content = :content, createdAt = :createdAt  WHERE commentID = :id");
    $statement->bindParam(':content', $content);
    $statement->bindParam(':createdAt', date('Y-m-d H:i:s'));
    $statement->bindParam(':id', $id, PDO::PARAM_INT);
    $statement->execute();
  }
}
